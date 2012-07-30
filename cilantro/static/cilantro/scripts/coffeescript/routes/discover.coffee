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
                .appendTo('#main-area .inner')

            @queryViewsPanel = new QueryViews.Panel
                collection: App.DataConcept

        load: ->
            @$el.fadeIn()
            @queryViewsPanel.$el.panel 'open'

        unload: ->
            @$el.hide()
            @queryViewsPanel.$el.panel 'close'
