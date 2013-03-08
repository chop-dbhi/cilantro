define ['../../core'
        '../field'
        '../charts'
        'tpl!templates/views/concept-form.html'
], (c, field, charts, templates...) ->

    templates = c._.object ['form'], templates


    class ManagedContextMapper
        constructor: (@context, @fields) ->

        # For a given field id, return the ContextNode
        # in the ContextTree if it exists
        getNodes: (fieldId) ->
            nodes = @context.getNodes(fieldId)
            if nodes.length == 0
                nodes = new c.models.ContextNodeModel(id:fieldId)
                @context.add(nodes)
            nodes

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
                    context: @manager.getNodes(@model.fields[0].id)

            mainFields = new field.FieldForm(
                model:@model.fields[0]
                context:@manager.getNodes(@model.fields[0].id)
            )

            fields = new c.Marionette.CollectionView
                itemView: field.FieldForm
                itemViewOptions: (model) =>
                   context: @manager.getNodes(model.id)
                collection: new c.Backbone.Collection(@model.fields[ungraphedFieldsStart..])


            @main.show(mainFields)
            @chart.show(mainChart) if mainChart?
            @fields.show(fields)


    { ConceptForm }
