###
Module that defines the Cilantro object. Most modules in Cilantro depend on
this core object to be defined for accessing configuration options and assessing
whether a feature is supported.
###

define [
    'underscore'
    'backbone'
    './logger'
    './config'
    './channels'
    './utils'
    './changelog'
    './setup'
    # Core plugins that extend various libraries such as Backbone and jQuery.
    # Note, these are applied in place.
    'plugins/js'
    'plugins/jquery-ajax-queue'
], (_, Backbone, logger, config, channels, utils, changelog) ->

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

        # Returns the current session's Serrano version. If there is no
        # active session or version defined, the absolute minimum is returned.
        getSerranoVersion: ->
            return @utils.cleanVersionString(@session?.version)

        # Returns a boolean as to whether the current Serrano version is
        # supported relative to the min and max. An explicit minimum version
        # can be passed which is useful when a feature is added that requires
        # a version greater than the minimum version Cilantro supports.
        isSupported: (minVersion, maxVersion) ->
            minVersion ?= @minSerranoVersion
            maxVersion ?= @maxSerranoVersion
            version = @getSerranoVersion()
            return utils.versionInRange(version, minVersion, maxVersion)

        # Initialize the session manager and default configuration
        config: new config.Config(@cilantro)

        # Attach commonly used utilities
        utils: utils

    # Give the cilantro object events!
    _.extend c, Backbone.Events, channels

    # Set log level to debug
    if c.config.get('debug')
        logger.setLevel('debug')
        c.on 'all', (event, args...) ->
            logger.info(event, args...)

    return c
