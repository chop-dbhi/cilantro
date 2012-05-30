define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
], (environ, $, _, Backbone) ->

    class ReviewArea extends Backbone.View
        id: '#review-area'

        initialize: ->
            @$el
                .hide()
                .appendTo('#main-area .inner')

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()

        destroy: ->


    App.register 'review/', 'review', new ReviewArea
