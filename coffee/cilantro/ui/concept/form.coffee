define ['../../core'
        '../field'
        '../charts'
        'tpl!templates/views/concept-form.html'
], (c, field, charts, compiledTemplate) ->

    class ManagedContextMapper
        constructor: (@context, @fields) ->

        # For a given field id, return the ContextNode
        # in the ContextTree if it exists
        getNodes: (fieldId) ->
            @context.getNodes(fieldId)

    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

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
            if @model.fields[0].get('_links').distribution?
                ungraphedFieldsStart = 1
                mainChart = new charts.FieldDistributionChart(
                  parentView: @
                  editable: false
                  model: @model.fields[0]
                  data:
                    context: null
                )

            mainFields = new field.FieldForm(model:@model.fields[0])

            fields = new c.Marionette.CollectionView(
                itemView: field.FieldForm
                itemViewOptions: (model) =>
                   context: @manager.getNodes(model.id)
                collection: new c.Backbone.Collection(@model.fields[ungraphedFieldsStart..])
            )

            @main.show(mainFields)
            @chart.show(mainChart) if mainChart?
            @fields.show(fields)

        template: compiledTemplate

    { ConceptForm }













