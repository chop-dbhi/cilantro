define [
    '../../core'
    '../concept'
    'tpl!templates/workflows/query.html'
], (c, concept, templates...) ->

    templates = c._.object ['query'], templates

    class QueryWorkflow extends c.Marionette.Layout
        className: 'query-workflow'

        template: templates.query

        regions:
            index: '.concept-index-region'
            workspace: '.concept-workspace-region'
            filters: '.named-filter-region'

        onRender: ->
            @index.show new concept.ConceptIndex
                collection: c.data.concepts

            @workspace.show new concept.ConceptWorkspace


    { QueryWorkflow }
