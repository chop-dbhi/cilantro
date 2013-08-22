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

        # The default set of credentials to use when openSession is called.
        credentials: null

        # If true a session will be opened for the endpoint specified by `url`
        # and `credentials`.
        autoload: false

        # An array of the default routes that are registered on load.
        routes: null

        # A selector that represents the target element views will be
        # rendered in.
        ui:
            main: '#cilantro-main'

        # Default json for initial context and view
        defaults:

            context: null

            view: null

        # Custom modules corresponding to concepts
        concepts:

            # Modules specific for ConceptForms
            forms: null


    class Config
        defaults: defaultOptions

        constructor: (options...) ->
            @options = $.extend true, {}, @defaults, options...

        get: (key) ->
            utils.getDotProp(@options, key)

        set: (key, value) ->
            utils.setDotProp(@options, key, value)


    return new Config(@cilantro)
