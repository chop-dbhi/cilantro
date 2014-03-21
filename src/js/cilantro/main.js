/* global require */

/*
 * The 'main' script for bootstrapping the default Cilantro client.
 * Projects can use this directly or emulate the functionality in their
 * own script.
 */

require({
    config: {
        tpl: {
            variable: 'data'
        }
    }
}, ['jquery', 'cilantro'], function($, c) {

    // Default session options
    var options = {
        url: c.config.get('url'),
        credentials: c.config.get('credentials')
    };

    // Open the default session when Cilantro is ready
    c.ready(function() {

        // Open the default session defined in the pre-defined configuration.
        // Initialize routes once data is confirmed to be available
        c.sessions.open(options).then(function() {

            // Panels are defined in their own namespace since they shared
            // across workflows
            c.panels = {
                concept: new c.ui.ConceptPanel({
                    collection: this.data.concepts
                }),

                context: new c.ui.ContextPanel({
                    model: this.data.contexts.session
                })
            };

            // Render and append panels in the designated main element
            // prior to starting the session and loading the initial workflow
            c.panels.concept.render();
            c.panels.context.render();

            $(c.config.get('main')).append(c.panels.concept.el, c.panels.context.el);

            c.workflows = {
                query: new c.ui.QueryWorkflow({
                    context: this.data.contexts.session,
                    concepts: this.data.concepts.queryable
                }),

                results: new c.ui.ResultsWorkflow({
                    view: this.data.views.session,
                    context: this.data.contexts.session,
                    concepts: this.data.concepts.viewable,
                    // The differences in these names are noted
                    results: this.data.preview,
                    exporters: this.data.exporter,
                    queries: this.data.queries
                })
            };

            // Define routes
            var routes = [{
                id: 'query',
                route: 'query/',
                view: c.workflows.query
            }, {
                id: 'results',
                route: 'results/',
                view: c.workflows.results
            }];

            // Workspace supported as of 2.1.0
            if (c.isSupported('2.1.0')) {
                c.workflows.workspace = new c.ui.WorkspaceWorkflow({
                    queries: this.data.queries,
                    context: this.data.contexts.session,
                    view: this.data.views.session,
                    public_queries: this.data.public_queries
                });

                routes.push({
                    id: 'workspace',
                    route: 'workspace/',
                    view: c.workflows.workspace
                });
            }

            // Query URLs supported as of 2.2.0
            if (c.isSupported('2.2.0')) {
                c.workflows.queryload = new c.ui.QueryLoader({
                    queries: this.data.queries,
                    context: this.data.contexts.session,
                    view: this.data.views.session
                });

                routes.push({
                    id: 'query-load',
                    route: 'results/:query_id/',
                    view: c.workflows.queryload
                });
            }

            // Register routes and start the session
            this.start(routes);
        });

    });

});
