define ['../core', './field'], (c, field) ->

    class ConceptModel extends c.Backbone.Model
        parse: (resp) ->
            @fields = []
            # Parse and attach field model instances to concept
            for attrs in resp.fields
                @fields.push(new field.FieldModel attrs, parse: true)
            return resp


    class ConceptCollection extends c.Backbone.Collection
        model: ConceptModel

        url: ->
            c.getSessionUrl('concepts')

        constructor: ->
            @queryable = new c.Backbone.Collection
            @viewable = new c.Backbone.Collection
            super

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSED, => @reset()

            @on 'reset', @resolve

            # Update the sub-collections with the specific sets of models
            @on 'reset', ->
                @queryable.set @filter (m) -> m.get('queryview')?
                @viewable.set @filter (m) -> m.get('formatter_name')?

        search: (query, handler) ->
            c.Backbone.ajax
                url: c._.result @, 'url'
                data: query: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { ConceptModel, ConceptCollection }
