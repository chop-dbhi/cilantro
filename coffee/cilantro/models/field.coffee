define [
  '../core'
  './base'
  './stats'
], (c, base, stats) ->


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
                c.Backbone.ajax
                    url: @links.distribution
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.distribution = if cache then resp else null
                        handler(resp)
            return

        values: (handler, cache=true) ->
            if not @links.values? then handler()
            if cache and @_cache.values?
                handler(@_cache.values)
            else
                c.Backbone.ajax
                    url: @links.values
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.values = if cache then resp else null
                        handler(resp)
            return


    class FieldCollection extends base.Collection
        model: FieldModel

        url: ->
            c.getSessionUrl('fields')

        search: (query, handler) ->
            c.Backbone.ajax
                url: c._.result @, 'url'
                data: query: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
