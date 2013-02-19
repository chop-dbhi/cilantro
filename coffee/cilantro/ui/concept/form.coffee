define ['../../core'
        '../field'
        '../charts'
        'tpl!templates/views/concept-form.html'
], (c, field, charts, compiledTemplate) ->

    class ConceptForm extends c.Marionette.Layout
        className: 'concept-form'

        constructor: (model) ->
          super model
          #contextTree = c.data.contexts.getSession()
          #context = contextTree.getNodes(@model.id)

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

          main = new field.FieldForm(model:@model.fields[0])
          fields = new c.Marionette.CollectionView(
              itemView: field.FieldForm
              collection: new c.Backbone.Collection(@model.fields[1..])
          )

          @main.show(main)
          @chart.show(mainChart)
          @fields.show(fields)

        template: compiledTemplate



    class ManagedContextMapper

      constructor: (@contextTree, @fields) ->

      # For a given field id, return the ContextNode
      # in the ContextTree if it exists
      getContextNodeFor: (id) ->
      #for node in @contextTree


    { ConceptForm }








