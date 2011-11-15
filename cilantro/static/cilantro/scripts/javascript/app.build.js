({
    // the location of all the source files
    appDir: 'src',

    // the path to begin looking for modules. this is relative to appDir
    baseUrl: '.',

    // the directory to write the compiled scripts. this will emulate the
    // directory structure of appDir
    dir: 'min',

    // explicitly specify the optimization method
    optimize: 'none',

    // no CSS optimization is necessary since we use the sass optimization tool
    optimizeCss: 'uglify',

    // everything is namespaced within the code, therefore this must be
    // here to route 'cilantro' to the baseUrl to ensure the "url" routes
    // to the correct file system location.
    paths: {
        'cilantro': '.',
        'common': './common',
        'jquery': './vendor/jquery',
        'backbone': './vendor/backbone',
        'underscore': './vendor/underscore',
        'pubsub': './vendor/pubsub'
    },

    // an array of modules to compile
    modules: [{
        name: 'cilantro/core'
    }, {
        name: 'common/utils',
        exclude: ['backbone', 'underscore']
    }, {
        name: 'cilantro/main',
        exclude: ['jquery', 'backbone', 'underscore', 'vendor/jquery.ui']
    }, {
        name: 'cilantro/pages/workspace/main',
        exclude: ['jquery', 'backbone', 'underscore']
    }, {
        name: 'cilantro/pages/define/main',
        exclude: ['jquery', 'backbone', 'underscore']
    }, {
        name: 'cilantro/report/main',
        exclude: ['jquery', 'backbone', 'underscore']
    }]
})
