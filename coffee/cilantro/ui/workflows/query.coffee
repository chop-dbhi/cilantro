define ['../../core'
        'tpl!templates/workflows/query.html'
], (c, compiledTemplate) ->
    class QueryWorkflow extends c.Marionette.Layout

        className: 'query-workflow'

        template: compiledTemplate

        regions:
            conceptIndex: '.concept-index-container'
            conceptForms: '.concept-form-container'
            filters: '.named-filter-container'

        onRender: ->

    { QueryWorkflow }
