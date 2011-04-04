({
    baseUrl: '.',
    appDir: 'src',
    dir: 'min',
    optimizeCss: 'none',
    
    modules: [{
        name: 'lib/json2'
    }, {
        name: 'lib/modernizr'
    }, {
        name: 'lib/require-jquery'
    }, {
        name: 'main'
    }, {
        name: 'define/main'
    }, {
        name: 'report/main'
    }]
})