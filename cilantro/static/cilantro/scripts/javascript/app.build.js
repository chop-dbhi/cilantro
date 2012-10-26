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

    preserveLicenseComments: false,

    // no CSS optimization is necessary since we use the sass optimization tool
    optimizeCss: 'none',

    modules: [{
        name: 'environ',
        include: [
            'utils/numbers',
            'utils/grouper',
            'behavior/pending-requests',
            'behavior/staff-only',
            'plugins/backbone-ajax-queue',
            'plugins/backbone-deferrable',
            'plugins/underscore-mustache',
            'plugins/bootstrap',
            'plugins/bootstrap-typeahead',
            'plugins/jquery-csrf',
            'plugins/jquery-ui',
            'plugins/jquery-easing',
            'plugins/jquery-panels',
            'plugins/jquery-scroller'
        ],
        exclude: ['jquery', 'backbone', 'underscore', 'mediator'],
    }, {
        name: 'main',
        include: [
            'router',
            'session',
            'serrano',
            'serrano/channels',
            'serrano/datafield',
            'serrano/dataconcept',
            'serrano/datacontext',
            'serrano/dataview',
            'models/datafield',
            'models/dataconcept',
            'models/datacontext',
            'models/dataview'
        ],
        exclude: ['environ', 'jquery', 'backbone', 'underscore', 'mediator']
    }, {
        name: 'routes/app',
        include: ['views/counter'],
        exclude: ['environ', 'jquery', 'backbone', 'underscore', 'mediator']
    }, {
        name: 'routes/discover',
        include: [
            'highcharts',
            'views/queryviews',
            'forms/controls',
            'charts/utils',
            'charts/backbone-charts',
            'charts/options',
            'charts/views',
            'charts/models'
        ],
        exclude: ['environ', 'jquery', 'backbone', 'underscore', 'mediator']
    }, {
        name: 'routes/review',
        include: ['views/table', 'views/columns'],
        exclude: ['environ', 'jquery', 'backbone', 'underscore', 'mediator']
    }]
})
