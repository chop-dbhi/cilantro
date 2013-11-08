define [
    'underscore'
    'backbone'
    'marionette'
], (_, Backbone, Marionette) ->

    # Unbinds the view from it's previously bound context
    unbindContext = (view) ->
        if (model = view.context)
            delete view.context
            model.stopListening(view)
            view.stopListening(model)
        return

    # Sets up a two-way binding between the view and context and
    # unbinds a previously bound context
    bindContext = (view, model) ->
        unbindContext(view)

        model.listenTo view, 'change', (view, attrs) ->
            model.set(attrs)

        view.listenTo model, 'change', (model, options) ->
            view.set(model.changedAttributes())

        view.context = model
        return


    class ControlError extends Error


    class Control extends Marionette.Layout
        attrNames: ['concept', 'field', 'operator', 'value']

        attrGetters:
            concept: 'getConcept'
            field: 'getField'
            operator: 'getOperator'
            value: 'getValue'

        attrSetters:
            concept: 'setConcept'
            field: 'setField'
            operator: 'setOperator'
            value: 'setValue'

        constructor: (options={}) ->
            @context = options.context

            super(options)

            if @context
                @bindContext(@context)
                # Set the initial state of the view from the context on render
                @on('item:rendered', @initialSet)

        bindContext: (context) ->
            bindContext(@, context)

        unbindContext: ->
            unbindContext(@)

        initialSet: ->
            @set(_.clone(@context.attributes))

        # Get the value from this control for the attr key. This
        # attempts to call the associated method in attrGetters.
        _get: (key, options) ->
            if not (method = @attrGetters[key]) then return
            if (func = @[method])?
                return func.call(@, options)
            throw new ControlError('Getter declared, but not defined')

        # Set the value on this control for the attr key. This
        # attempts to call the associated method in attrSetters.
        _set: (key, value, options) ->
            if not (method = @attrSetters[key]) then return
            if (func = @[method])?
                return func.call(@, value, options)
            throw new ControlError('Setter declared, but not defined')

        # Return attributes for each getter defined for this control.
        # If a specific key is provided, only return the value for that key.
        get: (key, options) ->
            # Shift arguments
            if _.isObject('object')
                options = key
                key = null

            if key?
                @_get(key, options)
            else
                attrs = {}
                for key in @attrNames
                    # If the getter returns an undefined result, this implies
                    # the method is not implemented.
                    if (value = @_get(key, options)) isnt undefined
                        attrs[key] = value
                return attrs

        # Sets a value on the control for the attr key or object. If an model
        # is passed, it's toJSON method is called to returned the underlying
        # attributes of the model.
        set: (key, value, options) ->
            if typeof key is 'object'
                if key instanceof Backbone.Model
                    attrs = key.toJSON()
                else
                    attrs = key
                options = value
            else
                (attrs = {})[key] = value

            for key, value of attrs
                if value isnt undefined
                    @_set(key, value, options)
            return

        # Should be called when this control's state has changed
        triggerChange: (key, options) ->
            if _.isString(key)
                @trigger("change:#{ key }", @, @get(key, options), options)
            else
                # The real options are in the key argument
                @trigger('change', @, @get(), key)
            return

        # Placeholder no-op getter/setter functions for each attribute
        getConcept: ->
        getField: ->
        getOperator: ->
        getValue: ->

        setConcept: ->
        setField: ->
        setOperator: ->
        setValue: ->


    { Control }
