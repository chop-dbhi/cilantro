define ['../../core'
        '../field'
        '../charts'
        '../empty'
        './form'
        './item'
        'tpl!templates/views/concept-workspace.html'
        'tpl!templates/views/concept-workspace-start.html'
        'tpl!templates/views/concept-workspace-log.html'
], (c, field, charts, empty, form, item, templates...) ->

    templates = c._.object ['workspace', 'start', 'log'], templates


    class ConceptWorkspaceStart extends empty.EmptyView
        template: templates.start


    class ConceptWorkspaceLogItem extends item.Concept
        tagName: 'li'

        events:
            click: 'focus'

        focus: ->
            @publish c.CONCEPT_FOCUS, @model.id


    class ConceptWorkspaceLog extends c.Backbone.View
        tagName: 'ul'
        className: 'concept-workspace-log'

        itemView: ConceptWorkspaceLogItem

        add: (model) ->
            view = new @itemView
                model: model

            view.render()
            @$el.prepend view.el


    # Some of the class properties here are mimicked after CollectionView
    # since is managing the concept form views
    class ConceptWorkspace extends c.Marionette.Layout
        className: 'concept-workspace'

        template: templates.workspace

        emptyView: ConceptWorkspaceStart

        logView: ConceptWorkspaceLog

        regions:
            main: '.main'
            log: '.log'

        _ensureModel: (model) ->
            if not (model instanceof c.models.ConceptModel)
                model = c.data.concepts.get model
            return model

        initialize: ->
            super

            # Enables overriding the view used when the history is empty
            if @options.emptyView?
                @emptyView = @options.emptyView

            @subscribe c.CONCEPT_FOCUS, @renderItem
            @itemsViews = {}

        renderItem: (model) =>
            model = @_ensureModel(model)

            if @currentView and model.id is @currentView.model.id
                return

            # Initialize a ConceptForm view if not already present.
            # And the corresponding history item
            if (view = @itemsViews[model.id])?
                @setCurrentView(view)
                return

            # Determine if this is registered as a custom concept
            customForm = c.getOption("concepts.forms.#{ model.id }")
            if customForm?
                require [customForm.module], (CustomForm) =>
                    options = customForm.options or {}
                    options.model = model
                    @createView(CustomForm, options)
            else
                    @createView(form.ConceptForm, model: model)

        createView: (ConceptForm, options) =>
            view = new ConceptForm(options)

            @itemsViews[options.model.id] = view
            @log.currentView.add(options.model)

            @setCurrentView(view)

        setCurrentView: (view) ->
            @currentView = view
            @main.show(view)

        onRender: ->
            @main.show new @emptyView
            @log.show new @logView


    { ConceptWorkspace }
