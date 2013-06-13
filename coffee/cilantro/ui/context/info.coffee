define [
    '../core'
    'tpl!templates/views/context-info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class ContextInfo extends c.Marionette.ItemView
        template: templates.info

        ui:
            count: '.count'

        events:
            'click [data-role=view]': 'navigateResults'

        modelEvents:
            'change:count': 'renderCount'

        serializeData: ->
            attrs = c._.clone(@model.attributes)
            delete attrs.json
            attrs.count = c.utils.prettyNumber(attrs.count)
            return attrs

        renderCount: (model, value, options) ->
            @ui.count.text(c.utils.prettyNumber(value))

        navigateResults: (event) ->
            event.preventDefault()
            c.router.navigate('results', trigger: true)


    { ContextInfo }
