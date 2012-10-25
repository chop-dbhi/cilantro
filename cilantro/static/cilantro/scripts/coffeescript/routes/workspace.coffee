define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'views/containers'
    'serrano'
], (environ, mediator, $, _, Backbone, Containers, Serrano) ->

    # Displays the users' saved components and their recent activity
    class WorkspaceArea extends Backbone.View
        id: 'workspace-area'

        initialize: ->
            @activity = new Containers.Container
            @activity.$el.addClass 'span6'
            @activity.heading.text 'Activity'

            @queries = new Containers.Container
            @queries.$el.addClass 'span6'
            @queries.heading.text 'Queries'

            @$el
                .hide()
                .appendTo('#main-area .inner')
                .addClass('row-fluid')
                .append(@queries.render(), @activity.render())

            mediator.subscribe Serrano.DATACONTEXT_HISTORY, (models) ->

            mediator.subscribe Serrano.DATAVIEW_HISTORY, (models) ->

        load: ->
            @$el.show()

        unload: ->
            @$el.hide()
