define [
    'jquery'
    'underscore'
    'backbone'
    'marionette'
    '../base'
    '../charts'
    '../charts/utils'
    'tpl!templates/field/stats.html'
], ($, _, Backbone, Marionette, base, charts, utils, templates...) ->

    templates = _.object ['layout'], templates


    class FieldStatValue extends Marionette.ItemView
        tagName: 'li'

        # This is a map of data labels to display labels. For example, when
        # displaying data with a label of 'Distinct count', it will be
        # rendered as 'Unique values' when this field stat value is displayed
        # in the page. If a data label is not in this map, then the data
        # label itself will be used.
        labelMap:
            'Distinct count': 'Unique values'

        template: (data) =>
            "<span class=stat-label>#{ @labelMap[data.label] or data.label }</span><span class=stat-value>#{ data.value }</span>"


    class FieldStatsValues extends Marionette.CollectionView
        tagName: 'ul'

        itemView: FieldStatValue


    class FieldStatsChart extends charts.FieldChart
        className: 'sparkline'

        chartOptions: Backbone.Sparkline::chartOptions

        getChartOptions: (resp) ->
            options =
                series: [utils.getSeries(resp.data)]

            $.extend true, options, @chartOptions
            options.chart.renderTo = @ui.chart[0]
            return options


    class FieldStats extends Marionette.Layout
        className: 'field-stats'

        template: templates.layout

        regions:
            values: '.stats-values'
            chart: '.stats-chart'

        onRender: ->
            if @model.stats?
                @values.show new FieldStatsValues
                    collection: @model.stats
                if not @model.stats.length
                    @model.stats.fetch(reset: true)


    { FieldStats }
