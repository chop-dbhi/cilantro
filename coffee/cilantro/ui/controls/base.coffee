define [
    '../core'
], (c) ->

    # Control interface, this should not be used directly
    class Control extends c.Marionette.Layout
        attrNames: ['id', 'operator', 'value', 'nulls']

        getId: (options) ->
        getOperator: (options) ->
        getValue: (options) ->
        getNulls: (options) ->

        setId: (value, options) ->
        setOperator: (value) ->
        setValue: (value) ->
        setNulls: (value) ->

        _get: (key, options) ->
            method = "get#{ key.charAt(0).toUpperCase() }#{ key.slice(1) }"
            @[method]?(options)

        _set: (key, value, options) ->
            method = "set#{ key.charAt(0).toUpperCase() }#{ key.slice(1) }"
            @[method]?(value, options)

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


    { Control }
