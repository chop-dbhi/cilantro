define [
    'underscore'
    'backbone'
    '../core'
    './base'
    './stats'
], (_, Backbone, c, base, stats) ->


    class FieldModel extends base.Model
        constructor: ->
            super
            if @links.stats
                @stats = new stats.StatCollection
                @stats.url = => @links.stats

        parse: ->
            @_cache = {}
            super

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

        values: (query, handler, cache=true) ->
            # Shift argument is not query is supplied
            if typeof query is 'function'
                handler = query
                cache = handler
                query = ''
            # Do not cache query-based lookups
            else
                cache = false

            if not @links.values? then handler()
            if cache and @_cache.values?
                handler(@_cache.values)
            else
                Backbone.ajax
                    url: @links.values
                    data: query: query
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.values = if cache then resp else null
                        handler(resp)
            return


    class FieldCollection extends base.Collection
        model: FieldModel

        url: ->
            c.session.url('fields')

        search: (query, handler) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: query: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
