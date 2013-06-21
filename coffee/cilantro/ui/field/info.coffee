define [
    '../core'
    'tpl!templates/field/info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class FieldInfo extends c.Marionette.ItemView
        className: 'field-info'

        template: templates.info


    { FieldInfo }
