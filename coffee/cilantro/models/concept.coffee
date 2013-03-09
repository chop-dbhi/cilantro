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

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, => @fetch()
            c.subscribe c.SESSION_CLOSED, => @reset()
            @on 'reset', @resolve


        search: (query, handler) ->
            c.Backbone.ajax
                url: c._.result @, 'url'
                data: q: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { ConceptModel, ConceptCollection }
