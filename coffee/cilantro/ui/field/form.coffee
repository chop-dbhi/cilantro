define [
    '../core'
    './info'
    './stats'
    './controls'
    '../charts'
    'tpl!templates/views/field-form.html'
], (c, info, stats, controls, charts, templates...) ->

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
            info: '.field-info'
            stats: '.field-stats'
            control: '.field-control'
            chart: '.field-chart'

        onRender: ->
            if not @options.hideInfo
                @info.show new info.FieldInfo
                    model: @model
                    context: @context

            if @model.stats?
                @stats.show new stats.FieldStats
                    model: @model

            @control.show new controls.FieldControl
                model: @model
                context: @context

            # Only represent for fields that support distributions
            if @options.showChart and @model.links.distribution?
                @chart.show new charts.FieldChart
                    model: @model
                    context: @context
                    chart:
                        height: 200

            @setDefaultState()

        setDefaultState: ->
            if @options.managed then @ui.actions.hide()
            if @context?.isValid()
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
            @context?.save()
            if @options.managed
                @setUpdateState()

        # Clears the local context of conditions
        clear: ->
            if @context?
                @context.clear()
                @context.save()
            if @options.managed
                @setNewState()


    class FieldFormCollection extends c.Marionette.CollectionView
        itemView: FieldForm

        itemViewOptions: (model, index) ->
            context = @options.context

            options =
                model: model
                context: context.fetch
                    field: model.id
                    concept: context.get 'concept'
                ,
                    create: 'condition'

            # This collection is used by a concept, therefore if only one
            # field is present, the concept name and description take
            # precedence
            if @options.hideSingleFieldInfo and @collection.length < 2
                options.hideInfo = true

            if not @fieldChartIndex? and model.links.distribution?
                @fieldChartIndex = index
                options.showChart = true

            return options


    { FieldForm, FieldFormCollection }
