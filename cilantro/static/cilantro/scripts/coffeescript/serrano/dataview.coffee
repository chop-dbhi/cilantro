define [
    'environ'
    'mediator'
    'underscore'
    'backbone'
    './channels'
], (environ, mediator, _, Backbone, channels) ->


    class DataView extends Backbone.Model
        deferred:
            save: true

        url: ->
            if @isNew() then return super
            return @get('_links').self.href

        initialize: ->
            super

            if @isArchived()
                @resolve()
                return

            # Initial publish of being synced since Backbone does
            # not consider a fetch or reset to be a _sync_ operation
            # in this version. This has been changed in Backbone
            # @ commit 1f3f4525
            @on 'sync', ->
                @resolve()
                mediator.publish channels.DATAVIEW_SYNCED, @, 'success'

            # If the sync fails on the server
            @on 'error', ->
                mediator.publish channels.DATAVIEW_SYNCED, @, 'error'

            # Notify subscribers the this object has changed
            @on 'change', ->
                mediator.publish channels.DATAVIEW_CHANGED, @

            # Pause syncing with the server
            mediator.subscribe channels.DATAVIEW_PAUSE, (id) =>
                if @id is id or not id and @isSession()
                    @pending()

            # Resume syncing with the server
            mediator.subscribe channels.DATAVIEW_RESUME, (id) =>
                if @id is id or not id and @isSession()
                    @resolve()

            mediator.subscribe channels.DATAVIEW_COLUMNS, (id, columns) =>
                if _.isArray id
                    columns = id
                    id = null

                if @id is id or not id and @isSession()
                    json = @get('json') or {}
                    json.columns = columns
                    @set 'json', json
                    @save()

            mediator.subscribe channels.DATAVIEW_ORDERING, (id, ordering) =>
                if _.isArray id
                    ordering = id
                    id = null

                if @id is id or not id and @isSession()
                    json = @get('json') or {}
                    json.ordering = ordering
                    @set 'json', json
                    @save()

            @resolve()

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'

        toJSON: ->
            id: @id
            json: @get 'json'
            session: @get 'session'
            archived: @get 'archived'
            published: @get 'published'

        save: ->
            super
            mediator.publish channels.DATAVIEW_SYNCING, @
            @pending()


    class DataViews extends Backbone.Collection
        model: DataView

        initialize: ->
            super

            # Mimic the initial sync for each model
            @on 'reset', (collection) ->
                @resolve()
                for model in collection.models
                    model.trigger 'sync'
                return

        getSession: ->
            (@filter (model) -> model.get 'session')[0]

        hasSession: ->
            !!@getSession()


    { DataView, DataViews }
