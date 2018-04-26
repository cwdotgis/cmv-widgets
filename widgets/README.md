## Query Statistics with SQL Expression Widget

This widget queries summary statistics for features within the current map view. This code was mostly adapted from [ArcGIS Javascript API 3.17](https://developers.arcgis.com/javascript/3/) sample code [Query Statistics with SQL Expression](https://developers.arcgis.com/javascript/3/jssamples/query_statistics_sql.html).

![Statistics Widget Screenshot](querystat_widget.jpg?raw=true "Statistics Widget")

### Widget Configuration
Add the following code to the viewer.js file

``` javascript
queryStatistics: {
    include: true,
    id: 'querystat',
    type: 'titlePane',
    path: 'widgets/QueryStatistics',
    title: 'Summary Statistics',
    open: true,
    position: 0,
    options: 'config/statisticsConfig'
},
```

### To Dos and Goals for this widget:
- [x] Adapt code from API sample
- [x] Change the query geometry from point buffer to current map extent
- [x] Add function to allow user to select layer for statistics
- [ ] Allow user to have a choice between point buffer and current map extent?
