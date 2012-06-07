define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
    'views/charts'
], (environ, $, _, Backbone, Charts) ->

    addChartButton = _.template '<button class=btn title="Add Chart"><i class=icon-signal alt="Add Chart"></i></button>'

    # Main view for the analysis components.
    # The components include:
    # - an area for displaying distribution charts and other data stats
    # - augmenting the toolbar with buttons to facilitate an analysis workflow
    class AnalysisArea extends Backbone.View
        id: '#analysis-area'

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

            @$toolbar
                .append $addChart

            App.Distribution.each (model) =>
                @addChart model

        load: ->
            @$el.fadeIn 100
            @$toolbar.fadeIn 100
            # Only render the charts after the view has been made visible
            # to ensure the correct height and width
            if not @loaded
                for view in @charts
                    view.updateChart()
                @loaded = true

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

            if @loaded then view.updateChart()


    App.register 'analyze/', 'analyze', new AnalysisArea
