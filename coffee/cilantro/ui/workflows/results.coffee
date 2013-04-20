define [
    '../../core'
    '../../structs'
    '../tables'
    'tpl!templates/workflows/results.html'
], (c, structs, tables, templates...) ->

    templates = c._.object ['results'], templates

    class ResultsWorkflow extends c.Marionette.Layout
        className: 'results-workflow'

        template: templates.results

        initialize: ->
            if not @model?
                @model = new structs.Frame

        regions:
            table: '.table-region'

        onRender: ->
            @table.show new tables.Table
                model: @model


    { ResultsWorkflow }
