define [
    'environ'
    'mediator'
    'channels'
    'underscore'
    'backbone'
], (environ, mediator, channels, _, Backbone) ->


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
            super

            # Subscribe to load events of the distributions
            channel = _.template channels.SESSION_LOAD, key: 'distributions'
            mediator.subscribe channel, (distributions) =>
                @add distributions, silent: true
                @resolve()

            # Emit saving the distributions data to the session
            @on 'all', _.debounce =>
                mediator.publish channels.SESSION_SET, 'distributions', @toJSON()

        # No-op sync method to prevent sending off requests itself
        sync: (method, model, options) ->


    { Distribution, Distributions }
