//adapted from ArcGIS Javascript API 3.17 sample code for Query Statistics with SQL Expression
//https://developers.arcgis.com/javascript/3/jssamples/query_statistics_sql.html

define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    //
    'dojo/_base/lang',
    'dojo/number',
    'esri/layers/FeatureLayer',
    'esri/tasks/query',
    'esri/tasks/StatisticDefinition',
    'esri/geometry/geometryEngine',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/graphic',
    'esri/Color',
    'dojo/dom',
    //i18n
    'dojo/i18n!./QueryStatistics/nls/QueryStatistics',
    'dojo/text!./QueryStatistics/templates/QueryStatistics.html',
    'xstyle/css!./QueryStatistics/css/QueryStatistics.css'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, number,  FeatureLayer, Query, StatisticDefinition, geometryEngine, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Graphic, Color, dom, i18n, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: 'cmvQueryStatistics',
        widgetsInTemplate: true,
        templateString: template,
        i18n: i18n,
		blockGroupsLyr: null,
        url: null,
        fields: null,
        sqlExpression: null,
        qryBuffUnits: null,
        unitsText: null,

        postCreate: function() {
            this.inherited(arguments);
            map = this.map;

            // When the map is clicked, get the point at the clicked location and execute getPoint()
            map.on('click', lang.hitch(this, 'getPoint'));
        },

        // Executes on each map click
        getPoint: function(evt) {
            this.blockGroupsLyr = new FeatureLayer(this.url, {
                //mode: FeatureLayer.MODE_ONDEMAND,
                outFields: this.fields
            });

            // Symbol used to represent point clicked on map
            var pointSymbol =
                new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 255, 0, 0.3]), 10),
                new Color([0, 255, 0, 1]));

            // Symbol used to represent one-mile buffer around point
            var buffSymbol =
                new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASHDOT,
                new Color([255, 128, 0, 1]), 3),
                new Color([255, 128, 0, 0.15]));

            // Object used to request the smallest population density from the 
            // block groups within one mile of the mouse click.
            var minStatDef = new StatisticDefinition();
                minStatDef.statisticType = 'min';
                minStatDef.onStatisticField = this.sqlExpression;
                minStatDef.outStatisticFieldName = 'minPopDensity';

            // Object used to request the largest population density from the 
            // block groups within one mile of the mouse click.
            var maxStatDef = new StatisticDefinition();
                maxStatDef.statisticType = 'max';
                maxStatDef.onStatisticField = this.sqlExpression;
                maxStatDef.outStatisticFieldName = 'maxPopDensity';

            // Object used to request the average population density for 
            // all block groups within one mile of the mouse click.
            var avgStatDef = new StatisticDefinition();
                avgStatDef.statisticType = 'avg';
                avgStatDef.onStatisticField = this.sqlExpression;
                avgStatDef.outStatisticFieldName = 'avgPopDensity';

            // Object used to request the number of  
            // block groups within one mile of the mouse click.
            var countStatDef = new StatisticDefinition();
                countStatDef.statisticType = 'count';
                countStatDef.onStatisticField = this.sqlExpression;
                countStatDef.outStatisticFieldName = 'numBlockGroups';

            // Object used to request the standard deviation of the population density for 
            // all block groups within one mile of the mouse click.
            var stddevStatDef = new StatisticDefinition();
                stddevStatDef.statisticType = 'stddev';
                stddevStatDef.onStatisticField = this.sqlExpression;
                stddevStatDef.outStatisticFieldName = 'StdDevPopDensity';

            // Set the base parameters for the query. All statistic definition objects
            // are passed as an array into the outStatistics param
            var queryParams = new Query();
                queryParams.distance = 1; // Return all block groups within one mile of the point
                //Known values: "feet" | "miles" | "nautical-miles" | "us-nautical-miles" | "meters" | "kilometers"
                queryParams.units = this.qryBuffUnits;
                queryParams.outFields = this.fields;
                queryParams.outStatistics = [ minStatDef, maxStatDef, avgStatDef, countStatDef, stddevStatDef ];

            // Set the location of the mouse click event to the query parameters
            var point = evt.mapPoint;
            queryParams.geometry = point;

            // Clear the graphics from any previous queries
            map.graphics.clear();

            // Add a point graphic represting the location clicked on the map
            var ptGraphic = new Graphic(point, pointSymbol);
            map.graphics.add(ptGraphic);

            // Add a graphic representing a one-mile buffer around the clicked point
            //Possible Values: meters | feet | kilometers | miles | nautical-miles | yards
            //or numeric values: esriSRUnitType Constants and esriSRUnit2Type
            var buffer = geometryEngine.geodesicBuffer(point, 1, this.qryBuffUnits);
            var bufferGraphic = new Graphic(buffer, buffSymbol);
            map.graphics.add(bufferGraphic);

//*******************************************************************************
            // Execute the statistics query against the feature service and call the getStats() callback
/*            blockGroupsLyr.queryFeatures(queryParams, lang.hitch(this, 'getStats', 'errback'));
        },*/
            //original code from ArcGIS Javascript Sample
            // Executes on each query
/*        function getStats(results) {
            // The return object of the query containing the statistics requested
            var stats = results.features[0].attributes;

            // Print the statistic results to the DOM
            dom.byId('countResult').innerHTML = Math.round(stats.numBlockGroups);
            dom.byId('minResult').innerHTML = Math.round(stats.minPopDensity) + ' people/sq mi';
            dom.byId('maxResult').innerHTML = Math.round(stats.maxPopDensity) + ' people/sq mi';
            dom.byId('avgResult').innerHTML = Math.round(stats.avgPopDensity) + ' people/sq mi';
            dom.byId('stdDevResult').innerHTML = Math.round(stats.StdDevPopDensity) + ' people/sq mi';
        }

        function errback(err) {
            console.log("Couldn't retrieve summary statistics.", err);
        }
    });*/
//*******************************************************************************

            this.blockGroupsLyr.queryFeatures(queryParams, lang.hitch(this, function(results) {
                // Executes on each query
                // The return object of the query containing the statistics requested
                var stats = results.features[0].attributes;

                // Print the statistic results to the DOM
                dom.byId('countResult').innerHTML = number.format(Math.round(stats.numBlockGroups), {digitSeparator: true});
                dom.byId('minResult').innerHTML = number.format(Math.round(stats.minPopDensity), {digitSeparator: true}) + ' ' + this.unitsText;
                dom.byId('maxResult').innerHTML = number.format(Math.round(stats.maxPopDensity), {digitSeparator: true}) + ' ' +this.unitsText;
                dom.byId('avgResult').innerHTML = number.format(Math.round(stats.avgPopDensity), {digitSeparator: true}) + ' ' +this.unitsText;
                dom.byId('stdDevResult').innerHTML = number.format(Math.round(stats.StdDevPopDensity), {digitSeparator: true}) + ' ' +this.unitsText;
            }
            // ,

            // function(err) {
            //     console.log("Couldn't retrieve summary statistics.", err);
            // }

            ));
        }
    });
});