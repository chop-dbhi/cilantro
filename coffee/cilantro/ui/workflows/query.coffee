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
            index: '.concept-index-container'
            workspace: '.concept-workspace-container'
            filters: '.named-filter-container'

        onRender: ->
            @index.show new concept.ConceptIndex
                collection: c.data.concepts

            @workspace.show new concept.ConceptWorkspace


    { QueryWorkflow }
