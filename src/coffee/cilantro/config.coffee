define [
    'jquery'
    './utils'
], ($, utils) ->


    defaultOptions =

        # Run in debug mode for additional logging and turn off other
        # various behaviors that impede development.
        debug: false

        # The default API endpoint that will be used when openSession
        # is called.
        url: null

        # The root URL to the application. If falsy, default is '/'
        root: null

        # The default set of credentials to use when openSession is called.
        credentials: null

        # If true a session will be opened for the endpoint specified by `url`
        # and `credentials`.
        autoload: false

        # An array of the default routes that are registered on load.
        routes: null

        # Default json for initial context and view
        defaults:

            context: null

            view: null
        # The selector of the target element views will be rendered in
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
