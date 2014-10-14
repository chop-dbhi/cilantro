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
    },
    shim: {
        bootstrap: ['jquery'],
        marionette: {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        highcharts: {
            deps: ['jquery'],
            exports: 'Highcharts'
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
                    collection: this.data.concepts.queryable
                }),

                context: new c.ui.ContextPanel({
                    model: this.data.contexts.session
                })
            };

            c.dialogs = {
                exporter: new c.ui.ExporterDialog({
                    // TODO rename data.exporter on session
                    exporters: this.data.exporter
                }),

                columns: new c.ui.ConceptColumnsDialog({
                    view: this.data.views.session,
                    concepts: this.data.concepts.viewable
                }),

                query: new c.ui.EditQueryDialog({
                    view: this.data.views.session,
                    context: this.data.contexts.session,
                    collection: this.data.queries
                }),

                deleteQuery: new c.ui.DeleteQueryDialog()
            };

            var elements = [];

            // Render and append panels in the designated main element
            // prior to starting the session and loading the initial workflow
            // Render and append element for insertion
            $.each(c.panels, function(key, view) {
                view.render();
                elements.push(view.el);
            });

            $.each(c.dialogs, function(key, view) {
                view.render();
                elements.push(view.el);
            });

            // Set the initial HTML with all the global views
            var main = $(c.config.get('main'));
            main.append.apply(main, elements);

            c.workflows = {
                query: new c.ui.QueryWorkflow({
                    context: this.data.contexts.session,
                    concepts: this.data.concepts.queryable
                }),

                results: new c.ui.ResultsWorkflow({
                    view: this.data.views.session,
                    // The differences in these names are noted
                    results: this.data.preview
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
                    public_queries: this.data.public_queries,  // jshint ignore:line
                    stats: this.data.stats
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
