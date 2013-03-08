define [
    '../core'
    '../charts'
    '../charts/utils'
    'tpl!templates/views/field-stats.html'
    'tpl!templates/views/field-stats-values.html'
], (c, charts, utils, templates...) ->

    templates = c._.object ['layout', 'values'], templates

    
    # Prettifies a key for display
    prettyKey = (key) ->
        key = key.replace(/[_\-\s]+/, ' ').trim()
        key.charAt(0).toUpperCase() + key.substr(1)


    # Prettifies a value for display
    prettyValue = (value) ->
        if c._.isNumber(value) then c.utils.prettyNumber(value) else value


    # Takes an object of key/value pairs representing stats and prettifies
    # the key and number for display
    prettyStats = (data, rawValue=false) ->
        stats = {}
        for key, value of data
            if key.slice(0, 1) is '_' then continue
            stats[prettyKey(key)] = prettyValue(value)
        return stats


    class FieldStatsValues extends c.Marionette.ItemView
        tagName: 'ul'
        className: 'field-stats'

        template: ->

        onRender: ->
            @model.stats (data) =>
                data = prettyStats(data)
                html = c.renderTemplate(templates.values, data)
                @$el.html(html)


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
        template: templates.layout

        regions:
            values: '.stats-values'

        onRender: ->
            @values.show new FieldStatsValues
                model: @model


    { FieldStats }
