define [
    '../core'
    './field/controls'
], (c) ->

    # Contained within the ConceptForm containing views for a single FieldModel
    class FieldContainer extends c.Marionette.ItemView
        className: 'field-container'


    class FieldStats extends c.Marionette.ItemView
        className: 'field-stats'


    class FieldControl extends c.Marionette.ItemView
        className: 'field-control'


    { FieldContainer, FieldStats, FieldControl }
