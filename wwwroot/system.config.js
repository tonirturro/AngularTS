System.config({
    map: {
        app:'App',
        "angular": "lib/angular.js",
    },
    packages: {
        app: {
            main: './Boot.js',
            defaultExtension: 'js'
        }
    },
    meta: {
        'angular': {
            format: 'global',
            exports: 'angular'
        },
    }
});