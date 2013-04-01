define [
    '../../core'
    '../field'
    '../charts'
    'tpl!templates/views/concept-form.html'
], (c, field, charts, templates...) ->

    templates = c._.object ['form'], templates


    class ConceptContextManager
        constructor: (model, options={}) ->
            @model = model
            @options = options

        setContext: (context) ->
            # Attempt to fetch the concept-level node (should be a branch unless
            # this is an unmanaged view)
            if not (@context = context.fetch(concept: @model.id))
                # Create a branch-style node to put all field-level nodes inside,
                # mark it with the concept_id so it can be found later
                @context = new c.models.BranchNodeModel
                    concept: @model.id
                    type: 'and'
                    children: []

                # Add to parent context
                context.add @context
            return

        getFieldContext: (id) ->
            if not (node = @context.fetch(field: id))
                # Create a branch-style node to put all field-level nodes inside,
                # mark it with the concept_id so it can be found later
                node = new c.models.BranchNodeModel
                    field: id
                    concept: @model.id
                    type: 'and'
                    children: []

                # Add to parent context
                @context.add node

            return node


    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        template: templates.form

        constructor: (model) ->
            super model
            @manager = new ConceptContextManager(@model)
            # Base the context off the current session
            @manager.setContext(c.data.contexts.getSession())

        events:
            'click .concept-actions [data-toggle=add]': 'save'
            'click .concept-actions [data-toggle=update]': 'save'
            'click .concept-actions [data-toggle=remove]': 'clear'

        ui:
            actions: '.concept-actions'
            add: '.concept-actions [data-toggle=add]'
            remove: '.concept-actions [data-toggle=remove]'
            update: '.concept-actions [data-toggle=update]'

        regions:
            main: '.concept-main'
            chart: '.concept-chart'
            fields: '.concept-fields'

        onRender: ->
            ungraphedFieldsStart = 0
            mainField = @model.fields[0]

            # Ensure the contexts being set here are the same between mainField
            # and mainForm
            if mainField.urls.distribution?
                ungraphedFieldsStart = 1
                mainChart = new charts.FieldChart
                    parentView: @
                    model: mainField
                    data:
                        context: @manager.getFieldContext(mainField.id)

            mainForm = new field.FieldForm
                model: mainField
                context: @manager.getFieldContext(mainField.id)
                showChart: false

            fields = new c.Marionette.CollectionView
                itemView: field.FieldForm

                itemViewOptions: (model) =>
                   showChart: false
                   context: @manager.getFieldContext(model.id)

                collection: new c.Backbone.Collection(@model.fields[ungraphedFieldsStart..])


            @main.show(mainForm)
            @chart.show(mainChart) if mainChart?
            @fields.show(fields)

        # Saves the current state of the context which enables it to be
        # synced with the server.
        save: ->
            @manager.context.save()
            @ui.add.hide()
            @ui.update.show()
            @ui.remove.show()

        # Clears the local context of conditions
        clear: ->
            @manager.context.clear()
            @manager.context.save()
            @ui.add.show()
            @ui.update.hide()
            @ui.remove.hide()


    { ConceptForm }
