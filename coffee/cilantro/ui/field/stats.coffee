define [
    '../core'
    '../base'
    '../charts'
    '../charts/utils'
    'tpl!templates/views/field-stats.html'
], (c, base, charts, utils, templates...) ->

    templates = c._.object ['layout'], templates


    class FieldStatValue extends c.Marionette.ItemView
        tagName: 'li'

        template: (data) ->
            "<span class=stat-label>#{ data.label }</span><span class=stat-value>#{ data.value }</span>"


    class FieldStatsValues extends c.Marionette.CollectionView
        tagName: 'ul'

        emptyView: base.EmptyView

        itemView: FieldStatValue


    class FieldStatsChart extends charts.FieldChart
        className: 'sparkline'

        chartOptions: c.Backbone.Sparkline::chartOptions

        getChartOptions: (resp) ->
            options =
                series: [utils.getSeries(resp.data)]

            c.$.extend true, options, @chartOptions
            options.chart.renderTo = @ui.chart[0]
            return options


    class FieldStats extends c.Marionette.Layout
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
