define [
    '../core'
    'tpl!templates/views/context-info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class ContextInfo extends c.Marionette.ItemView
        template: templates.info

        ui:
            toggle: 'button'
            details: '.details'
            count: '.count'

        events:
            'click button': 'toggleDetails'

        modelEvents:
            'change:count': 'renderCount'

        serializeData: ->
            attrs = c._.clone(@model.attributes)
            delete attrs.json
            attrs.count = c.utils.prettyNumber(attrs.count)
            return attrs

        renderCount: (model, value, options) ->
            @ui.count.text(c.utils.prettyNumber(value))

        toggleDetails: (event) ->
            event.preventDefault()
            @ui.details.slideToggle()


    { ContextInfo }
