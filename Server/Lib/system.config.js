System.config({
    baseURL: "/",
    defaultExtensions: true,
    map: {
        "angular": "node_modules/angular/angular.js"
    },
    meta: {
        'angular': {
            format: 'global',
            exports: 'angular'
        },
    }
});
