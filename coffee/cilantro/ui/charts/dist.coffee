define [
    '../core'
    './core'
    './utils'
    'tpl!templates/views/chart.html'
], (c, charts, utils, templates...) ->

    templates = c._.object ['chart'], templates

    class FieldChart extends charts.Chart
        template: templates.chart

        ui:
            chart: '.chart'
            heading: '.heading'
            status : '.heading .status'

        initialize: ->
            super
            @context = @options.data.context

        chartClick: (event) =>
            category = event.point.category ? event.point.name
            event.point.select(not event.point.selected, true)
            @context?.set @get()

        interactive: (options) ->
            if (type = options.chart?.type) is 'pie'
                return true
            else if type is 'column' and options.xAxis.categories?
                return true
            return false

        getChartOptions: (resp) ->
            options = utils.processResponse(resp, [@model])

            if options.clustered
                @ui.status.text('Clustered').show()
            else
                @ui.status.hide()

            if @interactive(options)
                @setOption('plotOptions.series.events.click', @chartClick)

            $.extend true, options, @chartOptions
            options.chart.renderTo = @ui.chart[0]
            return options

        getValue: (options) ->
            points = @chart.getSelectedPoints()
            return (point.category for point in points)

        getOperator: -> 'in'

        removeChart: (event) ->
            super
            if @node then @node.destroy()

        onRender: ->
            @stopListening @context if @context?
            @$el.addClass 'loading'

            # Explicitly set the width of the chart so Highcharts knows
            # how to fill out the space. Otherwise if this element is
            # not in the DOM by the time the distribution request is finished,
            # the chart will default to an arbitrary size..
            if @options.parentView?
                @ui.chart.width(@options.parentView.$el.width())

            @model.distribution (resp) =>
                options = @getChartOptions(resp)
                @renderChart(options)
                @listenTo @context, 'change', @contextUpdated if @context?
                @contextUpdated()


        contextUpdated: =>
            points = @chart.series[0].points
            point.select(point.name ? point.category in @context.get('value'), true) \
                for point in points if @context?.get('value')


    { FieldChart }