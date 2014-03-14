define [
    'underscore'
    'backbone'
    '../core'
    './base'
], (_, Backbone, c, base) ->


    class Facet extends Backbone.Model
        idAttribute: 'concept'


    class Facets extends Backbone.Collection
        model: Facet


    class ViewModel extends base.Model
        constructor: ->
            @facets = new Facets

            # HACK: Convert columns in facets with the specific sets of models
            # This is a until the facets API is supported on the server
            @on 'change:json', (model, value, options) ->
                @jsonToFacets(value)

            super

        initialize: ->
            @on 'request', ->
                c.trigger c.VIEW_SYNCING, @

            @on 'sync', (model, attrs, options={}) ->
                if options.silent isnt true
                    c.trigger c.VIEW_SYNCED, @, 'success'

            @on 'error', ->
                c.trigger c.VIEW_SYNCED, @, 'error'

            @on 'change', ->
                c.trigger c.VIEW_CHANGED, @

            c.on c.VIEW_SAVE, (id) =>
                if @id is id or not id and @isSession()
                    @save()

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'

        toJSON: ->
            attrs = super
            attrs.json = @facetsToJSON()
            return attrs

        parse: (attrs) ->
            super
            @jsonToFacets(attrs.json)
            return attrs

        jsonToFacets: (json) ->
            # Implies this is an array of object, set directly. This is for
            # forwards compatibility.
            if _.isArray(json)
                @facets.reset(json)
                return

            models = []

            columns = json.columns or []
            ordering = json.ordering or []

            for id in columns
                attrs = concept: id
                for [_id, sort], i in ordering
                    if id is _id
                        attrs.sort = sort
                        attrs.sort_index = i
                models.push(attrs)

            @facets.reset(models)

        facetsToJSON: ->
            json =
                ordering: []
                columns: []

            @facets.each (model) ->
                json.columns.push(model.get('concept'))

                if (direction = model.get('sort'))
                    index = model.get('sort_index')
                    sort = [model.get('concept'), direction]
                    json.ordering.splice(index, 0, sort)

            return json


    class ViewCollection extends base.SessionCollection
        model: ViewModel


    { ViewModel, ViewCollection }
