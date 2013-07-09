define [
    '../core'
    'tpl!templates/context/info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class ContextInfo extends c.Marionette.ItemView
        template: templates.info

        events:
            'click [data-role=view]': 'navigateResults'

        # TODO hide if already on the results page
        navigateResults: (event) ->
            event.preventDefault()
            c.router.navigate('results', trigger: true)


    { ContextInfo }
