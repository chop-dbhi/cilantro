define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
], (environ, $, _, Backbone) ->

    # XXX: Not Implemented
    # The composite area enables arranging and chaining together conditions
    # as well as saved off DataContexts for more logically complex queries.
    class CompositeArea extends Backbone.View
        id: 'composite-area'

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()
