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
          main:"#main"
          fields:"#fields"

        onRender: ->
          mainChart = new charts.FieldDistributionChart(
            editable: false
            model: @model.fields[0]
            data:
              context: null
          )

          debugger
          mainChart.render()
          @main.show(mainChart)

        template: compiledTemplate

        fieldForms: ->
          for item in @model.fields
            new field.FieldForm({model:item})

    { ConceptForm }
