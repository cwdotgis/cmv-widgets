//adapted from ArcGIS Javascript API 3.17 sample code for Query Statistics with SQL Expression
//https://developers.arcgis.com/javascript/3/jssamples/query_statistics_sql.html

define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/number',
    'esri/layers/FeatureLayer',
    'esri/tasks/query',
    'esri/tasks/StatisticDefinition',
    'dojo/dom',
    'dojo/i18n!./QueryStatistics/nls/QueryStatistics',
    'dojo/text!./QueryStatistics/templates/QueryStatistics.html',
    'xstyle/css!./QueryStatistics/css/QueryStatistics.css'
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, number, FeatureLayer, Query, StatisticDefinition, dom, i18n, template) {

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
            map.on('extent-change', lang.hitch(this, 'getPoint'));
        },

        // Executes on each map click
        getPoint: function(evt) {
            this.blockGroupsLyr = new FeatureLayer(this.url, {
                //mode: FeatureLayer.MODE_ONDEMAND,
                outFields: this.fields
            });

            var minStatDef = new StatisticDefinition();
                minStatDef.statisticType = 'min';
                minStatDef.onStatisticField = this.sqlExpression;
                minStatDef.outStatisticFieldName = 'minPopDensity';

            var maxStatDef = new StatisticDefinition();
                maxStatDef.statisticType = 'max';
                maxStatDef.onStatisticField = this.sqlExpression;
                maxStatDef.outStatisticFieldName = 'maxPopDensity';

            var avgStatDef = new StatisticDefinition();
                avgStatDef.statisticType = 'avg';
                avgStatDef.onStatisticField = this.sqlExpression;
                avgStatDef.outStatisticFieldName = 'avgPopDensity';

            var countStatDef = new StatisticDefinition();
                countStatDef.statisticType = 'count';
                countStatDef.onStatisticField = this.sqlExpression;
                countStatDef.outStatisticFieldName = 'numBlockGroups';

            var stddevStatDef = new StatisticDefinition();
                stddevStatDef.statisticType = 'stddev';
                stddevStatDef.onStatisticField = this.sqlExpression;
                stddevStatDef.outStatisticFieldName = 'StdDevPopDensity';

            // Set the base parameters for the query. All statistic definition objects
            // are passed as an array into the outStatistics param
            var queryParams = new Query();
                queryParams.outFields = this.fields;
                queryParams.outStatistics = [ minStatDef, maxStatDef, avgStatDef, countStatDef, stddevStatDef ];

            var geometry = this.map.extent;
            queryParams.geometry = geometry;

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

            // function(err) {
            //     console.log("Couldn't retrieve summary statistics.", err);
            // }

            ));
        }
    });
});
