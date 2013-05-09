define [
  '../core'
  './base'
  './field'
], (c, base, field) ->


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

            if resp?
                # Set the endpoint for related fields
                @fields.url = => @links.fields

                if resp.fields?
                    @fields.set(resp.fields, options)
                    delete resp.fields
            return resp


    class ConceptCollection extends base.Collection
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
                @queryable.reset @filter (m) -> !!m.get('queryview')
                @viewable.reset @filter (m) -> !!m.get('formatter_name')

        search: (query, handler) ->
            c.Backbone.ajax
                url: c._.result @, 'url'
                data: query: query
                dataType: 'json'
                success: (resp) -> handler(resp)


    { ConceptModel, ConceptCollection }
