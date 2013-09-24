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

        ui:
            count: '.count'

        events:
            'click [data-role=remove]': 'clickRemoveAll'

        modelEvents:
            'change:count': 'renderCount'

        serializeData: ->
            attrs = {}
            if @model?
                attrs = _.clone(@model.attributes)
                delete attrs.json
                attrs.count = c.utils.prettyNumber(attrs.count)
            return attrs

        renderCount: (model, value, options) ->
            @ui.count.html(c.utils.prettyNumber(value))

        clickRemoveAll: ->
            @model.manager.clear()


    { ContextActions }
