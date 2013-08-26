define [
    '../core'
    '../base'
    './info'
    './stats'
    './controls'
    '../infograph'
    '../charts'
    'tpl!templates/field/form.html'
    'tpl!templates/field/form-condensed.html'
], (c, base, info, stats, controls, infograph, charts, templates...) ->

    templates = c._.object ['form', 'condensed'], templates


    getControlView = (model) ->
        type = model.get('simple_type')

        if model.get('enumerable') or type is 'boolean'
            infograph.BarChart
        else if model.get('searchable')
            controls.FieldValueSearch
        else if type is 'number'
            controls.NumberControl
        else if type is 'boolean'
            controls.BooleanControl
        else if type is 'datetime'
            controls.DateControl


    class LoadingControls extends base.LoadView
        message: 'Loading and rendering controls...'


    class FieldControls extends c.Marionette.CollectionView
        emptyView: LoadingControls

        getItemView: (model) ->
            # If the options specify an explicit view class use it. Otherwise
            # fallback to infering the interface based on the model's
            # properties.
            if not (itemView = model.get('itemView'))?
                itemView = getControlView(model.get('model'))
            return itemView

        itemViewOptions: (model, index) ->
            attrs = model.toJSON()
            attrs.index = index
            return attrs

        buildItemView: (model, itemView, options) ->
            new itemView options


    # Stores the view class and various options for a control. This is
    # used by FieldForm for adding new controls to the UI. A new instance
    # is created by specifying the `viewClass`. Any additional options will
    # be passed into the constructor of the view when initialized.
    class FieldControlOptions extends c.Backbone.Model


    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldForm extends c.Marionette.Layout
        className: 'field-form'

        getTemplate: ->
            if @options.condensedLayout
                templates.condensed
            else
                templates.form

        infoView: info.FieldInfo

        statsView: stats.FieldStats

        controlsView: FieldControls

        options:
            nodeType: 'condition'
            showInfo: true
            showChart: false
            showDefaultControl: true
            condensedLayout: false

        constructor: ->
            super
            @context = @options.context.define
                concept: @options.context.get('concept')
                field: @model.id
            , type: @options.nodeType

        regions:
            info: '.info-region'
            stats: '.stats-region'
            controls: '.controls-region'

        onRender: ->
            if @options.showInfo
                @info.show new @infoView
                    model: @model

            if @model.stats?
                @stats.show new @statsView
                    model: @model

            # Initialize empty collection view in which controls can
            # be added to.
            @controls.show new @controlsView
                collection: new c.Backbone.Collection
                context: @context

            # Add the default control
            if @options.showDefaultControl
                @addControl()

            # HACK
            # Only represent for fields that support distributions. This
            # enumerable condition is a hack since the above control
            # may already have chart-like display...and the hack grows deeper
            # to prevent a chart being added when dealing with dates...
            if not @model.get('enumerable') and
               not (@model.get('simple_type') == 'datetime')
                if @options.showChart and @model.links.distribution?
                    @addControl charts.FieldChart,
                        chart:
                            height: 200

            if @options.condensedLayout
                @$el.addClass('condensed')

        addControl: (itemView, options) ->
            model = new FieldControlOptions c._.defaults
                model: @model
                context: @context
                itemView: itemView
            , options
            @controls.currentView.collection.add(model)


    class FieldFormCollection extends c.Marionette.CollectionView
        itemView: FieldForm

        itemViewOptions: (model, index) ->
            options =
                model: model
                context: @options.context

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


    { FieldControls, FieldForm, FieldFormCollection }
