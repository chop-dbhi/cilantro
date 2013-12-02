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
            editQueryRegion: '.save-query-modal'
            deleteQueryRegion: '.delete-query-modal'

        regionViews:
            queries: query.QueryList

        initialize: ->
            @data = {}
            if not (@data.queries = @options.queries)
                throw new Error 'queries collection required'
            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'

        onRender: ->
            @queries.show new @regionViews.queries
                editQueryRegion: @editQueryRegion
                deleteQueryRegion: @deleteQueryRegion
                collection: @data.queries
                context: @data.context
                view: @data.view

    { WorkspaceWorkflow }
