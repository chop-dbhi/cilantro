define [
    'underscore'
    'marionette'
    '../core'
], (_, Marionette, c) ->

    # Provides a set of actions for manipulating a ContextModel object
    class ContextActions extends Marionette.ItemView
        template: 'context/actions'

        events:
            'click [data-role=remove]': 'clickRemoveAll'

        modelEvents:
            'change': 'render'

        serializeData: ->
            attrs = _.clone(@model.attributes)
            attrs.pretty_count = c.utils.prettyNumber(attrs.count)
            return attrs

        clickRemoveAll: ->
            @model.manager.clear()

    { ContextActions }
