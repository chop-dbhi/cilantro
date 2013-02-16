define [
    '../core'
    'tpl!templates/views/field.html'
], (c, templates...) ->

    # Create an object of templates by name..
    templates = c._.object ['item'], templates


    class Field extends c.Marionette.ItemView
        className: 'field'

        template: templates.item

        toggleFocus: (id) =>
            @$el.toggleClass('active', (id is @model.id))


    # Down here since constants don't play nice with object keys..
    Field::subscribers = {}
    Field::subscribers[c.FIELD_FOCUS] = 'toggleFocus'

    { Field }
