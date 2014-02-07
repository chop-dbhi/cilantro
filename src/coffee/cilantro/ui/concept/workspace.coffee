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

            # Check if custom options or a module has been defined for
            # this concept.
            if (customForm = c.config.get("concepts.forms.#{ model.id }"))
                module = customForm.module
                options = _.extend({}, customForm.options, options)

            # Load external module, catch error if it doesn't exist
            if module
                require [module], (CustomForm) =>
                    @createView(CustomForm, options)
                , (err) =>
                    @showErrorView(model)
                    logger.debug(err)
            else
                @createView(@itemView, options)

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
