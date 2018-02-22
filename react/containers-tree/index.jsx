import React from 'react';
import { connect } from 'react-redux';
import TreeView from 'components/tree';
import data from 'services/data/selector';
import {baseUrl} from 'services/urls';
import tree from './selector';
import {getNodeState} from './selector';
import {initNodeStates,toggleExpanded, setNodesState} from './actions';


const getNodes = (state) => {
    const states = tree().states;
    return data().containers.map(cont => {
        const node = {
            id: cont.id,
            label: cont.name !== '' ? cont.name : cont.code,
            icon: 'mtv-icon-map',
            parent: cont.parent,
            checked: false,
            expanded: false,
            hidden: false,
            disabled: false,
            selected: false,
            active: false,
            code: cont.code,
            type: cont.type
        };

        switch (cont.type) {
            case 1: {
                node.iconClass = 'mtv-icon-map';
                break;
            }
            case 2: {
                node.iconClass = 'mtv-icon-folder';
                break;
            }
            default: {
                node.iconImg = cont.icon ? baseUrl() + cont.icon : false;
                break;
            }
        }
        return {...node, ...getNodeState(cont.id, states)};
    })
};

class ContainersTree extends React.Component {
    constructor(props) {
        super(props);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.rootNode.code === this.props.rootNode.code) && (nextProps.rootNode.id !== nextProps.currentRootId)) {
            this.props.updateInitState(nextProps.rootNode.id, nextProps.nodes);
        }
    }

    onDoubleClick(node) {
        if (node.type === 1) {
            this.props.enterMap(node.code);
        } else if (node.type === 2) {
            this.props.onExpanderClick(node);
        }
    }

    onContextMenu(node, event) {
        this.props.showContMenu(node.id, {
            left: event.pageX,
            top: event.pageY
        });
    }

    render() {
        const treeViewProps = {
            nodes: this.props.nodes,
            rootNode: this.props.rootNode,
            config:{
                showIcons: true
            },
            onExpanderClick: this.props.onExpanderClick,
            onDoubleClick: this.onDoubleClick,
            onContextMenu: this.onContextMenu,
            setNodesState: this.props.setNodesState
        };

        return (
            <TreeView {...treeViewProps}/>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        nodes: getNodes(state),
        rootNode: state.app.mapModel,
        currentRootId: tree().rootNodeId
    }
};

const mapDispatchToProps = function(dispatch) {
    return {
        updateInitState: (mapId, nodes) => {
            dispatch(initNodeStates(mapId, nodes));
        },
        onExpanderClick: (node) => {
            dispatch(toggleExpanded(node.id))
        },
        setNodesState: (nodes) => {
            dispatch(setNodesState(nodes));
        },
    }
};


export default (connect(mapStateToProps, mapDispatchToProps)(ContainersTree));