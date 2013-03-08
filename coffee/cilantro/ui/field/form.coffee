define [
    '../core'
    './item'
    './stats'
    './controls'
    '../charts'
    'tpl!templates/views/field-form.html'
], (c, item, stats, controls, charts, templates...) ->

    templates = c._.object ['form'], templates


    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldForm extends c.Marionette.Layout
        className: 'field-form'

        template: templates.form

        options:
            showChart: true

        constructor: ->
            super
            @context = @options.context

        regions:
            main: '.field-main'
            stats: '.field-stats'
            controls: '.field-controls'
            chart: '.field-chart'

        # Map corresponding view class to region. This makes it
        # easier to extend. This can also be a function that returns
        # an object.
        regionViews:
            main: item.Field
            stats: stats.FieldStats
            controls: controls.FieldControl

        onRender: ->
            for key, klass of c._.result @, 'regionViews'
                view = new klass
                    model: @model
                    context: @context
                @[key].show view
            
            # Only represent for fields that support distributions
            if @options.showChart and @model.urls.distribution?
                chart = new charts.FieldChart
                    model: @model
                    context: @context
                @chart.show chart


    { FieldForm }
