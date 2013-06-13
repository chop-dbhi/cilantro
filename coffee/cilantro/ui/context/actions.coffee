define [
    '../core'
    'tpl!templates/views/context-actions.html'
], (c, templates...) ->

    templates = c._.object ['actions'], templates


    class ContextActions extends c.Marionette.ItemView
        template: templates.actions

        initialize: ->
            @$el.html(@template())

        ui:
            state: '[data-role=state]'
            check: '[data-role=state] input'

        events:
            'click [data-role=remove]': 'clickRemoveAll'
            'click [data-role=state]': 'clickStateAll'

        modelEvents:
            'change:enabled': 'toggleState'

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
