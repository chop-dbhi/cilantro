({
    baseUrl: '.',
    appDir: 'build',
    dir: 'dist/min',

    optimize: 'uglify2',
    optimizeCss: 'none',
    removeCombined: true,
    preserveLicenseComments: false,

    config: {
        tpl: {
            variable: 'data'
        }
    },

    modules: [{
        name: 'cilantro'
    }, {
        name: 'cilantro.ui'
    }]
})
