define [
    'environ'
    'jquery'
    'use!backbone'
], (environ, $, Backbone) ->

    # Provides the UI components for viewing expanded QueryView
    # representations. It also provides an interface for building
    # composite DataContexts
    class DiscoverArea extends Backbone.View
        id: '#discover-area'

        initialize: ->
            @$el
                .hide()
                .css('margin-left', '250px')
                .appendTo('#main-area .inner')

        load: ->
            @$el.fadeIn()
            App.QueryViewsPanel.$el.panel 'open'

        unload: ->
            @$el.hide()
            App.QueryViewsPanel.$el.panel 'close'

        destroy: ->


    App.register 'discover/', 'discover', new DiscoverArea
