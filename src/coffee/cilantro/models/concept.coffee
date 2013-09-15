define [
    'underscore'
    'backbone'
    '../core'
    './base'
    './field'
], (_, Backbone, c, base, field) ->


    class ConceptModel extends base.Model
        constructor: (attrs, options) ->
            @fields = new field.FieldCollection
            super(attrs, options)

        initialize: ->
            super

            # Fetch the field data the first time a concept receives focus
            c.on c.CONCEPT_FOCUS, (id) =>
                if @id isnt id then return
                if not @fields.length then @fields.fetch(reset:true)

        parse: (resp, options) ->
            super
            # Set the endpoint for related fields
            @fields.url = => @links.fields

            if resp?.fields?
                @fields.set(resp.fields, options)
                delete resp.fields
            return resp


    class BaseConceptCollection extends base.Collection
        model: ConceptModel

        search: (query, handler) ->
            Backbone.ajax
                url: _.result(@, 'url')
                data: query: query, brief: 1
                dataType: 'json'
                success: (resp) -> handler(resp)


    class ConceptCollection extends BaseConceptCollection
        constructor: ->
            @queryable = new BaseConceptCollection
            @viewable = new BaseConceptCollection

            @queryable.url = => _.result(@, 'url')
            @viewable.url = => _.result(@, 'url')

            super

        initialize: ->
            # Update the sub-collections with the specific sets of models
            @on 'add remove reset', ->
                @queryable.reset @filter (m) ->
                    !!m.get('queryable') or !!m.get('queryview')
                @viewable.reset @filter (m) ->
                    !!m.get('viewable') or !!m.get('formatter_name')
                c.promiser.resolve('concepts')


    { ConceptModel, ConceptCollection }
