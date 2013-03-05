define [
    '../core'
    'tpl!templates/views/concept.html'
], (c, templates...) ->

    # Create an object of templates by name..
    templates = c._.object ['item'], templates


    class Concept extends c.Marionette.ItemView
        className: 'concept'

        template: templates.item

        serializeData: ->
            data = @model.toJSON()
            if not data.description
                data.description = data.fields[0].description
            return data


    { Concept }
