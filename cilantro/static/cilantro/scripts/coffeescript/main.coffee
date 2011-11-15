define [
        'cilantro/utils/logging'
        'cilantro/vendor/jquery.idle'
        'cilantro/vendor/jquery.jqote2'
        'cilantro/vendor/jquery.ui'
        'cilantro/vendor/jquery.block'
        'cilantro/vendor/jquery.scrollto'
        'cilantro/utils/ajaxsetup'
        'cilantro/utils/extensions'
        'cilantro/utils/sanitizer'
    ],

    (Logging) ->

        # IE 7...
        if not window.JSON then require ['cilantro/vendor/json2']

        # configure jQuery block plugin..
        $.block.defaults.message = null
        $.block.defaults.css = {}
        $.block.defaults.overlayCSS = {}

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
