define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'serrano'
    'charts'
], (environ, mediator, $, _, Backbone, Serrano, Charts) ->

    addChartButton = _.template '<button class=btn title="Add Chart"><i class=icon-signal alt="Add Chart"></i></button>'

    # Main view for the analysis components.
    # The components include:
    # - an area for displaying distribution charts and other data stats
    # - augmenting the toolbar with buttons to facilitate an analysis workflow
    class AnalysisArea extends Backbone.View
        id: 'analysis-area'

        deferred:
            'updateCharts': true

        initialize: ->
            super

            @charts = []

            @$toolbar = $('<ul>')
                .addClass('nav pull-right')
                .hide()
                .appendTo '#subnav .container-fluid'

            @$el
                .hide()
                .appendTo('#main-area .inner')
                .addClass('row-fluid')
                .sortable
                    items: '> .area-container'
                    handle: '.heading'
                    update: (event, ui) =>
                        charts = @$el.children('.chart-container')
                        for view in @charts
                            idx = charts.index view.el
                            view.model.set order: idx

            $addChart = $(addChartButton()).on 'click', (event) =>
                @addChart()

            @$toolbar.append $addChart

            @distributions = new Charts.Distributions

            @distributions.when =>
                @addChart model for model in @distibution.models

            mediator.subscribe Serrano.DATACONTEXT_SYNCED, @updateCharts

        updateCharts: =>
            (view.updateChart() for view in @charts)
            return

        load: ->
            @$el.show()
            @$toolbar.show()

        unload: ->
            @$el.hide()
            @$toolbar.hide()

        addChart: (attrs) ->
            if not attrs instanceof Charts.Distribution
                model = attrs
            else
                model = @distributions.create(attrs)

            view = new Charts.DistributionChart
                model: model
                collection: App.DataField

            @charts.push view
            @$el.append view.$el

            view.changeChart()
