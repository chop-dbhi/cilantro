define [
    'underscore'
    'marionette'
    'tpl!templates/field/info.html'
], (_, Marionette, templates...) ->

    templates = _.object ['info'], templates


    class FieldInfo extends Marionette.ItemView
        className: 'field-info'

        template: templates.info


    { FieldInfo }
