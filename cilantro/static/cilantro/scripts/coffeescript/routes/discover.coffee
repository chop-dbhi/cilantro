define [
    'environ'
    'jquery'
    'use!underscore'
    'use!backbone'
], (environ, $, _, Backbone) ->

    class DiscoverArea extends Backbone.View
        id: '#discover-area'

        initialize: ->
            @$el
                .hide()
                .css('margin-left', '250px')
                .appendTo('#main-area .inner')

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()

        destroy: ->


    App.register 'discover/', 'discover', new DiscoverArea
