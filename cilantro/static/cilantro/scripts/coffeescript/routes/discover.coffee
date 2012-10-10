define [
    'environ'
    'mediator'
    'jquery'
    'backbone'

    # Load shared views
    'views/queryviews'
], (environ, mediator, $, Backbone, QueryViews) ->

    # Provides the UI components for viewing expanded QueryView
    # representations. It also provides an interface for building
    # composite DataContexts
    class DiscoverArea extends Backbone.View
        id: 'discover-area'

        initialize: ->
            super
            @$el
                .hide()
                .css('margin-left', '250px')
                .css('margin-right', '250px')
                .appendTo('#main-area .inner')

            @queryViewsPanel = new QueryViews.Panel
                collection: App.DataConcept

            @queryViewsList = new QueryViews.List


            $queryViewsListToggle = $('<button class=btn><i class=icon-filter></i></button>')

            @$toolbar = $('<ul>')
                .addClass('nav pull-right')
                .hide()
                .appendTo '#subnav .container-fluid'

            $queryViewsListToggle.on 'click', (event) =>
                @queryViewsList.$el.panel 'toggle'

            @$toolbar
                .append $('<li>').html($queryViewsListToggle)

        load: ->
            @$el.fadeIn()
            @queryViewsPanel.$el.panel 'open'
            @queryViewsList.$el.panel 'open'
            @$toolbar.hide()

        unload: ->
            @$el.hide()
            @queryViewsPanel.$el.panel 'close'
            @queryViewsList.$el.panel 'close'
            @$toolbar.fadeIn()
