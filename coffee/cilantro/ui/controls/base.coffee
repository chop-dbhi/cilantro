define [
    '../core'
], (c) ->


    class ControlError extends Error


    controlOptions = ['attrNames', 'dataAttrs', 'dataSelectors', 'regions',
        'regionViews', 'attrGetters', 'attrSetters']


    # Control interface, this should not be used directly
    class Control extends c.Marionette.Layout
        className: 'control'

        attrNames: ['field', 'operator', 'value', 'nulls']

        regions:
            field: '.control-field'
            operator: '.control-operator'
            value: '.control-value'
            nulls: '.control-nulls'

        regionViews: {}

        regionOptions: {}

        dataAttrs:
            field: 'data-field'
            operator: 'data-operator'
            value: 'data-value'
            nulls: 'data-nulls'

        dataSelectors:
            field: '[data-field]'
            operator: '[data-operator]'
            value: '[data-value]'
            nulls: '[data-nulls]'

        attrGetters:
            field: 'getField'
            operator: 'getOperator'
            value: 'getValue'
            nulls: 'getNulls'

        attrSetters:
            field: 'setField'
            operator: 'setOperator'
            value: 'setValue'
            nulls: 'setNulls'

        constructor: ->
            super
            @bindContext(@options.context)

            for optionKey in controlOptions
                if (option = @options[optionKey])?
                    if c._.isArray(option)
                        @[optionKey] = option
                    else if c._.isObject(option)
                        @[optionKey] = c._.extend {}, @[optionKey], option
                    else
                        @[optionKey] = option
            return

        bindContext: (context) ->
            @unbindContext()
            if context?
                @context = context

                @context.listenTo @, 'change', (view, attrs) =>
                    @context.set(attrs)

                @listenTo context, 'change', (model, options) =>
                    @set(model.changedAttributes())

        unbindContext: ->
            @context?.stopListening(@)
            @stopListening(@context)

        onRender: ->
            for key, klass of c._.result @, 'regionViews'
                inputAttrs = {}
                inputAttrs[@dataAttrs[key]] = ''

                options = c._.extend {}, c._.result(@regionOptions, key),
                    inputAttrs: inputAttrs
                    model: @model

                @[key].show new klass(options)

            @set(@context)

        _get: (key, options) ->
            if not (method = @attrGetters[key]) then return
            if (func = @[method])?
                return func.call(@, options)
            throw new ControlError 'Getter declared, but not defined'

        _set: (key, value, options) ->
            if not (method = @attrSetters[key]) then return
            if (func = @[method])?
                return func.call(@, value, options)
            throw new ControlError 'Setter declared, but not defined'

        get: (key, options) ->
            if typeof key is 'object'
                options = key
                key = null

            if key?
                @_get key, options
            else
                attrs = {}
                for key in @attrNames
                    if (value = @_get key, options)?
                        attrs[key] = value
                return attrs

        set: (key, value, options) ->
            if key? and typeof key is 'object'
                if key instanceof c.Backbone.Model
                    attrs = key.toJSON()
                else
                    attrs = key
                options = value
            else
                (attrs = {})[key] = value

            for key, value of attrs
                @_set key, value, options
            return

        clear: (key, options) ->
            if typeof key is 'object'
                options = key
                key = null

            if key?
                @_set key, null, options
            else
                for key in @attrNames
                    @_set key, null, options
            return

        # Triggered any time the control contents have changed. Upstream, the
        # context can be bound to this event and update itself as changes
        # occur. The small timer is prevent chatty typing
        change: (event) =>
            @trigger 'change', @, @get()


        getField: ->
        getOperator: ->
        getValue: ->
        getNulls: ->

        setField: ->
        setOperator: ->
        setValue: ->
        setNulls: ->


    { Control }
