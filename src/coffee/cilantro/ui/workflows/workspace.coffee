define [
    'underscore'
    'marionette'
    '../core'
    '../base'
    '../query'
], (_, Marionette, c, base, query) ->

    class WorkspaceWorkflow extends Marionette.Layout
        className: 'workspace-workflow'

        template: 'workflows/workspace'

        regions:
            queries: '.query-region'
            publicQueries: '.public-query-region'
            editQueryRegion: '.save-query-modal'
            deleteQueryRegion: '.delete-query-modal'

        regionViews:
            queries: query.QueryList

        initialize: ->
            @data = {}
            if c.isSupported('2.2.0') and not (@data.public_queries = @options.public_queries)
                throw new Error 'public queries collection required'
            if not (@data.queries = @options.queries)
                throw new Error 'queries collection required'
            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'

            @queryView = new @regionViews.queries
                editQueryRegion: @editQueryRegion
                deleteQueryRegion: @deleteQueryRegion
                collection: @data.queries
                context: @data.context
                view: @data.view
                editable: true

            if c.isSupported('2.2.0')
                @publicQueryView = new @regionViews.queries
                    collection: @data.public_queries
                    context: @data.context
                    view: @data.view
                    title: 'Public Queries'
                    emptyMessage: "There are no public queries. You can create a new, public query by navigating to the 'Results' page and clicking on the 'Save Query...' button. While filling out the query form, you can mark the query as public which will make it visible to all users and cause it to be listed here."

        onRender: ->
            @queries.show @queryView

            if c.isSupported('2.2.0')
                # When the queries are synced we need to manually update the
                # public queries collection so that any changes to public
                # queries are reflected there. Right now, this is done lazily
                # rather than checking if the changed model is public or had
                # its publicity changed. If this becomes too slow we can
                # perform these checks but for now this is snappy enough.
                @data.queries.on 'sync destroy', (model, resp, options) =>
                    @publicQueries.currentView.collection.fetch()
                    @publicQueries.currentView.collection.reset()

                # We explicitly set the editable option to false below because
                # users should not be able to edit the public queries
                # collection.
                @publicQueries.show @publicQueryView

    { WorkspaceWorkflow }
