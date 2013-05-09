define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
], (environ, $, _, Backbone) ->

    # `App` should be marked as to whether a composite datacontext is in use

    # Enable a simply registration mechanism for the various views on the
    # page. This enables extending the UI programatically.
    class CompositeArea extends Backbone.View
        id: '#composite-area'

        initialize: ->

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()

        destroy: ->


    App.register 'discover/composite/', 'composite', new CompositeArea
