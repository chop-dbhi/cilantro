define [
    '../core'
    'tpl!templates/views/concept-info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class ConceptInfo extends c.Marionette.ItemView
        className: 'concept-info'

        template: templates.info

        serializeData: ->
            data = @model.toJSON()
            if not data.description and @model.fields.length
                data.description = @model.fields.at(0).description
            return data


    { ConceptInfo }
