define [
    '../core'
    'tpl!templates/views/context-actions.html'
], (c, templates...) ->

    templates = c._.object ['actions'], templates


    class ContextActions extends c.Marionette.ItemView
        template: templates.actions

        ui:
            count: '.count'
            state: '[data-role=state]'
            check: '[data-role=state] input'

        events:
            'click [data-role=remove]': 'clickRemoveAll'
            'click [data-role=state]': 'clickStateAll'

        modelEvents:
            'change:count': 'renderCount'
            'root:change:enabled': 'toggleState'

        serializeData: ->
            attrs = c._.clone(@model.attributes)
            delete attrs.json
            attrs.count = c.utils.prettyNumber(attrs.count)
            return attrs

        renderCount: (model, value, options) ->
            @ui.count.text(c.utils.prettyNumber(value))

        clickRemoveAll: ->
            @model.clear()
            c.publish c.CONTEXT_SAVE

        clickStateAll: ->
            if @model.isEnabled() then @model.disable() else @model.enable()
            c.publish c.CONTEXT_SAVE

        disable: ->
            @ui.state.attr('title', 'Enable All Filters')
            @ui.check.prop('checked', false)

        enable: ->
            @ui.state.attr('title', 'Disable All Filters')
            @ui.check.prop('checked', true)

        toggleState: (event) ->
            if @model.isEnabled() then @enable() else @disable()

        onRender: ->
            @toggleState()


    { ContextActions }
