define [
    'environ'
    'mediator'
    'backbone'
], (environ, mediator, Backbone) ->

    class Distribution extends Backbone.Model
        defaults:
            xAxis: null
            yAxis: null
            series: null
            expanded: false

        # No-op sync method to prevent sending off requests itself
        sync: (method, model, options) ->


    class Distributions extends Backbone.Collection
        model: Distribution

        comparator: (model) -> model.get 'order'

        initialize: ->
            # Subscribe to load events of the distributions
            mediator.subscribe 'session/load/distributions', (distributions) =>
                @add distributions, silent: true

            # Emit saving the distributions data to the session
            @on 'all', _.debounce =>
                mediator.publish 'session/save', 'distributions', @toJSON()

        # No-op sync method to prevent sending off requests itself
        sync: (method, model, options) ->


    App.Distribution = new Distributions
