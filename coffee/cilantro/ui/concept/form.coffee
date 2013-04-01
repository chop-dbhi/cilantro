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

        options:
            showChart: true
            chartField: null

        constructor: (model) ->
            super model
            @manager = new ConceptContextManager(@model)
            # Base the context off the current session
            @manager.setContext(c.data.contexts.getSession())

        regions:
            main: '.concept-main'
            chart: '.concept-chart'
            fields: '.concept-fields'

        onRender: ->
            conceptFields = @model.fields[..]

            # Optionally render the chart if a distribution is available
            if @options.showChart
                idx = 0

                if (chartField = @options.chartField)?
                    # Get the index of the field and ensure it exists for this
                    # concept
                    if (idx = conceptFields.indexOf(chartField)) is -1
                        throw new Error('Field not associated with concept')

                    # Throw an error for an explicitly defined field if it
                    # does not support distributions
                    if not chartField.urls.distribution?
                        throw new Error('Field does not support distributions')

                if chartField or (chartField = @model.fields[idx]).urls.distribution?
                    # Remove from remaining concept fields
                    conceptFields = conceptFields.pop(idx)

                    context = @manager.getFieldContext(chartField.id)

                    # TODO this could display it's own chart.. so there would
                    # be no need to construct a separate chart here.
                    mainFieldForm = new field.FieldForm
                        showChart: false
                        model: chartField
                        context: context

                    fieldChart = new charts.FieldChart
                        parentView: @
                        model: chartField
                        context: context

                    @main.show(mainFieldForm)
                    @chart.show(fieldChart)


            fieldForms = new c.Marionette.CollectionView
                itemView: field.FieldForm

                itemViewOptions: (model) =>
                   showChart: false
                   context: @manager.getFieldContext(model.id)

                # New collection for locally managing the fields..
                collection: new c.Backbone.Collection(conceptFields)

            @fields.show(fieldForms)



    { ConceptForm }
