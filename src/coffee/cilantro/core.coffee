define [
    'underscore'
    'mediator'
    'promiser'
    'loglevel'
    './config'
    './channels'
    './utils'
    './session'
    './changelog'
    './setup'

    # Core plugins that extend various libraries such as Backbone and jQuery.
    # Note, these are applied in place.
    'plugins/js'
    'plugins/jquery-ajax-queue'
], (_, mediator, promiser, loglevel, config, channels, utils, session, changelog) ->

    c =
        # Version of cilantro
        version: changelog[0].version

        # Defines the minimum version and maximum version Serrano that this version
        # of Cilantro is 100% compatible with. While Cilantro will attempt to run
        # normally despite the version number received from the server, the user
        # will be warned if no version number is found or if it is less than this
        # minimum to prepare them in the case of missing or broken functionality.
        minSerranoVersion: '2.0.18'
        maxSerranoVersion: '2.1.0'

        # Attach logging component for easy reference
        log: loglevel

        # Initialize the session manager and default configuration
        session: new session.SessionManager
        config: new config.Config(@cilantro)

        # Attach commonly used utilities and promiser object
        utils: utils
        promiser: promiser

        # [DEPRECATED: 2.1.0] Use c.config.get()
        getOption: (key) ->
            @config.get(key)

        # [DEPRECATED: 2.1.0] Use c.config.set()
        setOption: (key, value) ->
            @config.set(key, value)

        # Returns the current session's Serrano version. If there is no
        # active session or version defined, the absolute minimum is returned.
        getSerranoVersion: ->
            version = @session.current?.data.version
            return @utils.cleanVersionString(version)

        # Returns a boolean as to whether the current Serrano version is
        # supported relative to the min and max. An explicit minimum version
        # can be passed which is useful when a feature is added that requires
        # a version greater than the minimum version Cilantro supports.
        isSupported: (minVersion, maxVersion) ->
            minVersion ?= @minSerranoVersion
            maxVersion ?= @maxSerranoVersion
            version = @getSerranoVersion()
            return utils.versionInRange(version, minVersion, maxVersion)

    # Set log level to debug
    if c.config.get('debug')
        c.log.setLevel('debug')

    # Mediator channel topics for communication across the application
    channels = _.extend {}, channels, session.channels

    # Mixin various components
    _.extend c, mediator, channels
