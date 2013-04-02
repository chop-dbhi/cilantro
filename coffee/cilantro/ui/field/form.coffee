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
            managed: true
            showChart: true

        constructor: ->
            super
            @context = @options.context

        events:
            'click .concept-actions [data-toggle=add]': 'save'
            'click .concept-actions [data-toggle=update]': 'save'
            'click .concept-actions [data-toggle=remove]': 'clear'

        ui:
            actions: '.field-actions'
            add: '.field-actions [data-toggle=add]'
            remove: '.field-actions [data-toggle=remove]'
            update: '.field-actions [data-toggle=update]'

        regions:
            main: '.field-main'
            stats: '.field-stats'
            control: '.field-control'
            chart: '.field-chart'

        # Map corresponding view class to region. This makes it
        # easier to extend. This can also be a function that returns
        # an object.
        regionViews:
            main: item.Field
            stats: stats.FieldStats
            control: controls.FieldControl

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

            @setDefaultState()

        setDefaultState: ->
            if @options.managed then @ui.actions.hide()
            if @context.isValid()
                @setUpdateState()
            else
                @setNewState()

        setUpdateState: ->
            @ui.add.hide()
            @ui.update.show()
            @ui.remove.show()

        setNewState: ->
            @ui.add.show()
            @ui.update.hide()
            @ui.remove.hide()

        # Saves the current state of the context which enables it to be
        # synced with the server.
        save: ->
            @context.save()
            if @options.managed then @setUpdateState()

        # Clears the local context of conditions
        clear: ->
            @context.clear()
            @context.save()
            if @options.managed then @setNewState()


    { FieldForm }
