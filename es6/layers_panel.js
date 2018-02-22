import Panel from './panel';

export default class LayersPanel extends Panel {
    constructor(app, config, panels) {
        super(app, config);

        const {
            container,
            realCont
        } = config;

        this.container = container;
        this.realCont = realCont;
        this.panels = panels;

        this.$container.addClass('layers-panel collapsed');
    }

    render(parentContainer, options) {
        super.render(parentContainer, options);
        this.$root = $('<ul class="cont-list"></ul>');
        this.renderLevel(this.container, this.$root);
        this.$body.append(this.$root);
    }

    renderLevel(parent, $parentEl) {
        const childs = this.app.getPublicDescendants(parent.get('id'));
        const project = this.app.view.getProject();

        let $node, $item, $label, $icon;
        let label;
        let $checkbox;

        childs.forEach(child => {

            label = (child.get('name') && child.get('name') !== '') ? child.get('name') : child.get('code');
            $node = $('<li class="cont-node"><div class="cont-item"></div></li>');
            $item = $node.find('.cont-item');
            $label = $('<div class="cont-label">' + label + '</div>');
            $icon = $('<div class="cont-icon"></div>');

            // Иконка для слоя
            let icon, iconurl;

            if (child.get('icon').length) {
                iconurl = child.get('icon');

                // Не показываем стандартные иконки
                if (iconurl.indexOf('static/geoicons/') < 0) {
                    if (iconurl.charAt(0) !== '/') {
                        iconurl = '/' + iconurl;
                    }
                    iconurl = project.apiUrlLocation.protocol
                        + '//'
                        + project.apiUrlLocation.hostname
                        + iconurl;

                    icon = document.createElement('img');
                    icon.src = iconurl;
                }
            }

            if (icon) {
                if (icon.tagName) {
                    $icon
                        .append(icon)
                } else {
                    $icon.addClass(icon);
                }
            }

            $checkbox = $('<label class="cont-check" for="cont_' + child.get('id') + '"><input type="checkbox" id="cont_' + child.get('id') + '" style="display: none;"/></label>');
            let input = $checkbox.find('input');
            if (child.get('selected')) {
                input.attr('checked', 'checked');
            }
            input.on('change', () => {
                this.onCheckboxChanged(input, child);
            });
            $label.on('click', () => {
                input.click();
            });
            $('<span class="input-checkbox">')
                .append(this.app.svgCache['check'].clone())
                .appendTo($checkbox);

            $item.append($checkbox);
            $item.append($label);
            $item.append($icon);

            $parentEl.append($node);
        });
    }

    onCheckboxChanged(elem, cont) {
        const newState = elem.prop('checked');
        cont.set('selected', newState);
        this.app.treeView.getRealContainer(cont).set('selected', newState);
        const childs = this.app.getPublicDescendants(cont.get('id')).filter(c => {
            return c.get('type') !== 'folder';
        });

        childs.forEach(c => {
            c.set('selected', newState);
            this.app.treeView.getRealContainer(c).set('selected', newState);
        });

        this.app.switchLayers();
    }

}