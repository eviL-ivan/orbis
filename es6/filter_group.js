import PanelGroup from './panel_group';
import {
    createNumberInput,
    createRangeInput
} from '../helper';

export default class FilterGroup extends PanelGroup {
    constructor(panel, options, filters) {
        super(panel, options);
        this.settings = options.filterSettings;
        this.filters = filters;
        this.visibleFilters = {};
        this.render();
    }

    render() {
        this.visibleFilters = {};
        if (this.settings) {
            this.settings = this.settings.sort((a, b) => a.sort - b.sort);
            this.settings.forEach((filter) => {
                if (!filter.visible) {
                    return;
                }
                switch (filter.type) {
                    case 'select': {
                        this.renderSelect(filter, this.panel.realCont);
                        break;
                    }
                    case 'number': {
                        this.renderNumber(filter, this.panel.realCont);
                        break;
                    }
                    case 'range': {
                        this.renderRange(filter, this.panel.realCont);
                        break;
                    }
                    case 'bool': {
                        this.renderBool(filter, this.panel.realCont);
                        break;
                    }
                    default: break;
                }
            });
        }

        // Скрываем блок фильтров, если в нём их нет
        if (_.isEmpty(this.visibleFilters)){
            this.$container.hide();
        }
    }

    renderSelect(filter, container) {
        const that = this;
        const $cont = $('<div class="input-container"><div class="input-wrapper"></div></div>');
        const $wrapper = $cont.find('div');
        const filterId = omjs.Utils.stamp({});
        const app = this.panel.app;

        // Checkbox управления видимостью
        const $header = $('<label for="cont_' + filterId + '"></label>');
        const $checkbox = $('<span class="input-checkbox"></span>');
        $checkbox.append(app.svgCache['check'].clone());
        $header.append($checkbox).append(filter.label);
        $cont.prepend($header);

        $('<input type="checkbox" id="cont_' + filterId + '"/>')
            .prependTo($cont)
            .on('change', function(e) {
                that.changeFilterActivity(filterId, filter, $(this).is(":checked"));
            });

        let values = [];
        if (!filter.range || filter.range === 'auto') {
            values = container.objects.getArray().map(obj => obj.get(filter.field));
            values = _.unique(values);
        } else {
            values = filter.range.split(',').map(el => el.trim());
        }

        values = values
            .filter(v => (v !== null && v !== undefined))
            .map(v => {
                return {
                    id: v,
                    text: v
                }
            })
            .sort((a,b) => a.text.localeCompare(b.text));

        const select = $('<select class="input-select" name="states[]" multiple="multiple" style="width: 100%"></select>');
        select
            .appendTo($wrapper)
            .select2({
                data: values,
                language: "ru"
            })
            .on('change', e => {
                this.changeFilter(filterId, filter, select.val())
            });

        $cont.appendTo(this.$body);

        this.visibleFilters[filterId] = filter;
        
        return $cont;
    }

    renderBool(filter, container) {
        const that = this;
        const $cont = $('<div class="input-container"></div>');
        const filterId = omjs.Utils.stamp({});
        const app = this.panel.app;

        // Checkbox управления видимостью
        const $header = $('<label for="cont_' + filterId + '"></label>');
        const $checkbox = $('<span class="input-checkbox"></span>');
        $checkbox.append(app.svgCache['check'].clone());
        $header.append($checkbox).append(filter.label);
        $cont.prepend($header);

        $('<input type="checkbox" id="cont_' + filterId + '"/>')
            .prependTo($cont)
            .on('change', function(e) {
                that.changeFilterActivity(filterId, filter, $(this).is(":checked"));
            });

        $cont.appendTo(this.$body);

        // $cont.find('input[type=checkbox]').on('click', function(e) {
        //     console.log($(this).is(":checked"));
        // });

        this.visibleFilters[filterId] = filter;

        return $cont;
    }

    renderNumber(filter, container) {
        const that = this;
        const $cont = $('<div class="input-container"><div class="input-wrapper"></div></div>');
        const $wrapper = $cont.find('div');
        const filterId = omjs.Utils.stamp({});
        const app = this.panel.app;

        // Checkbox управления видимостью
        const $header = $('<label for="cont_' + filterId + '"></label>');
        const $checkbox = $('<span class="input-checkbox"></span>');
        $checkbox.append(app.svgCache['check'].clone());
        $header.append($checkbox).append(filter.label);
        $cont.prepend($header);

        $('<input type="checkbox" id="cont_' + filterId + '"/>')
            .prependTo($cont)
            .on('change', function(e) {
                that.changeFilterActivity(filterId, filter, $(this).is(":checked"));
            });

        const inputCont = createNumberInput('', 0, void(0), '');
        inputCont.appendTo($wrapper);

        $cont.appendTo(this.$body);

        const input = inputCont.find('[type=number]');
        input.on('change input', e => {
            const val = isNaN(parseFloat(input.val())) ? null : parseFloat(input.val());
            this.changeFilter(filterId, filter, val);
        });

        this.visibleFilters[filterId] = filter;

        return $cont;
    }

    renderRange(filter, container, min, max) {
        const that = this;
        const $cont = $('<div class="input-container"><div class="input-wrapper"></div></div>');
        const $wrapper = $cont.find('div');
        const filterId = omjs.Utils.stamp({});
        const app = this.panel.app;

        if (!min) {
            min = 0;
        }

        if (!max) {
            max = 300;
        }

        // Checkbox управления видимостью
        const $header = $('<label for="cont_' + filterId + '"></label>');
        const $checkbox = $('<span class="input-checkbox"></span>');
        $checkbox.append(app.svgCache['check'].clone());
        $header.append($checkbox).append(filter.label);
        $cont.prepend($header);

        $('<input type="checkbox" id="cont_' + filterId + '"/>')
            .prependTo($cont)
            .on('change', function(e) {
                that.changeFilterActivity(filterId, filter, $(this).is(":checked"));
            });

        const inputConts = createRangeInput(min, max);
        inputConts[0]
            .appendTo($wrapper)
            .css({
                width: 150,
                display: 'inline-block',
                'vertical-align': 'middle',
                'margin-right': 19
            });

        inputConts[1]
            .appendTo($wrapper)
            .css({
                width: 150,
                display: 'inline-block',
                'vertical-align': 'middle'
            });

        $cont.appendTo(this.$body);

        const input1 = inputConts[0].find('[type=number]');
        const input2 = inputConts[1].find('[type=number]');
        input1.on('change input', e => {
            const v1 = isNaN(parseFloat(input1.val())) ? null : parseFloat(input1.val());
            const v2 = isNaN(parseFloat(input2.val())) ? null : parseFloat(input2.val());
            this.changeFilter(filterId, filter, [v1, v2]);
        });
        input2.on('change input', e => {
            const v1 = isNaN(parseFloat(input1.val())) ? null : parseFloat(input1.val());
            const v2 = isNaN(parseFloat(input2.val())) ? null : parseFloat(input2.val());
            this.changeFilter(filterId, filter, [v1, v2]);
        });

        this.visibleFilters[filterId] = filter;

        return $cont;
    }

    changeFilter(fuid, filter, values) {

        let remove = false;
        if (values === null || !values.length || (values[0] === null && values[1] === null)) {
            remove = true;
        }
        clearTimeout(this.filterTimerId);
        this.filterTimerId = setTimeout(() => {
            if (remove) {
                this.filters.removeFilter(fuid, filter);
            } else {
                this.filters.setFilter(fuid, filter, values);
            }
        }, 500)
    }

    changeFilterActivity(fuid, filter, activity) {
        this.filters.activateFilter(fuid, filter, activity);
    }
}