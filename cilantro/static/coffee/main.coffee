define [
    'common/utils'
    'cilantro/lib/jquery.ui'
    'cilantro/lib/jquery.block'
    'cilantro/lib/jquery.jqote2'
    'cilantro/lib/jquery.scrollto'
    'cilantro/vendor/underscore'
    'cilantro/vendor/backbone'
    'cilantro/vendor/pubsub'
    'cilantro/utils/ajaxsetup'
    'cilantro/utils/extensions'
    'cilantro/utils/sanitizer'
    ]

    (utils) ->

        # IE 7... this will load JSON and attach to window
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

        # finally, initialize the App object for the page
        window.App = new utils.App attrs
