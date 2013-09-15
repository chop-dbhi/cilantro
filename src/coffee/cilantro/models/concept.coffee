define [
    'jquery'
    'underscore'
    'backbone'
    '../core'
    './base'
    './field'
], ($, _, Backbone, c, base, field) ->


    class ConceptModel extends base.Model
        constructor: (attrs, options={}) ->
            @fields = new field.FieldCollection
            options.parse = true
            super(attrs, options)

        initialize: ->
            super

            # Fetch the field data the first time a concept receives focus
            c.subscribe c.CONCEPT_FOCUS, (id) =>
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

        url: ->
            c.session.url('concepts')

        search: (query, handler) ->
            $.ajax
                url: _.result @, 'url'
                data: query: query, brief: 1
                dataType: 'json'
                success: (resp) -> handler(resp)


    class ConceptCollection extends BaseConceptCollection
        constructor: ->
            @queryable = new BaseConceptCollection
            @viewable = new BaseConceptCollection
            super

        initialize: ->
            c.subscribe c.SESSION_OPENED, => @fetch(reset: true)
            c.subscribe c.SESSION_CLOSED, => @reset()

            # Update the sub-collections with the specific sets of models
            @on 'add remove reset', ->
                @queryable.reset @filter (m) ->
                    !!m.get('queryable') or !!m.get('queryview')
                @viewable.reset @filter (m) ->
                    !!m.get('viewable') or !!m.get('formatter_name')
                c.promiser.resolve('concepts')


    { ConceptModel, ConceptCollection }
