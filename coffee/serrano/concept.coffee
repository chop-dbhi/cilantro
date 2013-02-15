define ['backbone', 'underscore', './field'], (Backbone, _, fields) ->

    class ConceptModel extends Backbone.Model
        fieldModel: fields.FieldModel

        parse: (resp) ->
            @fields = []
            # Parse and attach field model instances to concept
            for attrs in resp.fields
                @fields.push(new @fieldModel attrs, parse: true)
            return resp


    class ConceptCollection extends Backbone.Collection
        model: ConceptModel

        initialize: ->
            super
            @on 'reset', @resolve

        search: (query, handler) ->
            Backbone.ajax
                url: _.result @, 'url'
                data: q: query
                success: (resp) -> handler(resp)


    { ConceptModel, ConceptCollection }
