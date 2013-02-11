({
    baseUrl: '.',
    appDir: 'build',
    dir: 'dist/min',

    optimize: 'uglify2',
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
