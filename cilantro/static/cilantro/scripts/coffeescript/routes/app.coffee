define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'views/counter'
], (environ, mediator, $, _, Backbone, DataContextCount) ->

    class AppArea extends Backbone.View

        load: ->
            view = new DataContextCount

            @$toolbar = $('<ul>')
                .addClass('nav pull-left')
                .appendTo '#subnav .container-fluid'

            @$toolbar.append $('<li>').html view.render()
