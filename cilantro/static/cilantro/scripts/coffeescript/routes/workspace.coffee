define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
    'views/containers'
], (environ, $, _, Backbone, Containers) ->

    # Displays the users' saved components and their recent activity
    class WorkspaceArea extends Backbone.View
        id: 'workspace-area'

        initialize: ->
            @activity = new Containers.Container
            @activity.$el.addClass 'span4'
            @activity.heading.text 'Activity'

            @queries = new Containers.Container
            @queries.$el.addClass 'span4'
            @queries.heading.text 'Queries'

            @$el
                .hide()
                .appendTo('#main-area .inner')
                .addClass('row-fluid')
                .append(@activity.el, @queries.el)

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()
