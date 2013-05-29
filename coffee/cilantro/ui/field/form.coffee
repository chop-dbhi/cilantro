define [
    '../core'
    './info'
    './stats'
    './controls'
    '../infograph'
    '../charts'
    'tpl!templates/views/field-form.html'
], (c, info, stats, controls, infograph, charts, templates...) ->

    templates = c._.object ['form'], templates


    getControlInterface = (model) ->
        if model.get('enumerable')
            infograph.BarChart
        else
            controls.select(model)


    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldForm extends c.Marionette.Layout
        className: 'field-form'

        template: templates.form

        options:
            managed: true
            showInfo: true
            showChart: false
            condensedLayout: false

        constructor: ->
            super
            @context = @options.context

        events:
            'click .actions [data-toggle=add]': 'save'
            'click .actions [data-toggle=update]': 'save'
            'click .actions [data-toggle=remove]': 'clear'

        ui:
            actions: '.actions'
            add: '.actions [data-toggle=add]'
            remove: '.actions [data-toggle=remove]'
            update: '.actions [data-toggle=update]'

        regions:
            info: '.info-region'
            stats: '.stats-region'
            control: '.control-region'
            chart: '.chart-region'

        onRender: ->
            @ui.actions.toggle(not @options.managed)

            if @options.showInfo
                @info.show new info.FieldInfo
                    model: @model
                    context: @context

            if @model.stats?
                @stats.show new stats.FieldStats
                    model: @model

            Control = getControlInterface(@model)
            @control.show new Control
                model: @model
                context: @context

            # Only represent for fields that support distributions. This
            # enumerable condition is a hack since the above control
            # may already have chart-like display..
            if not @model.get('enumerable')
                if @options.showChart and @model.links.distribution?
                    @chart.show new charts.FieldChart
                        model: @model
                        context: @context
                        chart:
                            height: 200

            if @options.condensedLayout
                @$el.addClass('condensed')

            @setState()

        setState: ->
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
            @setUpdateState()

        # Clears the local context of conditions
        clear: ->
            if @context?
                @context.clear()
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
                options.showInfo = false

            # Only check if another is not already rendered
            if not @fieldChartIndex?
                if model.links.distribution?
                    @fieldChartIndex = index
                    options.showChart = true
            else
                options.condensedLayout = true

            return options


    { FieldForm, FieldFormCollection }
