define [
    '../../core'
    'tpl!templates/workflows/results.html'
], (c, templates...) ->

    templates = c._.object ['results'], templates

    class ResultsWorkflow extends c.Marionette.Layout
        className: 'results-workflow'

        template: templates.results

        regions: {}

        onRender: ->


    { ResultsWorkflow }
