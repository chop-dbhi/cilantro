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

        events:
            'click [data-role=view]': 'navigateResults'
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
            @ui.state
                .attr('title', 'Enable All')
                .find('i')
                    .addClass('icon-circle-blank')
                    .removeClass('icon-circle')

        enable: ->
            @ui.state
                .attr('title', 'Disable All')
                .find('i')
                    .addClass('icon-circle')
                    .removeClass('icon-circle-blank')

        toggleState: (event) ->
            if @model.isEnabled() then @enable() else @disable()

        onRender: ->
            @toggleState()

        navigateResults: (event) ->
            event.preventDefault()
            c.router.navigate('results', trigger: true)



    { ContextActions }
