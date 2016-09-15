define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',
    'dojo/number',
    'dojo/dom',
    'esri/tasks/query',
    'esri/tasks/StatisticDefinition',
    'esri/layers/FeatureLayer',
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dijit/form/Select',
    'dojo/i18n!./QueryStatistics/nls/QueryStatistics',
    'dojo/text!./QueryStatistics/templates/QueryStatistics.html',
    'xstyle/css!./QueryStatistics/css/QueryStatistics.css',

], function(
    declare, 
    _WidgetBase, 
    _TemplatedMixin, 
    _WidgetsInTemplateMixin, 
    lang, 
    array, 
    domConstruct, 
    number, 
    dom, 
    Query, 
    StatisticDefinition, 
    FeatureLayer, 
    Button, 
    TextBox, 
    Select, 
    i18n, 
    template, 
    css
    ) {
    
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'cmvQueryStatistics',
        i18n: i18n,
        attributeLayer: 0,
        layers: null,
        url: null,
        fields: null,
        unitsText: null,
        layerAdded: false,

        postCreate: function() {
            this.inherited(arguments);
            map = this.map;
            noStatsMsg = 'No Layer on Map'; //move this to config file or keep here?
            this.setupConnections();
            this.initLayerSelect();
        },

        initLayerSelect: function () {
            var attrOptions = [];
            var len = this.layers.length,
                option;
            for (var i = 0; i < len; i++) {
                option = {
                    value: i,
                    label: this.layers[i].name,
                };
                attrOptions.push(lang.clone(option));
            }

            if (attrOptions.length > 0) {
                this.selectLayerByAttribute.set('options', attrOptions);
                this.onAttributeLayerChange(this.attributeLayer);
            } else {
                this.selectLayerByAttribute.set('disabled', true);
            }
        },

        onAttributeLayerChange: function (newValue) {
            this.attributeLayer = newValue;
            var layer = this.layers[this.attributeLayer];
            if (layer) {
                var options = [];
                var len = layer.length;
                for (var i = 0; i < len; i++) {
                    var option = {
                        value: i,
                        label: layer[i].name,
                        layerId: layer[i].id,
                        field: layer[i].field
                    };
                    options.push(option);
                    if (i === 0) {
                        options[i].selected = true;
                    }
                }
            }
        },

        setupConnections: function () {
            this.addButton.on('click', lang.hitch(this, 'addLayer'));
            mapExtentChange = map.on('extent-change', lang.hitch(this, 'getStats'));
        },

        setFeatureLayer: function() {
            var layer = this.layers[this.attributeLayer];
            var featLayer = new FeatureLayer(this.url, {
                id: layer.id,
                opacity: 0.7,
                visible: true,
                mode: FeatureLayer.MODE_ONDEMAND,
            });
            return featLayer;
        },

        addLayer: function () {
            //clears previously added layer
            this.removeLayers();
            var layer = this.setFeatureLayer();
            map.addLayer(layer);
            this.layerAdded = true;
            this.getStats();
            dom.byId('layerAddName').innerHTML = layer.id;
            //console.log('layer added: ' + layer.id);
        },

        removeLayers: function() {
            map.graphics.clear();
            //set up array for layer ids in config file
            var configIds = [];
            var configLen = this.layers.length, option;
            for (var i = 0; i < configLen; i++) {
                var layerId = this.layers[i].id;
                configIds.push(layerId);
            }
            
            //set up array for layers on map
            var layersIdsArr = [];
            var count = map.graphicsLayerIds.length; //use map.layerIds.length for dynamic
            for (var j = 0; j < count; j++) {
                var currentLayer = map.getLayer(map.graphicsLayerIds[j]);
                layersIdsArr.push(currentLayer.id);
            }
            
            //only remove layers that match both arrays
            var layersToRemove = this.getMatchingIds(configIds, layersIdsArr);
            var lyrCount = layersToRemove.length;
            for (var e = 0; e < lyrCount; e++) {
                map.removeLayer(map.getLayer(layersToRemove[e]));
            }
            
//            console.log('config file layer ids: ' + configIds);
//            console.log('layers on map ids: ' + layersIdsArr);
//            console.log('layers removed: ' + this.getMatchingIds(configIds, layersIdsArr)); 
        },
        
        getMatchingIds: function (a, b) {
            var matches = [];      
            for ( var i = 0; i < a.length; i++ ) {
                for ( var e = 0; e < b.length; e++ ) {
                    if ( a[i] === b[e] ) matches.push( a[i] );
                }
            }
            return matches;
        },
        
        clearLayersResults: function () {
            //for remove button to clear layers from map and query results
            this.map.graphics.clear();
            this.removeLayers();
            this.layerAdded = false;
            dom.byId('layerAddName').innerHTML = '';
            this.noStats(noStatsMsg);
        },

        getStats: function() {
            if (this.layerAdded === false) {
                this.noStats(noStatsMsg);
                return;
            } else if (this.layerAdded === true) {
            var layer = this.setFeatureLayer();
            var statField = this.layers[this.attributeLayer].field;

            var minStatDef = new StatisticDefinition();
            minStatDef.statisticType = 'min';
            minStatDef.onStatisticField = statField;
            minStatDef.outStatisticFieldName = 'minStat';

            var maxStatDef = new StatisticDefinition();
            maxStatDef.statisticType = 'max';
            maxStatDef.onStatisticField = statField;
            maxStatDef.outStatisticFieldName = 'maxStat';

            var avgStatDef = new StatisticDefinition();
            avgStatDef.statisticType = 'avg';
            avgStatDef.onStatisticField = statField;
            avgStatDef.outStatisticFieldName = 'avgStat';

            var countStatDef = new StatisticDefinition();
            countStatDef.statisticType = 'count';
            countStatDef.onStatisticField = statField;
            countStatDef.outStatisticFieldName = 'countStat';

            var stdDevStatDef = new StatisticDefinition();
            stdDevStatDef.statisticType = 'stddev';
            stdDevStatDef.onStatisticField = statField;
            stdDevStatDef.outStatisticFieldName = 'stdDevStat';

            var queryParams = new Query();
            queryParams.outFields = this.fields;

            queryParams.outStatistics = [minStatDef, maxStatDef, avgStatDef, countStatDef, stdDevStatDef];
            var geometry = map.extent;
            queryParams.geometry = geometry;
            
            layer.queryFeatures(queryParams, lang.hitch(this, function(results) {

                var stats = results.features[0].attributes;

                dom.byId('countResult').innerHTML = number.format(Math.round(stats.countStat), {
                    digitSeparator: true
                });
                dom.byId('minResult').innerHTML = number.format(Math.round(stats.minStat) , {
                    digitSeparator: true
                }) + ' ' + this.unitsText;
                dom.byId('maxResult').innerHTML = number.format(Math.round(stats.maxStat) , {
                    digitSeparator: true
                }) + ' ' + this.unitsText;
                dom.byId('avgResult').innerHTML = number.format(Math.round(stats.avgStat) , {
                    digitSeparator: true
                }) + ' ' + this.unitsText;
                dom.byId('stdDevResult').innerHTML = number.format(Math.round(stats.stdDevStat) , {
                    digitSeparator: true
                }) + ' ' + this.unitsText;
                
            }));
            //console.log('stats on layer: ' + layer.id);
            }
        },
        
        noStats: function(noStatsMsg) {
            dom.byId('countResult').innerHTML = noStatsMsg;
            dom.byId('minResult').innerHTML = noStatsMsg;
            dom.byId('maxResult').innerHTML = noStatsMsg;
            dom.byId('avgResult').innerHTML = noStatsMsg;
            dom.byId('stdDevResult').innerHTML = noStatsMsg;     
        }
// code from sample. Not sure where this goes...
//        errback: function(err) {
//            console.log('Could not retrieve summary statistics.', err);
//
//        }

    });
});
