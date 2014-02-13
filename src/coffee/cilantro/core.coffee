###
Module that defines the Cilantro object. Most modules in Cilantro depend on
this core object to be defined for accessing configuration options and assessing
whether a feature is supported.
###

define [
    'underscore'
    'backbone'
    './config'
    './channels'
    './utils'
    # Core plugins that extend various libraries such as Backbone and jQuery.
    # Note, these are applied in place.
    'plugins/js'
    'plugins/jquery-ajax-queue'
    # Conditional inclusion of json2 (for ie7)
    if not JSON? then 'json2'
], (_, Backbone, config, channels, utils) ->

    c =
        # Version of cilantro
        version: '2.2.6-beta'

        # Defines the minimum version and maximum version Serrano that this version
        # of Cilantro is 100% compatible with. While Cilantro will attempt to run
        # normally despite the version number received from the server, the user
        # will be warned if no version number is found or if it is less than this
        # minimum to prepare them in the case of missing or broken functionality.
        minSerranoVersion: '2.0.16'
        maxSerranoVersion: '2.2.0'

        # Returns the current session's Serrano version. If there is no
        # active session or version defined, the absolute minimum is returned.
        getSerranoVersion: ->
            return @utils.cleanVersionString(@session?.version)

        # Returns a boolean as to whether the current Serrano version is
        # supported relative to the min and max.
        isSupported: (version) ->
            minVersion = @minSerranoVersion
            maxVersion = @maxSerranoVersion
            serranoVersion = @getSerranoVersion()
            # Cilantro may support a version of Serrano greater than the
            # current one being accessed.
            if utils.versionIsLt(serranoVersion, maxVersion)
                maxVersion = serranoVersion
            return utils.versionInRange(version, minVersion, maxVersion)

        # Initialize the session manager and default configuration
        config: new config.Config(@cilantro)

        # Attach commonly used utilities
        utils: utils

    # Give the cilantro object events!
    _.extend c, Backbone.Events, channels

    return c
