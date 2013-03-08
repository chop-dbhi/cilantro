define [
    'highcharts'
    'underscore'
    'backbone'
    './backbone-charts/options'
    'plugins/backbone-marionette'
], (Highcharts, _, Backbone, chartOptions) ->


    # Highcharts options are very nested.. this makes the common ones more
    # accessible. Use the `setOption` method to parse the options
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
        template: ->

        chartOptions: chartOptions.defaults

        initialize: (options) ->
            super(options)
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

        getChartOptions: ->
            @chartOptions

        renderChart: (options) ->
            if @chart then @chart.destroy?()
            @chart = new Highcharts.Chart(options)


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
