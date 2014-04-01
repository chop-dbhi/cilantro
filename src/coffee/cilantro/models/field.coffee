define [
    'underscore'
    'backbone'
    '../core'
    './base'
    './stats'
], (_, Backbone, c, base, stats) ->


    getLogicalType = (attrs) ->
        # Takes precedence since it is specified explicitly
        if (type = c.config.get("fields.instances.#{ attrs.id }.type"))
            return type

        # Fallback to the upstream type defined on the field
        if attrs.logical_type?
            return attrs.logical_type

        # Infer/select a logical type based on the field's properties
        type = attrs.simple_type

        if attrs.enumerable or type is 'boolean'
            return 'choice'

        return type


    class FieldModel extends base.Model
        constructor: ->
            super
            if @links.stats
                @stats = new stats.StatCollection
                @stats.url = => @links.stats

        parse: ->
            @_cache = {}
            attrs = super
            attrs.type = getLogicalType(attrs)
            return attrs

        distribution: (handler, cache=true) ->
            if not @links.distribution? then handler()
            if cache and @_cache.distribution?
                handler(@_cache.distribution)
            else
                Backbone.ajax
                    url: @links.distribution
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.distribution = if cache then resp else null
                        handler(resp)
            return

        values: (params, handler, cache=true) ->
            # Shift arguments if params is not supplied
            if typeof params is 'function'
                handler = params
                cache = handler
                params = {}
            # Do not cache query-based lookups
            else if params
                cache = false
                # Support previous behavior of passing a query string.
                if typeof params is 'string'
                    params = query: params

            # Field does not support values, call the handler without
            # a response
            if not @links.values? then handler()

            deferred = Backbone.$.Deferred()

            # Register handler to facilitate previous behavior
            if handler then deferred.done(handler)

            # Use cache if available
            if cache and @_cache.values?
                deferred.resolve(@_cache.values)
            else
                Backbone.ajax
                    url: @links.values
                    data: params
                    dataType: 'json'
                    success: (resp) =>
                        if cache then @_cache.values = resp
                        deferred.resolve(resp)
                    error: =>
                        deferred.reject()

            return deferred.promise()


    class FieldCollection extends base.Collection
        model: FieldModel

        search: (query, handler) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: query: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
