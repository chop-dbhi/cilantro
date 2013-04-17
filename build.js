({
    baseUrl: '.',
    appDir: 'build',
    dir: 'dist/src',

    optimize: 'none',
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
