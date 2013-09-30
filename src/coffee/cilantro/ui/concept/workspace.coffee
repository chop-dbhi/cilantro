define [
    'underscore'
    'backbone'
    'marionette'
    '../core'
    '../base'
    '../welcome'
    '../field'
    '../charts'
    './form'
    './info'
    'tpl!templates/concept/workspace.html'
    'tpl!templates/concept/error.html'
], (_, Backbone, Marionette, c, base, welcome, field, charts, form, info, templates...) ->

    templates = _.object ['workspace', 'error'], templates


    class ConceptError extends base.ErrorView
        template: templates.error


    class ConceptWorkspaceHistoryItem extends info.ConceptInfo
        className: 'concept-info'

        events:
            click: 'focus'

        focus: ->
            @publish c.CONCEPT_FOCUS, @model.id


    class ConceptWorkspaceHistory extends Marionette.CollectionView
        className: 'concept-workspace-history'

        itemView: ConceptWorkspaceHistoryItem

        appendHtml: (collectionView, itemView, index) ->
            collectionView.$el.prepend(itemView.el)


    # Some of the class properties here are mimicked after CollectionView
    # since is managing the concept form views
    class ConceptWorkspace extends Marionette.Layout
        className: 'concept-workspace'

        template: templates.workspace

        itemView: form.ConceptForm

        errorView: ConceptError

        ui:
            tabs: '.nav-tabs'
            mainTab: '.nav-tabs [data-name=main]'
            historyTab: '.nav-tabs [data-name=history]'

        regions:
            main: '.main-region'
            history: '.history-region'

        regionViews:
            history: ConceptWorkspaceHistory
            main: welcome.Welcome

        _ensureModel: (model) ->
            if not (model instanceof c.models.ConceptModel)
                model = c.data.concepts.get model
            return model

        initialize: ->
            super

            # Enables overriding the view used when the history is empty
            if @options.emptyView?
                @emptyView = @options.emptyView

            c.on c.CONCEPT_FOCUS, @showItem

        showItem: (model) =>
            @ui.mainTab.tab('show')

            model = @_ensureModel(model)

            if @currentView and model.id is @currentView.model.id
                return

            # Determine if this is registered as a custom concept
            customForm = c.config.get("concepts.forms.#{ model.id }")

            options = model: model

            # Load external module, catch error if it doesn't exist
            if customForm?
                require [customForm.module], (CustomForm) =>
                    options = _.extend {}, customForm.options, options
                    @createView(CustomForm, options)
                , (err) =>
                    @showErrorView(model)
            else
                @createView(@itemView, options)

        createView: (itemViewClass, options) =>
            try
                view = new itemViewClass(options)
                @history.currentView.collection.add(options.model)
                @setView(view)
            catch err
                @showErrorView(options.model)
                if c.config.get('debug') then throw err

        showErrorView: (model) ->
            view = new @errorView(model: model)
            @currentView = view
            @main.show(view)

        setView: (view) ->
            if not @currentView?
                @ui.tabs.fadeIn()

            @currentView = view
            @main.show(view)

            view.$el.stacked
                fluid: '.fields-region'


        onRender: ->
            @main.show new @regionViews.main
            @history.show new @regionViews.history
                collection: new Backbone.Collection


    { ConceptWorkspace }
