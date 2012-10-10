({
    // the location of all the source files
    appDir: 'src',

    // the path to begin looking for modules. this is relative to appDir
    baseUrl: '.',

    // the directory to write the compiled scripts. this will emulate the
    // directory structure of appDir
    dir: 'min',

    // explicitly specify the optimization method
    optimize: 'uglify',

    // no CSS optimization is necessary since we use the sass optimization tool
    optimizeCss: 'none',

    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'highcharts': {
            exports: 'Highcharts'
        },
        'plugins/bootstrap': ['jquery'],
        'plugins/bootstrap-typeahead': ['jquery'],
        'plugins/jquery-ui': ['jquery']
    },

    name: 'main'
})
