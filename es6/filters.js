export default class Filters {
    constructor(panels) {
        this.panels = panels;
        this.app = this.panels.app;
        this.layers = {};
        this.filters = {};

        this.updateLayers = this.updateLayers.bind(this);
    }

    makeFiltrable(container, vectorLayer) {

        let fullSource = vectorLayer.getSource();
        if (fullSource instanceof ol.source.Cluster) {
            fullSource = fullSource.getSource();
        }

        vectorLayer.fullSource = new ol.source.Vector({
            features: fullSource.getFeatures()
        });
        vectorLayer.filteredSource = fullSource;
        container.vectorLayer = vectorLayer;
        vectorLayer.filter = () => {
            this.updateLayers(container.get('code'));
        };

        this.layers[container.get('code')] = vectorLayer;
    }

    setFilter(fuid, filterSettings, values) {
        const filterId = filterSettings.layer + '_' + filterSettings.field + '_' + fuid;
        const active = this.filters[filterId] ? this.filters[filterId].active : true;
        const filter = {
            active: active,
            layer: filterSettings.layer,
            field: filterSettings.field,
            values: values,
            type: filterSettings.type
        };
        this.filters[filterId] = filter;

        this.updateLayers(filterSettings.layer);
    }

    activateFilter(fuid, filterSettings, activity) {
        const filterId = filterSettings.layer + '_' + filterSettings.field + '_' + fuid;
        if (this.filters[filterId]) {
            this.filters[filterId].active = activity;
            this.updateLayers(filterSettings.layer);
        }
    }

    removeFilter(fuid, filterSettings) {
        const filterId = filterSettings.layer + '_' + filterSettings.field + '_' + fuid;
        if (this.filters[filterId]) {
            delete this.filters[filterId];
            this.updateLayers(filterSettings.layer);
        }
    }

    updateLayers(codes) {
        const _codes = typeof codes === 'string' ? [codes] : codes;
        _codes.forEach(code => {

            const layer = this.layers[code];
            const layerFilters = this.getLayerFilters(code);
            let filteredFeatures = layer.fullSource.getFeatures();

            if (layerFilters.length) {
                layerFilters.forEach(f => {
                    if (!f.values || !f.active) {
                        return;
                    }
                    switch (f.type) {
                        case 'select': {
                            filteredFeatures = this.selectFilter(filteredFeatures, f.field, f.values);
                            break;
                        }
                        case 'range': {
                            filteredFeatures = this.rangeFilter(filteredFeatures, f.field, f.values);
                            break;
                        }
                        default: break;
                    }
                });
            }
            layer.filteredSource.clear();
            layer.filteredSource.addFeatures(filteredFeatures);
            layer.fire('filtered');
        })
    }

    getLayerFilters(code) {
        const filters = [];
        for (let i in this.filters) {
            if (this.filters.hasOwnProperty(i)) {
                if (typeof this.filters[i].layer === 'string') {
                    if (this.filters[i].layer === code) {
                        filters.push(this.filters[i]);
                    }    
                } else {
                    if (~this.filters[i].layer.indexOf(code)) {
                        filters.push(this.filters[i]);
                    }                        
                }
            }
        }
        return filters;
    }

    selectFilter(features, field, values) {
        const filtered = [];
        if (!values.length) {
            return features;
        }

        let obj;
        for (let i = 0, l = features.length; i < l; i++) {
            obj = features[i].get('obj');
            if (~values.indexOf(obj.get(field))) {
                filtered.push(features[i]);
            }
        }

        return filtered;
    }

    rangeFilter(features, field, values) {
        const filtered = [];
        if (!values.length || (!values[0] && !values[1])) {
            return features;
        }

        let obj;
        let val, min, max;
        let result;
        for (let i = 0, l = features.length; i < l; i++) {
            obj = features[i].get('obj');
            result = true;
            val = parseFloat(obj.get(field));
            min = parseInt(values[0]);
            max = parseInt(values[1]);
            if (isNaN(val)) {
                result = false;
            }

            if (!isNaN(min)) {
                result = result && val >= min;
            }

            if (!isNaN(max)) {
                result = result && val <= max;
            }

            if (result) {
                filtered.push(features[i]);
            }
        }

        return filtered;
    }
}