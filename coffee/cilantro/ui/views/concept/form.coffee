define ['../../core'
        '../controls'
        'tpl!templates/views/conceptform.html'
], (c, controls, compiledTemplate) ->

    class ConceptForm extends c.Marionette.ItemView
        className: 'concept-form'

        constructor: (@name) ->
          super name
          contextTree = c.data.contexts.getSession()
          context = contextTree.getNodes(@model.id)

        onRender: ->
          fields = for field in @model.fields
             new controls.FieldControl({model:field})

          console.log(fields)

        template: compiledTemplate


    { ConceptForm }
