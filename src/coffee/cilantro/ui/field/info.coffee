define [
    'underscore'
    'marionette'
], (_, Marionette) ->

    class FieldInfo extends Marionette.ItemView
        className: 'field-info'

        template: 'field/info'


    { FieldInfo }
