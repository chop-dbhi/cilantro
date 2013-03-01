define [
    'highcharts'
    'underscore'
    'backbone'
    './backbone-charts/options'
    'plugins/backbone-marionette'
], (Highcharts, _, Backbone, chartOptions) ->

    OPTIONS_MAP =
        el: 'chart.renderTo'
        type: 'chart.type'
        height: 'chart.height'
        width: 'chart.width'
        labelFormatter: 'plotOptions.series.dataLabels.formatter'
        tooltipFormatter: 'tooltip.formatter'
        animate: 'plotOptions.series.animation'
        categories: 'xAxis.categories'
        title: 'title.text'
        subtitle: 'subtitle.text'
        xAxis: 'xAxis.title.text'
        yAxis: 'yAxis.title.text'
        stacking: 'plotOptions.series.stacking'
        legend: 'legend.enabled'
        suffix: 'tooltip.valueSuffix'
        prefix: 'tooltip.valuePrefix'
        series: 'series'

    class Chart extends Backbone.Marionette.ItemView
        className: 'chart'
        chartOptions: chartOptions.defaults

        initialize: (options) ->
            if not options.el? then options.el = @el
            @chartOptions = $.extend true, {}, @chartOptions, options.options
            # Map convenience options to the real ones
            for key, value of options
                if OPTIONS_MAP[key]
                    @setOption OPTIONS_MAP[key], value
            return

        # Convenience method for setting an option since the option hierarchy
        # is so large. The `key` may use the dot-notion for accessing nested
        # structures.
        setOption: (key, value) ->
            options = @chartOptions
            toks = key.split('.')
            last = toks.pop()
            for tok in toks
                if not options[tok]?
                    options[tok] = {}
                options = options[tok]
            options[last] = value

        render: ->
            # Destroy previous chart
            if @chart then @chart.destroy()

            # Check for model or collection
            if @model
                @chartOptions.series = [$.extend true, {}, @model.toJSON()]
                if @model.categories
                    @setOption 'xAxis.categories', @model.categories
            # There are two potential usages of a collection. If the collection
            # is a Series instance (as defined above), treat it as a single
            # series. Otherwise assume it is a collection of multiple series
            else if @collection
                if @collection instanceof Series
                    @chartOptions.series = [$.extend true, {}, @collection.toJSON()]
                else
                    @chartOptions.series = $.extend true, [], @collection.toJSON()

                if @collection.categories
                    @setOption 'xAxis.categories', @collection.categories

            @chart = new Highcharts.Chart @chartOptions
            return @$el


    # Set a default option for the class
    Chart.setDefaultOption = (key, value) ->
        options = @::chartOptions = _.clone @::chartOptions
        toks = key.split('.')
        last = toks.pop()
        prev = null
        prevTok = null

        for tok in toks
            prev = options
            if prev[tok]?
                options = _.clone prev[tok]
            else
                options = {}
            prev[tok] = options
        options[last] = value


    class AreaChart extends Chart
    AreaChart.setDefaultOption('chart.type', 'area')
 
    class AreaSplineChart extends Chart
    AreaSplineChart.setDefaultOption('chart.type', 'areaspline')

    class BarChart extends Chart
    BarChart.setDefaultOption('chart.type', 'bar')

    class ColumnChart extends Chart
    ColumnChart.setDefaultOption('chart.type', 'column')

    class LineChart extends Chart
    LineChart.setDefaultOption('chart.type', 'line')

    class PieChart extends Chart
    PieChart.setDefaultOption('chart.type', 'pie')
    PieChart.setDefaultOption('legend.enabled', true)

    class ScatterChart extends Chart
    ScatterChart.setDefaultOption('chart.type', 'scatter')

    class SplineChart extends Chart
    SplineChart.setDefaultOption('chart.type', 'spline')

    class Sparkline extends Chart
        className: 'sparkline'
        chartOptions: chartOptions.sparkline


    Backbone.Chart = Chart
    Backbone.AreaChart = AreaChart
    Backbone.AreaSplineChart = AreaSplineChart
    Backbone.BarChart = BarChart
    Backbone.ColumnChart = ColumnChart
    Backbone.LineChart = LineChart
    Backbone.PieChart = PieChart
    Backbone.ScatterChart = ScatterChart
    Backbone.SplineChart = SplineChart

    Backbone.Sparkline = Sparkline

    return
