({
    baseUrl: '.',
    appDir: 'build',
    dir: 'dist/src',

    optimize: 'none',
    optimizeCss: 'none',
    removeCombined: true,
    preserveLicenseComments: false,

    modules: [{
        name: 'cilantro'
    }, {
        name: 'cilantro/ui',
        exclude: ['cilantro/core']
    }]
})
