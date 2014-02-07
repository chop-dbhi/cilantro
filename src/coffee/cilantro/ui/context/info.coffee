define [
    'underscore'
    'marionette'
    '../core'
], (_, Marionette, c) ->

    class ContextInfo extends Marionette.ItemView
        template: 'context/info'

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
