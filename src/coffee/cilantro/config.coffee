define [
    'jquery'
    './utils'
], ($, utils) ->


    defaultOptions =
        # Run in debug mode for additional logging and turn off other
        # various behaviors that impede development.
        debug: false

        # The root URL to the application. If falsy, default is '/'
        root: null

        # The endpoint used when the default session is opened.
        url: null

        # The credentials used when the default session is opened.
        credentials: null

        # The selector of the element views will be rendered within.
        main: '#cilantro-main'

        # Custom modules corresponding to concepts
        concepts:

            # Modules specific for ConceptForms
            forms: null


    class Config
        constructor: (options...) ->
            @options = $.extend true, {}, defaultOptions, options...

        get: (key) ->
            utils.getDotProp(@options, key)

        set: (key, value) ->
            utils.setDotProp(@options, key, value)


    { Config, defaultOptions }
