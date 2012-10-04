define [
    'jquery'
    
    # Plugins that may affect the behavior of the application from the user's
    # point-of-view, e.g. triggered alerts, dialogs.
    'behavior/pending-requests'

    # Plugins that extend various libraries such as Backbone and jQuery.
    # These do not have return values, but rather extend the library
    # in-place.
    'plugins/backbone-ajax-queue'
    'plugins/backbone-deferrable'

    'plugins/bootstrap'
    'plugins/bootstrap-typeahead'

    'plugins/jquery-csrf'
    'plugins/jquery-ui'
    'plugins/jquery-panels'
    'plugins/jquery-scroller'

], ($) ->

    App = @App

    # Checks for environment settings
    if not App.SCRIPT_NAME?
        throw Error 'Global "SCRIPT_NAME" not defined'

    if not App.CSRF_TOKEN?
        throw Error 'Global "CSRF_TOKEN" not defined'

    defaultEnv =
        urls: {}
        ajax:
            maxAttempts: 3

    $.extend true, App, defaultEnv, App

    # Setup default app state
    App.state = {}
    App.state.ajaxAttempts = 0

    App.Models = {}
    App.Views = {}

    # Uses the globally defined `scriptName` variable to construct full URL
    # paths. Remove redundant forward slashes
    App.absolutePath = (path) ->
        (App.SCRIPT_NAME + path).replace /\/{2,}/g, '/'

    return App
