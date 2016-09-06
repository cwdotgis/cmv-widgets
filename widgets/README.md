#Query Statistics with SQL Expression Widget
First try at creating my own widget for the [cmv-app](https://github.com/cmv/cmv-app).

This is a widget to query for summary statistics from a feature service with an SQL expression. Adapted from [ArcGIS Javascript API 3.17](https://developers.arcgis.com/javascript/3/) sample code [Query Statistics with SQL Expression](https://developers.arcgis.com/javascript/3/jssamples/query_statistics_sql.html).

##Widget Configuration
Add the following code to the viewer.js file
``` javascript
queryStatistics: {
    include: true,
    id: 'querystat',
    type: 'titlePane',
    path: 'widgets/QueryStatistics',
    title: 'Summary Statistics',
    open: true,
	//canFloat: true,
    position: 0,
    //options: 'config/querystatistics'
	options: {
        map: true,
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Puget_Sound_BG_Food/FeatureServer/0',
        fields: ['OBJECTID', 'ALAND', 'TOTPOP_CY', 'HasData', 'TOTHH'],
        sqlExpression: 'TOTPOP_CY/(ALAND*0.0000003861)', //to calculate population density
        qryBuffDistance: 1, //distance from clicked point
        qryBuffUnits: 'miles', //units of buffer
        unitsText: 'ppl/sq. mi.' //population density units for results
	}
},
```

##To Dos and Goals for this widget:
-[x] Adapt code from API sample
-[x] Change the query geometry from point buffer to current map extent
-[ ] Allow user to have a choice between point buffer and current map extent?
-[ ] Add function to allow user to select layer for statistics
-[ ] Clean up code to make this a configurable widget
