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
            queryModal: '.create-query-modal'

        regionViews:
            queries: query.QueryList

        initialize: ->
            @data = {}
            if not (@data.queries = @options.queries)
                throw new Error 'queries collection required'

        onRender: ->
            @queries.show new @regionViews.queries
                collection: @data.queries
                queryModalRegion: @queryModal

    { WorkspaceWorkflow }
