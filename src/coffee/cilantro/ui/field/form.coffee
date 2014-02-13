define [
    'underscore'
    'backbone'
    'marionette'
    '../../logger'
    '../../core'
    '../base'
    './info'
    './stats'
    './controls'
    '../charts'
], (_, Backbone, Marionette, logger, c, base, info, stats, controls, charts) ->


    insertAt = (parent, index, element) ->
        children = parent.children()
        lastIndex = children.size()

        if (index < 0)
            index = Math.max(0, lastIndex + 1 + index)

        parent.append(element)

        if index < lastIndex
            children.eq(index).before(children.last())

        return parent

    resolveFieldFormOptions = (model) ->
        formClass = null
        formClassModule = null
        formOptions = [{}]

        # Instance options
        instanceOptions = c.config.get("fields.instances.#{ model.id }.form")

        # Constructor
        if _.isFunction(instanceOptions)
            formClass = instanceOptions
        # Module name for async fetching
        else if _.isString(instanceOptions)
            formClassModule = instanceOptions
        # Options for default form class
        else if _.isObject(instanceOptions)
            formOptions.push(instanceOptions)

        # Type options
        typeOptions = c.config.get("fields.types.#{ model.get('logical_type') }.form")

        # Constructor
        if not formClass and _.isFunction(typeOptions)
            formClass = typeOptions
        # Module name for async fetching
        else if not formClassModule and _.isString(typeOptions)
            formClassModule = typeOptions
        else
            formOptions.push(typeOptions)

        # Default options
        defaultOptions = c.config.get('fields.defaults.form')

        # Constructor
        if not formClass and _.isFunction(defaultOptions)
            formClass = defaultOptions
        # Module name for async fetching
        else if not formClassModule and _.isString(defaultOptions)
            formClassModule = defaultOptions
        else
            formOptions.push(defaultOptions)

        # Compose options in order of precedence
        formOptions = _.defaults.apply(null, formOptions)

        { view: formClass, module: formClassModule, options: formOptions }


    class LoadingFields extends base.LoadView
        message: 'Loading fields...'


    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldForm extends Marionette.Layout
        className: 'field-form'

        getTemplate: ->
            if @options.condensed
                'field/form-condensed'
            else
                'field/form'

        options:
            info: true
            chart: false
            stats: true
            controls: true
            condensed: false
            nodeType: 'condition'

        constructor: ->
            super

            @context = @options.context.define
                concept: @options.context.get('concept')
                field: @model.id
            , type: @options.nodeType

        regions:
            info: '.info-region'
            stats: '.stats-region'
            chart: '.chart-region'
            controls: '.controls-region'

        regionViews:
            info: info.FieldInfo
            stats: stats.FieldStats
            chart: charts.FieldChart
            controls: controls.FieldControls

        onRender: ->
            @renderInfo()
            @renderStats()
            @renderControls()
            @renderChart()

            if @options.condensed
                @$el.addClass('condensed')

        renderInfo: ->
            if @options.info
                options = model: @model

                if _.isObject(@options.info)
                    _.extend(options, @options.info)

                @info.show(new @regionViews.info(options))

        renderStats: ->
            if @options.stats and @model.stats?
                options = model: @model

                if _.isObject(@options.stats)
                    _.extend(options, @options.stats)

                @stats.show(new @regionViews.stats(options))

        renderControls: ->
            if @options.controls
                controls = []

                for name in @options.controls
                    controls.push
                        name: name
                        model: @model
                        context: @context

                @controls.show new @regionViews.controls
                    collection: new Backbone.Collection(controls)

            # TODO show "no controls available" message?, e.g. read-only view

        renderChart: ->
            # Append a chart if the field supports a distribution
            if @options.chart and @model.links.distribution?
                if @options.condensed
                    options = chart: height: 100
                else
                    options = chart: height: 200

                # Legacy..
                options.context = @context
                options.model = @model

                if _.isObject(@options.chart)
                    _.extend(options, @options.chart)

                @chart.show(new @regionViews.chart(options))


    class FieldError extends base.ErrorView


    class FieldFormCollection extends Marionette.View
        itemView: FieldForm

        emptyView: LoadingFields

        errorView: FieldError

        collectionEvents:
            'reset': 'render'

        render: ->
            if @collection.length
                @collection.each (model, index) =>
                    @renderItem(model, index)

            return @el

        # Renders an item.
        renderItem: (model, index) ->
            options = _.extend {}, @options,
                model: model
                context: @options.context
                index: index

            # This collection is used by a concept, therefore if only one
            # field is present, the concept name and description take
            # precedence
            if @collection.length < 2
                options.info = false
            # The non-primary field are rendered in a condensed view
            else if index > 0
                options.condensed = true

            result = resolveFieldFormOptions(model)

            options = _.extend(options, result.options)

            if result.module
                require [result.module], (viewClass) =>
                    @createView(viewClass, options)
                , (err) =>
                    @showErrorView(model)
                    logger.debug(err)
            else
                @createView(result.view or @itemView, options)

        createView: (viewClass, options) =>
            try
                view = new viewClass(options)
                view.render()
                insertAt(@$el, options.index, view.el)
            catch err
                @showErrorView(options.model)
                if c.config.get('debug') then throw err

        showErrorView: (model) ->
            view = new @errorView(model: model)
            view.render()
            @$el.html(view.el)


    { FieldForm, FieldFormCollection }
