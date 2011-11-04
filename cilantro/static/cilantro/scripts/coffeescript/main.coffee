define [
        'common/utils'
        'cilantro/utils/logging'
        'cilantro/lib/jquery.ui'
        'cilantro/lib/jquery.block'
        'cilantro/lib/jquery.jqote2'
        'cilantro/lib/jquery.scrollto'
        'cilantro/vendor/jquery.idle'
        'cilantro/vendor/backbone'
        'cilantro/vendor/pubsub'
        'cilantro/utils/ajaxsetup'
        'cilantro/utils/extensions'
        'cilantro/utils/sanitizer'
    ],

    (utils, Logging) ->

        # IE 7...
        if not window.JSON then require ['cilantro/lib/json2']

        # configure jQuery block plugin..
        $.block.defaults.message = null
        $.block.defaults.css = {}
        $.block.defaults.overlayCSS = {}

        # an object may already be defined, so we create a reference
        # to the existing attributes
        attrs = window.App or {}

        # initialize a pub/sub hub
        attrs.hub = new PubSub

        attrs.Models = {}
        attrs.Collections = {}
        attrs.Views = {}

        # finally, initialize the App object for the page
        window.App = App = new utils.App attrs

        # post-init App setup
        App.Log = new Logging.Log
        App.LogView = new Logging.LogView

        # basic client-side session timer
        $.idleTimer 10 * 1000

        $(document).bind
            'idle.idleTimer': ->
                App.hub.publish 'session/idle'

            'active.idleTimer': ->
                App.hub.publish 'session/resume'
