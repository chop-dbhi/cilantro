define ['backbone', 'underscore'], (Backbone, _) ->

    class FieldModel extends Backbone.Model
        parse: (resp) ->
            @urls = {}
            @_cache = {}
            # Simpler representation of urls
            for key, value of resp._links
                @urls[key] = value.href
            return resp

        distribution: (handler, cache=true) ->
            if not @urls.distribution? then handler()
            if cache and @_cache.distribution?
                handler(@_cache.distribution)
            else
                Backbone.ajax
                    url: @urls.distribution
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.distribution = if cache then resp else null
                        handler(resp)
            return

        stats: (handler, cache=true) ->
            if not @urls.stats? then handler()
            if cache and @_cache.stats?
                handler(@_cache.stats)
            else
                Backbone.ajax
                    url: @urls.stats
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.stats = if cache then resp else null
                        handler(resp)
            return

        values: (handler, cache=true) ->
            if not @urls.values? then handler()
            if cache and @_cache.values?
                handler(@_cache.values)
            else
                Backbone.ajax
                    url: @urls.values
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.values = if cache then resp else null
                        handler(resp)
            return


    class FieldCollection extends Backbone.Collection
        model: FieldModel

        initialize: ->
            super
            @on 'reset', @resolve
		
        search: (query, handler) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: q: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
