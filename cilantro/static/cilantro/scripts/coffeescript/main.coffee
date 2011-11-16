define [
    'cilantro/core'
    'cilantro/utils/logging'
    'cilantro/utils/ajaxsetup'
    'cilantro/utils/extensions'
    'cilantro/utils/sanitizer'
    'vendor/jquery.idle'
    'vendor/jquery.jqote2'
    'vendor/jquery.block'
    'vendor/jquery.scrollto'
], (Core, Logging) ->

    # IE 7...
    if not window.JSON then require ['vendor/json2']

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

