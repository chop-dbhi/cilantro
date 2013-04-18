define [
    'jquery'
    'underscore'
    'backbone'
    'mediator'
    './channels'
    './utils'
    './session'
    './router'

    # Core plugins that extend various libraries such as Backbone and jQuery.
    # Note, these are applied in place.
    'plugins/js'
    'plugins/jquery-ajax-queue'
    'plugins/backbone-deferrable'
], ($, _, Backbone, mediator, channels, utils, session, router) ->

    # Relies on the jquery-ajax-queue plugin to supply this method.
    # This ensures data is not silently lost
    $(window).on 'beforeunload', ->
       if $.hasPendingRequest()
           return "Wow, you're quick! Your data is being saved.
               It will only take a moment."

    currentSession = null

    defaultConfig =
        autoroute: true

    c = config: $.extend true, defaultConfig, @cilantro

    aliases =
        dom: $
        ajax: $.ajax

    methods =
        getOption: (key) ->
            utils.getDotProp(c.config, key)

        setOption: (key, value) ->
            utils.setDotProp(c.config, key, value)

        openSession: (url, credentials) ->
            url ?= @getOption('url')
            credentials ?= @getOption('credentials')
            if not url? then throw new Error('Session cannot be opened, no URL defined')
            session.openSession url, credentials, (sessionData) ->
                currentSession = _.clone sessionData

        closeSession: ->
            session.closeSession ->
                currentSession = null

        getCurrentSession: ->
            currentSession?.root

        getSessionUrl: (name) ->
            session.getSessionUrl(currentSession, name)

    channels = _.extend {}, channels, session.channels

    router = new router.Router
        el: methods.getOption('ui.main')

    props = { $, _, Backbone, utils, router }

    # Construct the base object which is composed core libraries, the
    # mediator methods, and the app-level config
    _.extend c, mediator, channels, props, aliases, methods
