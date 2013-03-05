define ['../../core'
        '../field'
        '../charts'
        './item'
        'tpl!templates/views/concept-form.html'
        'tpl!templates/views/concept-form-history.html'
        'tpl!templates/views/concept-form-start.html'
], (c, field, charts, item, templates...) ->

    templates = c._.object ['form', 'history', 'start'], templates


    class ManagedContextMapper
        constructor: (@context, @fields) ->

        # For a given field id, return the ContextNode
        # in the ContextTree if it exists
        getNodes: (fieldId) ->
            @context.getNodes(fieldId)


    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        template: templates.form

        constructor: (model) ->
            super model
            @context = c.data.contexts.getSession()
            @manager = new ManagedContextMapper(@context, @model.fields)

        regions:
            main:".main"
            chart:".primary-chart"
            fields:".fields"

        onRender: ->
            ungraphedFieldsStart = 0
            if @model.fields[0].urls.distribution?
                ungraphedFieldsStart = 1
                mainChart = new charts.FieldDistributionChart
                  parentView: @
                  editable: false
                  model: @model.fields[0]
                  data:
                    context: null

            mainFields = new field.FieldForm(model:@model.fields[0])

            fields = new c.Marionette.CollectionView
                itemView: field.FieldForm
                itemViewOptions: (model) =>
                   context: @manager.getNodes(model.id)
                collection: new c.Backbone.Collection(@model.fields[ungraphedFieldsStart..])


            @main.show(mainFields)
            @chart.show(mainChart) if mainChart?
            @fields.show(fields)


    class ConceptHistoryStart extends c.Marionette.ItemView
        template: templates.start


    class ConceptHistoryItem extends item.Concept
        tagName: 'li'

        events:
            click: 'focus'

        focus: ->
            @publish c.CONCEPT_FOCUS, @model.id


    # Some of the class properties here are mimicked after CollectionView
    # since this is effectively managing items
    class ConceptFormHistory extends c.Marionette.Layout
        className: 'concept-form-history'

        template: templates.history

        itemView: ConceptHistoryItem

        emptyView: ConceptHistoryStart

        ui:
            history: '.history'

        regions:
            main: '.main'

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
            if not (view = @itemsViews[model.id])?
                view = new ConceptForm
                    model: model

                @itemsViews[model.id] = view
                @renderHistoryItem model

            @currentView = view
            @main.show view

        renderHistoryItem: (model) =>
            view = new @itemView
                model: model

            view.render()
            @ui.history.prepend view.el

        onRender: ->
            @main.show new @emptyView


    { ConceptForm, ConceptFormHistory }
