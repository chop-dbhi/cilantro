define [
    '../core'
    '../structs'
], (c, structs) ->


    # Represents a value as defined in a query condition. For a given list of
    # values, a value can not be specified twice, so it is treated
    # as the `id`.
    class Value extends c.Backbone.Model
        idAttribute: 'value'

        defaults:
            valid: null
            pending: false

        # Disable. Instances are created via the `Values` collection.
        fetch: ->

        # The upstream use of this will be to represent an array of values.
        # If the label is not necessary, the `flat=true` can be set to return
        # only the value.
        toJSON: (options={}) ->
            if options.flat then @pluck('value') else @pick('value', 'label')

        # Override to remove itself from the collection bypassing any
        # server-side call.
        destroy: (options) ->
            @trigger('destroy', @, @collection, options)


    # Collection of selected values, fetch is disabled, create performs no
    # server-side request.
    class Values extends c.Backbone.Collection
        model: Value

        comparator: 'index'

        initialize: ->
            super
            @check = c._.debounce(@check, 300)
            @on 'add', @check

        fetch: ->

        create: (model, options) ->
            @add(model, options)

        check: =>
            models = @where(valid: null, pending: false)

            # Mark the models as pending to prevent redundant validation
            c._.each models, (model) ->
                model.set('pending', true)

            c.$.ajax
                url: @url()
                type: 'POST'
                data: JSON.stringify(models)
                contentType: 'application/json'
                success: (resp) =>
                    # Don't add since the value could have been removed
                    # in the meantime. Don't remove since this may only
                    # represent a subset of values in the collection.
                    @set resp,
                        add: false
                        remove: false

                complete: ->
                    # Mark the models as not pending when the request
                    # has completed regardless if the request succeeded
                    # or failed.
                    c._.each models, (model) ->
                        model.set('pending', false)


    { Value, Values }
