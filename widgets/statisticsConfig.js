define({
    map: true,
    url: 'http://services3.arcgis.com/LjxW17ryOxd5Lbl9/arcgis/rest/services/CaliforniaGeochemicalAnalysis/FeatureServer/0',
    fields: ['OBJECTID', 'ag_icp40', 'as_icp40', 'be_icp40', 'cd_icp40', 'co_icp40', 'cr_icp40', 'cu_icp40', 'pb_icp40', 'th_icp40', 'zn_icp40'],
	unitsText: 'ppm',
    layers: [
    {
        name: 'Silver (Ag) by ICP',
        id: 'Ag',
        field: 'ag_icp40'
    }, {
        name: 'Arsenic (As) by ICP',
        id: 'As',
        field: 'as_icp40'
    }, {
        name: 'Beryllium (Be) by ICP',
        id: 'Be',
        field: 'be_icp40'
    }, {
        name: 'Cadmium (Cd) by ICP',
        id: 'Cd',
        field: 'cd_icp40'
    }, {
        name: 'Cobalt (Co) by ICP',
        id: 'Co',
        field: 'co_icp40'
    }, {
        name: 'Chromium (Cr) by ICP',
        id: 'Cr',
        field: 'cr_icp40'
    }, {
        name: 'Copper (Cu) by ICP',
        id: 'Cu',
        field: 'cu_icp40'
    }, {
        name: 'Lead (Pb) by ICP',
        id: 'Pb',
        field: 'pb_icp40'
    }, {
        name: 'Thorium (Th) by ICP',
        id: 'Th',
        field: 'th_icp40'
    }, {
        name: 'Zinc (Zn) by ICP',
        id: 'Zn',
        field: 'zn_icp40'   
    }
    ]
});
