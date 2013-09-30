###
The 'main' script for bootstrapping the default Cilantro client. Projects can
use this directly or emulate the functionality in their own script.
###

require ['cilantro'], (c) ->

    # Session options
    options =
        url: c.config.get('url')
        credentials: c.config.get('credentials')

    # Open the default session defined in the pre-defined configuration.
    # Initialize routes once data is confirmed to be available
    c.sessions.open(options).then ->

        # Define routes
        routes = [
            id: 'query'
            route: 'query/'
            view: new c.ui.QueryWorkflow
                context: @data.contexts.getSession()
                concepts: @data.concepts.queryable
        ,
            id: 'results'
            route: 'results/'
            view: new c.ui.ResultsWorkflow
                view: @data.views.session
                context: @data.contexts.session
                concepts: @data.concepts.viewable
                # The differences in these names are noted
                results: @data.preview
                exporters: @data.exporter
                queries: @data.queries
        ]

        # Workspace supported as of 2.1.0
        if c.isSupported('2.1.0')
            routes.push
                id: 'workspace'
                route: 'workspace/'
                view: c.ui.WorkspaceWorkflow
                    queries: @data.queries

        # Register routes and start the session
        @start(routes)
