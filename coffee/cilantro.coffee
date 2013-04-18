define [
    './cilantro/core'
    './cilantro/models'
], (c, models) ->

    c.models = models

    # TODO move this logic into a workflow..
    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        
    if c.getOption('autoload') then c.openSession()

    # Register pre-define routes
    if (routes = c.getOption('routes'))?
        c.router.register(routes)

    # Catch and process all click events to anchors to see if any routes
    # match the path. If a route matches, prevent the default behavior
    if c.getOption('autoroute')
        $(document).on 'click', 'a', (event) ->
            pathname = @pathname

            # Handle IE quirk
            if pathname.charAt(0) isnt '/'
                pathname = "/#{ pathname }"

            if Backbone.history.navigate(pathname, trigger: true)
                event.preventDefault()

            return

    return (@cilantro = c)
