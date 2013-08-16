define [
    '../core'
    'tpl!templates/context/info.html'
], (c, templates...) ->

    templates = c._.object ['info'], templates


    class ContextInfo extends c.Marionette.ItemView
        template: templates.info

        ui:
            query: '[data-route=query]'
            results: '[data-route=results]'

        initialize: ->
            # Toggle buttons when the route changes
            c.router.on 'route', @toggleButtons

        # Toggles the buttons relative to the current route. This is a shared
        # view across routes, thus it must be *aware* of which is the current
        # route.
        toggleButtons: =>
            @ui.query.toggle(c.router.isCurrent('results'))
            @ui.results.toggle(c.router.isCurrent('query'))

        onRender: ->
            @toggleButtons()


    { ContextInfo }
