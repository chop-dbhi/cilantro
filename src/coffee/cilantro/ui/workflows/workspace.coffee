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

        onRender: ->
            @queries.show new base.LoadView
                message: 'Loading queries...'

            c.promiser.when 'shared_queries', =>
                @queries.show new query.QueryList
                    collection: c.data.shared_queries


    { WorkspaceWorkflow }
