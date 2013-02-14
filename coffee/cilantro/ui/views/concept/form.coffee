define ['../../core'
        '../controls'
        'tpl!templates/views/conceptform.html'
], (c, controls, compiledTemplate) ->

    class ConceptForm extends c.Marionette.ItemView
        className: 'concept-form'

        constructor: (@name) ->
          super name

        onRender: ->
          fields = for field in @model.attributes.fields
            f = new controls.FieldControl({model:field})

          console.log(fields)

        template: compiledTemplate


    { ConceptForm }
