define [
    'underscore'
    'marionette'
    '../core'
    '../base'
    '../query'
    'tpl!templates/workflows/workspace.html'
], (_, Marionette, c, base, query, templates...) ->

    templates = _.object ['workspace'], templates

    class WorkspaceWorkflow extends Marionette.Layout
        className: 'workspace-workflow'

        template: templates.workspace

        regions:
            queries: '.query-region'
            public_queries: '.public-query-region'
            queryModal: '.save-query-modal'

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

        onRender: ->
            @queries.show new @regionViews.queries
                queryModalRegion: @queryModal
                collection: @data.queries
                context: @data.context
                view: @data.view

            if c.isSupported('2.2.0')
                @public_queries.show new @regionViews.queries
                    queryModalRegion: @queryModal
                    collection: @data.public_queries
                    context: @data.context
                    view: @data.view
                    title: 'Public Queries'

    { WorkspaceWorkflow }
