define [
    'underscore'
    'backbone'
    'marionette'
    '../../logger'
    '../core'
    '../base'
    '../welcome'
    '../field'
    '../charts'
    './form'
    './info'
], (_, Backbone, Marionette, logger, c, base, welcome, field, charts, form, info) ->


    resolveConceptFormOptions = (model) ->
        formClass = null
        formClassModule = null
        formOptions = [{}]

        # Instance options
        instanceOptions = c.config.get("concepts.instances.#{ model.id }.form")

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
        # Note, concept types are not yet supported, so this will always
        # return nothing
        typeOptions = c.config.get("concepts.types.#{ model.get('type') }.form")

        # Constructor
        if not formClass and _.isFunction(typeOptions)
            formClass = typeOptions
        # Module name for async fetching
        else if not formClassModule and _.isString(typeOptions)
            formClassModule = typeOptions
        else
            formOptions.push(typeOptions)

        # Default options
        defaultOptions = c.config.get('concepts.defaults.form')

        # Constructor
        if not formClass and _.isFunction(defaultOptions)
            formClass = defaultOptions
        # Module name for async fetching
        else if not formClassModule and _.isString(defaultOptions)
            formClassModule = defaultOptions
        else
            formOptions.push(defaultOptions)

        # Deprecated config
        if not formClassModule
            # Check if custom options or a module has been defined for
            # this concept.
            if (customForm = c.config.get("concepts.forms.#{ model.id }"))
                formClassModule = customForm.module
                formOptions = customForm.options
                return { module: formClassModule, options: formOptions }

        # Compose options in order of precedence
        formOptions = _.defaults.apply(null, formOptions)

        { view: formClass, module: formClassModule, options: formOptions }


    class ConceptError extends base.ErrorView
        template: 'concept/error'


    # Some of the class properties here are mimicked after CollectionView
    # since is managing the concept form views
    class ConceptWorkspace extends Marionette.Layout
        className: 'concept-workspace'

        template: 'concept/workspace'

        itemView: form.ConceptForm

        errorView: ConceptError

        regions:
            main: '.main-region'

        regionViews:
            main: welcome.Welcome

        initialize: ->
            @data = {}

            if not (@data.concepts = @options.concepts)
                throw new Error 'concept collection required'

            if not (@data.context = @options.context)
                throw new Error 'context model required'

            c.on(c.CONCEPT_FOCUS, @showItem)

        _ensureModel: (model) ->
            if not (model instanceof c.models.ConceptModel)
                model = @data.concepts.get model
            return model

        showItem: (model) =>
            model = @_ensureModel(model)

            if @currentView and model.id is @currentView.model.id
                return

            options =
                model: model
                context: @data.context

            result = resolveConceptFormOptions(model)

            # Extend options
            options = _.extend(options, result.options)

            # Load external module, catch error if it doesn't exist
            if result.module
                require [result.module], (itemView) =>
                    @createView(itemView, options)
                , (err) =>
                    @showErrorView(model)
                    logger.debug(err)

            else
                @createView(result.view or @itemView, options)

        createView: (itemViewClass, options) =>
            try
                view = new itemViewClass(options)
                @setView(view)
            catch err
                @showErrorView(options.model)
                if c.config.get('debug') then throw err

        showErrorView: (model) ->
            view = new @errorView(model: model)
            @currentView = view
            @main.show(view)

        setView: (view) ->
            @currentView = view
            @main.show(view)

            view.$el.stacked
                fluid: '.fields-region'

        onRender: ->
            @main.show new @regionViews.main


    { ConceptWorkspace }
