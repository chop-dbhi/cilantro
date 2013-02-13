define ['../../core'
        'tpl!templates/views/conceptform.html'
], (c, compiledTemplate) ->

    class ConceptForm extends c.Marionette.ItemView
        className: 'concept-form'

        template: compiledTemplate


    { ConceptForm }
