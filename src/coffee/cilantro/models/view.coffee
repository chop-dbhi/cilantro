define [
    '../core'
    './base'
], (c, base) ->


    class Facet extends c.Backbone.Model


    class Facets extends c.Backbone.Collection
        model: Facet

        get: (obj) ->
            if not (model = super(obj)) and obj.concept?
                model = @findWhere concept: obj.concept
            return model


    class ViewModel extends base.Model
        constructor: ->
            @facets = new Facets

            # HACK: Convert columns in facets with the specific sets of models
            # This is a until the facets API is supported on the server
            @on 'change:json', (model, value, options) ->
                @jsonToFacets(value)

            super

        initialize: ->
            super

            @on 'request', ->
                @pending()
                c.publish c.VIEW_SYNCING, @

            @on 'sync', ->
                @resolve()
                c.publish c.VIEW_SYNCED, @, 'success'

            @on 'error', ->
                @resolve()
                c.publish c.VIEW_SYNCED, @, 'error'

            @on 'change', ->
                c.publish c.VIEW_CHANGED, @

            c.subscribe c.VIEW_PAUSE, (id) =>
                if @id is id or not id and @isSession()
                    @pending()

            c.subscribe c.VIEW_RESUME, (id) =>
                if @id is id or not id and @isSession()
                    @resolve()

            c.subscribe c.VIEW_SAVE, (id) =>
                if @id is id or not id and @isSession()
                    @save()

            @resolve()

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'

        toJSON: ->
            id: @id
            json: @facetsToJSON()
            session: @get 'session'
            archived: @get 'archived'
            published: @get 'published'

        parse: (attrs) ->
            super
            @jsonToFacets(attrs.json)
            return attrs

        jsonToFacets: (json) ->
            # Implies this is an array of object, set directly
            if c._.isArray(json)
                @facets.set(json)
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
                models.push attrs

            @facets.set models

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


    class ViewCollection extends base.Collection
        model: ViewModel

        url: ->
            c.getSessionUrl('views')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, =>
                @fetch(reset: true).done =>
                    @ensureSession()
                    @resolve()
            c.subscribe c.SESSION_CLOSED, => @reset()

        getSession: ->
            (@filter (model) -> model.get 'session')[0]

        hasSession: ->
            !!@getSession()

        ensureSession: ->
            if not @hasSession()
                defaults = session: true
                defaults.json = c.getOption('defaults.view')
                @create defaults


    { ViewModel, ViewCollection }
