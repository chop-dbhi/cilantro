define [
    'jquery'
    'underscore'
    'backbone'
    'mediator'
    'promiser'
    './config'
    './channels'
    './utils'
    './session'
    './setup'

    # Core plugins that extend various libraries such as Backbone and jQuery.
    # Note, these are applied in place.
    'plugins/js'
    'plugins/jquery-ajax-queue'
], ($, _, Backbone, mediator, promiser, config, channels, utils, session) ->

    # Initialize configuration and session manager
    c =
        config: new config.Config(@cilantro)
        session: new session.SessionManager
        utils: utils
        promiser: promiser

    methods =
        # DEPRECATED [2.0.2, 2.1.0]: Use c.config.get()
        getOption: (key) ->
            c.config.get(key)

        # DEPRECATED [2.0.2, 2.1.0]: Use c.config.set()
        setOption: (key, value) ->
            c.config.set(key, value)

        getSerranoVersion: ->
            # If there is no version defined, return the absolute minimum
            if not c.session.current
                return [0, 0, 0]

            # Remove anything after the release level
            versionString = c.session.current.data.version.replace(/[abf].*$/g, '')

            # Try to split the version string into major, minor, and micro
            # version numbers
            versionFields = versionString.split('.')

            # If we don't have values for all of major, minor, and micro
            # version numbers then return the minimum version.
            if versionFields.length != 3
                return [0, 0, 0]

            return [parseInt(versionFields[0], 10),
                    parseInt(versionFields[1], 10),
                    parseInt(versionFields[2], 10)]

        isSerranoOutdated: ->
            serranoVersion = @getSerranoVersion()

            # If the major version numbers of the minimum and actual versions
            # are not identical then we can use the major version alone as the
            # basis for the "outdatedness".
            if serranoVersion[0] == c.minimumSerranoVersion[0]
                # If the minor version numbers of the minimum and actual
                # versions are not identical then we can simply use the minor
                # version as the basis for the "outdatedness".
                if serranoVersion[1] == c.minimumSerranoVersion[1]
                    # At this point the major and micro versions are equal so
                    # just evaluate based on the micro version
                    return serranoVersion[2] < c.minimumSerranoVersion[2]
                else
                    return serranoVersion[1] < c.minimumSerranoVersion[1]
            else
                return serranoVersion[0] < c.minimumSerranoVersion[0]

    channels = _.extend {}, channels, session.channels

    props = { $, _, Backbone }

    # Construct the base object which is composed core libraries, the
    # mediator methods, session manager, and the config object
    _.extend c, mediator, channels, props, methods
