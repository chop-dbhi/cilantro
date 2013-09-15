define [
    'underscore'
    'marionette'
    'tpl!templates/concept/info.html'
], (_, Marionette, templates...) ->

    templates = _.object ['info'], templates


    class ConceptInfo extends Marionette.ItemView
        className: 'concept-info'

        template: templates.info

        # Shorthand references to primary UI elements. After the view has been
        # rendered, they can be accessed as is, e.g. `@ui.name` which will be
        # the jQuery object
        ui:
            name: '.name'
            category: '.category'
            description: '.description'

        # If the concept does not have it's own description, use the first
        # associated field. However, this currently does not handle the case
        # when the fields have not been loaded yet.
        serializeData: ->
            data = @model.toJSON()
            if not data.description and @model.fields.length
                data.description = @model.fields.at(0).description
            return data


    { ConceptInfo }
