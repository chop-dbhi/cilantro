define [
    '../core'
    './item'
    './stats'
    'tpl!templates/views/field-form.html'
], (c, item, stats, templates...) ->

    templates = c._.object ['form'], templates


    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldForm extends c.Marionette.Layout
        className: 'field-form'
        template: templates.form

        initialize: ->
            @context = @options.context

        regions:
            main: '.main'
            stats: '.stats'
            controls: '.controls'
            chart: '.chart'

        # Map corresponding view class to region. This makes it
        # easier to extend. This can also be a function that returns
        # an object.
        regionViews:
            main: item.Field
            stats: stats.FieldStats
            #controls: not finished
            #chart: not finished

        onRender: ->
            for key, klass of c._.result @, 'regionViews'
                view = new klass
                    model: @model
                    context: @context

                @[key].show view
            

    { FieldForm }
