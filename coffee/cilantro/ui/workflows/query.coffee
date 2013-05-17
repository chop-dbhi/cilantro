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
            concepts: '.concept-panel'
            workspace: '.concept-workspace'
            context: '.context-panel'

        onRender: ->
            @workspace.show new concept.ConceptWorkspace

            # Deferred loading of views..
            @concepts.show new base.LoadView
            @context.show new base.LoadView

            c.data.concepts.ready =>
                @concepts.show new concept.ConceptPanel
                    collection: c.data.concepts.queryable

            c.data.contexts.ready =>
                @context.show new context.Context
                    model: c.data.contexts.getSession()


    { QueryWorkflow }
