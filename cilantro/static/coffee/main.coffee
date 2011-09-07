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
    ], (utils) ->

        if not window.JSON then require ['cilantro/lib/json2']
            
        $.block.defaults.message = null
        $.block.defaults.css = {}
        $.block.defaults.overlayCSS = {}

        attrs = window.App or {}

        attrs.hub = new PubSub debug: true
        App = new utils.App attrs

        window.App = App
