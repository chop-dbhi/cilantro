define [
    '../../core'
    '../concept'
    '../context'
    'tpl!templates/workflows/query.html'
], (c, concept, context, templates...) ->

    templates = c._.object ['query'], templates


    class QueryWorkflow extends c.Marionette.Layout
        className: 'query-workflow'

        template: templates.query

        regions:
            concepts: '.concept-panel'
            workspace: '.concept-workspace'
            context: '.context-panel'

        onRender: ->
            @concepts.show new concept.ConceptPanel
                collection: c.data.concepts.queryable

            @workspace.show new concept.ConceptWorkspace

            # TODO fix
            c.data.contexts.ready =>
                @context.show new context.Context
                    model: c.data.contexts.getSession()


    { QueryWorkflow }
