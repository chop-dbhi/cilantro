define [
    '../core'
], (c) ->
    

    class ViewModel extends c.Backbone.Model
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
                c.publish c.VIEW_SYNCED, @, 'success'

            # If the sync fails on the server
            @on 'error', ->
                c.publish c.VIEW_SYNCED, @, 'error'

            # Notify subscribers the this object has changed
            @on 'change', ->
                c.publish c.VIEW_CHANGED, @

            # Pause syncing with the server
            c.subscribe c.VIEW_PAUSE, (id) =>
                if @id is id or not id and @isSession()
                    @pending()

            # Resume syncing with the server
            c.subscribe c.VIEW_RESUME, (id) =>
                if @id is id or not id and @isSession()
                    @resolve()

            c.subscribe c.VIEW_COLUMNS, (id, columns) =>
                if c._.isArray id
                    columns = id
                    id = null

                if @id is id or not id and @isSession()
                    json = @get('json') or {}
                    json.columns = columns
                    @set 'json', json
                    @save()

            c.subscribe c.VIEW_ORDERING, (id, ordering) =>
                if c._.isArray id
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
            c.publish c.VIEW_SYNCING, @
            @pending()


    class ViewCollection extends c.Backbone.Collection
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
