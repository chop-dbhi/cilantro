define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
    'views'
], (environ, $, _, Backbone, views) ->

    # Displays the users' saved components and their recent activity
    class WorkspaceArea extends Backbone.View
        id: '#workspace-area'

        initialize: ->
            @activity = new views.Container
            @activity.$el.addClass 'span4'
            @activity.heading.text 'Activity'

            @queries = new views.Container
            @queries.$el.addClass 'span4'
            @queries.heading.text 'Queries'

            @$el
                .hide()
                .appendTo('#main-area .inner')
                .addClass('row-fluid')
                .append(@activity.el, @queries.el)

        initialize: ->

        load: ->
            @$el.fadeIn()

        unload: ->
            @$el.hide()


    App.register '', 'workspace', new WorkspaceArea
