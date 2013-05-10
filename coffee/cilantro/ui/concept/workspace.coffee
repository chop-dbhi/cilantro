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
        events:
            click: 'focus'

        focus: ->
            @publish c.CONCEPT_FOCUS, @model.id


    class ConceptWorkspaceLog extends c.Marionette.CollectionView
        className: 'concept-workspace-log'

        itemView: ConceptWorkspaceLogItem

        appendHtml: (collectionView, itemView, index) ->
            collectionView.$el.prepend(itemView.el)


    # Some of the class properties here are mimicked after CollectionView
    # since is managing the concept form views
    class ConceptWorkspace extends c.Marionette.Layout
        className: 'concept-workspace'

        template: templates.workspace

        itemView: form.ConceptForm

        ui:
            tabs: '.nav-tabs'
            mainTab: '.nav-tabs [data-name=main]'
            logTab: '.nav-tabs [data-name=log]'

        regions:
            log: '.log'
            main: '.main'

        regionViews:
            log: ConceptWorkspaceLog
            main: ConceptWorkspaceStart

        _ensureModel: (model) ->
            if not (model instanceof c.models.ConceptModel)
                model = c.data.concepts.get model
            return model

        initialize: ->
            super

            # Enables overriding the view used when the history is empty
            if @options.emptyView?
                @emptyView = @options.emptyView

            @subscribe c.CONCEPT_FOCUS, @showItem
            @itemsViews = {}

        showItem: (model) =>
            @ui.mainTab.tab('show')

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

            options = model: model

            if customForm?
                require [customForm.module], (CustomForm) =>
                    options = c._.extend {}, customForm.options, options
                    @createView(CustomForm, options)
            else
                    @createView(@itemView, options)

        createView: (itemViewClass, options) =>
            view = new itemViewClass(options)

            @itemsViews[options.model.id] = view
            @log.currentView.collection.add(options.model)

            @setCurrentView(view)

        setCurrentView: (view) ->
            if not @currentView?
                @ui.tabs.fadeIn()
            @currentView = view
            @main.show(view)

        onRender: ->
            @main.show new @regionViews.main
            @log.show new @regionViews.log
                collection: new c.Backbone.Collection


    { ConceptWorkspace }
