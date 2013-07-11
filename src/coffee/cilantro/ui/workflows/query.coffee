define [
    '../core'
    '../base'
    '../concept'
    '../context'
    'tpl!templates/workflows/query.html'
], (c, base, concept, context, templates...) ->

    templates = c._.object ['query'], templates


    class QueryWorkflow extends c.Marionette.Layout
        className: 'query-workflow'

        template: templates.query

        regions:
            concepts: '.concept-panel-region'
            workspace: '.concept-workspace-region'
            context: '.context-panel-region'

        onRender: ->
            @workspace.show new concept.ConceptWorkspace

            # Deferred loading of views..
            @concepts.show new base.LoadView
                message: 'Loading query concepts...'

            @context.show new base.LoadView
                message: 'Loading session context...'

            c.data.concepts.ready =>
                @concepts.show new concept.ConceptPanel
                    collection: c.data.concepts.queryable

            c.data.contexts.ready =>
                @context.show new context.ContextPanel
                    model: c.data.contexts.getSession()


    { QueryWorkflow }