define ['../core'], (c) ->


    class FieldModel extends c.Backbone.Model
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
                c.Backbone.ajax
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
                c.Backbone.ajax
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
                c.Backbone.ajax
                    url: @urls.values
                    dataType: 'json'
                    success: (resp) =>
                        @_cache.values = if cache then resp else null
                        handler(resp)
            return


    class FieldCollection extends c.Backbone.Collection
        model: FieldModel

        url: ->
            c.getSessionUrl('fields')

        initialize: ->
            super
            # TODO change this to use Marionette's app initializer
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSED, => @reset()
            @on 'reset', @resolve
		
        search: (query, handler) ->
            c.Backbone.ajax
                url: c._.result @, 'url'
                data: q: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { FieldModel, FieldCollection }
