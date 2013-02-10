define ['./core'], (c) ->

    class FilterCount extends c.Backbone.View
        className: 'filter-count'

        initialize: ->
            # Only reference the model id. This is used to restrict rendering
            # for a target data context
            if @model and @model.id
                @model = @model.id

            c.subscribe c.Serrano.CONTEXT_SYNCING, (model) =>
                if model.isSession()
                    @$el.addClass 'loading'

            c.subscribe c.Serrano.CONTEXT_SYNCED, (model, status) =>
                if model.isSession()
                    @$el.removeClass 'loading'
                    @render(model)

        render: (model) =>
            if model and (count = model.get 'count')?
                suffixed = c.utils.toSuffixedNumber count
                delimited = c.utils.toDelimitedNumber count
                # Set the visible text to be the suffixed number, but also
                # set the title attr (for the hover over) to be the exact
                # number.
                label = if count is 1 then model.get 'object_name' else model.get 'object_name_plural'
                @$el.html("#{ suffixed } <span class=muted>#{ label or '' }</span>")
                    .attr('title', delimited)

                if count is 0
                    @$el.addClass 'text-error'
                else
                    @$el.removeClass 'text-error'
            else
                @$el.html('&infin;')

            return @$el
