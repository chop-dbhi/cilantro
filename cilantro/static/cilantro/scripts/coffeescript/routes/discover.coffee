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

            mediator.subscribe 'queryviews-panel/open', =>
                @queryViewsPanel.$el.panel 'open'

            mediator.subscribe 'queryviews-panel/close', =>
                @queryViewsPanel.$el.panel 'close'

        load: ->
            @$el.fadeIn()
            mediator.publish 'queryviews-panel/open'

        unload: ->
            @$el.hide()
            mediator.publish 'queryviews-panel/close'
