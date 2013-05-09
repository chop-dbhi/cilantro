define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
    'views/charts'
], (environ, mediator, $, _, Backbone, Charts) ->

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

            @defer => @addChart model for model in App.Distribution.models
            mediator.subscribe 'datacontext/change', @updateCharts

        updateCharts: =>
            (view.updateChart() for view in @charts)
            return

        load: ->
            @$el.fadeIn 100
            @$toolbar.fadeIn 100

        unload: ->
            @$el.hide()
            @$toolbar.hide()

        addChart: (attrs) ->
            if not attrs instanceof App.Distribution.model
                model = attrs
            else
                model = App.Distribution.create(attrs)

            view = new Charts.Distribution
                model: model
                collection: App.DataField

            @charts.push view
            @$el.append view.$el

            view.updateChart()


    App.register 'analyze/', 'analyze', new AnalysisArea
