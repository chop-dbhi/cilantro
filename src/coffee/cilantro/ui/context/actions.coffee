define [
    'underscore'
    'marionette'
    '../core'
    'tpl!templates/context/actions.html'
], (_, Marionette, c, templates...) ->

    templates = _.object ['actions'], templates


    # Provides a set of actions for manipulating a ContextModel object
    class ContextActions extends Marionette.ItemView
        template: templates.actions

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
