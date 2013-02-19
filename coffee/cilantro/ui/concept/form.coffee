define ['../../core'
        '../field'
        '../charts'
        'tpl!templates/views/concept-form.html'
], (c, field, charts, compiledTemplate) ->

    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        constructor: (model) ->
          super model
          @context = c.data.contexts.getSession()
          @manager = new ManagedContextMapper(@context, @model.fields)


        regions:
          main:".main"
          chart:".chart"
          fields:".fields"

        onRender: ->
          mainChart = new charts.FieldDistributionChart(
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
              collection: new c.Backbone.Collection(@model.fields[1..])
          )

          @main.show(mainFields)
          @chart.show(mainChart)
          @fields.show(fields)

        template: compiledTemplate



    class ManagedContextMapper

      constructor: (@context, @fields) ->

      # For a given field id, return the ContextNode
      # in the ContextTree if it exists
      getNodes: (fieldId) ->
          @context.getNodes(fieldId)


    { ConceptForm }








