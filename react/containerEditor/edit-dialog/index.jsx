import React from 'react';
import { connect } from 'react-redux';
import ModalWindow from 'components/modal-window';
import {TextInput, Checkbox} from 'components/forms'
import modState from '../selector';
import appState from 'services/app/selector';
import {getContainer} from 'services/data/selector';
import {closeEditDialog} from '../actions';
import {
    editContainer,
    createContainer
} from 'services/data/actions';

import {Row, Divider, Col3, Col9} from 'components/grid';


const headerTextEdit = [
    '',
    'Изменить карту',
    'Изменить папку',
    'Изменить векторный слой',
    'Изменить виртуальный слой'
];

const headerTextCreate = [
    '',
    'Создать карту',
    'Создать папку',
    'Создать векторный слой',
    'Создать виртуальный слой'
];


class EditDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.renderNames = this.renderNames.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    createNamesArray() {
        return this.locales.map(locale => {
            let name = {};
            name[locale.code] = '';
            return name;
        })
    }

    onChange(event) {
        const updater = {};

        if (event.target.type === 'checkbox') {
            updater[event.target.name] = event.target.checked;

            if (event.target.name === 'localized_name') {
                if (event.target.checked) {
                    updater['names'] = this.createNamesArray();
                    updater['names'][0][this.locales[0].code] = this.state.name;
                } else {
                    updater['name'] = this.state.names[0][this.locales[0].code];
                }
            }
        } else {
            if (event.target.name === 'name' && event.target.getAttribute('role')) {
                const role = event.target.getAttribute('role');
                const names = [];
                let _name;
                this.state.names.forEach(name => {
                    if (role in name) {
                        _name = {};
                        _name[role] = event.target.value;
                        names.push(_name);
                    } else {
                        names.push(name);
                    }
                    updater['names'] = names;
                })
            } else {
                updater[event.target.name] = event.target.value;
            }
        }

        this.setState({
            ...this.state,
            ...updater
        });
    }

    onSubmit() {
        let changes = {...this.state};

        if (changes.localized_name) {
            delete changes['name'];
        } else {
            delete changes['names'];
        }

        for (let attr in changes) {
            if (changes[attr] !== null && typeof changes[attr] === 'object') {
                if (JSON.stringify(changes[attr]) === JSON.stringify(this.props.initValues[attr])) {
                    delete changes[attr];
                }
            } else if (changes[attr] + '' === this.props.initValues[attr] + '') {
                delete changes[attr];
            }
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(changes, this.props.container.id);
        }
    }

    renderNames(values) {
        if (!values.localized_name) {
            return (
                <TextInput
                    placeholder="можно оставить пустым"
                    onChange={this.onChange}
                    name="name"
                    value={values.name}
                />
            )
        } else {
            return values.names.map((name, i) => {
                return (
                    <TextInput
                        key={this.locales[i].code}
                        placeholder="можно оставить пустым"
                        onChange={this.onChange}
                        name="name"
                        role={this.locales[i].code}
                        value={name[this.locales[i].code]}
                        addon={'(' + this.locales[i].code + ')'}
                    />
                )
            })
        }
    }

    localizedNameInput() {
        const elements = [];

        if (this.locales.length > 1) {
            elements.push(
                <Row  key="1">
                    <Col3>
                        <label className="inline">Локализация</label>
                    </Col3>
                    <Col9>
                        <Checkbox
                            name="localized_name"
                            label="Название"
                            onChange={this.onChange}
                            defaultChecked={this.state.localized_name}
                        />
                    </Col9>
                </Row>
            );
            elements.push(<Divider key="2" />);
        }

        return elements;
    }

    submitButton() {
        return this.props.container.id
            ? <button onClick={this.onSubmit}>Изменить</button>
            : <button onClick={this.onSubmit}>Создать</button>;
    }

    componentWillReceiveProps(nextProps) {
        this.state = {...nextProps.values};

        if (nextProps.container) {
            this.locales = nextProps.container.type === 1
                ? nextProps.container.locales
                : nextProps.map.locales;
        }
    }

    render() {

        const container = this.props.container;
        if (!container) {
            return null;
        }

        const modalProps = {
            onClose: () => this.props.onClose,
            headerContent: container.id ? headerTextEdit[container.type] : headerTextCreate[container.type],
            width: 480,
            className: 'forms',
            bodyClassName: 'container',
            ...this.props
        };

        return (
            <ModalWindow {...modalProps}>
                {this.localizedNameInput()}

                <Row>
                    <Col3>
                        <label className="inline">Название</label>
                    </Col3>
                    <Col9>
                        {this.renderNames(this.state, this.locales)}
                    </Col9>
                </Row>

                <Divider />

                <Row>
                    <Col3>
                        <label className="inline">Код</label>
                    </Col3>
                    <Col9>
                        <TextInput
                            placeholder="если не указан, будет назначен автоматически"
                            onChange={this.onChange}
                            name="code"
                            value={this.state.code}
                        />
                    </Col9>
                </Row>

                <Divider />

                {this.submitButton()}
            </ModalWindow>
        )
    }
}


const mapStateToProps = function(state) {
    return {
        map: appState().mapModel,
        container: modState().editDialog.container,
        ...modState().editDialog
    }
};

const mapDispatchToProps = function(dispatch){
    return {
        onClose: () => {
            dispatch(closeEditDialog());
        },

        onSubmit: (changes, containerId) => {
            if (containerId) {
                dispatch(editContainer(changes, containerId));
            } else {
                dispatch(createContainer(changes));
            }
        }
    }
};


export default (connect(mapStateToProps, mapDispatchToProps)(EditDialog));
