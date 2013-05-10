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
            index: '.concept-index-region'
            workspace: '.concept-workspace-region'
            context: '.context-region'

        onRender: ->
            @index.show new concept.ConceptIndex
                collection: c.data.concepts.queryable

            @workspace.show new concept.ConceptWorkspace

            # TODO fix
            c.data.contexts.ready =>
                @context.show new context.Context
                    model: c.data.contexts.getSession()


    { QueryWorkflow }
