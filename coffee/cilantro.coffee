define [
    './cilantro/core'
    './cilantro/changelog'
    './cilantro/models'
    './cilantro/structs'
], (c, changelog, models, structs) ->

    c.changelog = changelog
    c.models = models
    c.structs = structs

    c.data =
        concepts: new models.ConceptCollection
        fields: new models.FieldCollection
        contexts: new models.ContextCollection
        views: new models.ViewCollection
        results: new models.Results
        exporters: new models.ExporterCollection

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

            # Ensure the pathname does not include the root
            root = Backbone.history.root or '/'
            if pathname.slice(0, root.length) is root
                pathname = pathname.slice(root.length)

            # Attempt to navigate to the path. If successful, the
            # default behavior is canceled
            if Backbone.history.navigate(pathname, trigger: true)
                event.preventDefault()

            return

    return (@cilantro = c)
