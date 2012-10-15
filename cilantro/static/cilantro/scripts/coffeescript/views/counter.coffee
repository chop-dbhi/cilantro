define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'serrano/channels'
], (environ, mediator, $, _, Backbone, channels) ->


    class DataContextCount extends Backbone.View
        className: 'datacontext-count'

        initialize: ->
            # Only reference the model id. This is used to restrict rendering
            # for a target data context
            if @model and @model.id
                @model = @model.id

            mediator.subscribe channels.DATACONTEXT_SYNCING, (model) =>
                if model.isSession()
                    @$el.addClass 'loading'

            mediator.subscribe channels.DATACONTEXT_SYNCED, (model, status) =>
                if model.isSession()
                    @$el.removeClass 'loading'
                    @render(model)

        render: (model) =>
            if model and (count = model.get 'count')?
                suffixed = App.Numbers.toSuffixedNumber count
                delimited = App.Numbers.toDelimitedNumber count
                # Set the visible text to be the suffixed number, but also
                # set the title attr (for the hover over) to be the exact
                # number.
                @$el.text(suffixed)
                    .attr('title', delimited)

                if count is 0
                    @$el.addClass 'text-error'
                else
                    @$el.removeClass 'text-error'
            else
                @$el.html('&infin;')

            return @$el
