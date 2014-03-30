/* global define, require */

/*
Router requirements:
- Shared "main" area
    - Workflows (pages) are hidden rather than closed


var router = new Backbone.Router({

    // Standard routes map
    routes: {
        'workspace/': 'workspace',
        'query/': 'query',
        'results/:query_id/': 'query',
        'results/': 'results'
    },

    // Map handler name to the route name which enables registering
    // multiple handlers per route.
    handlers: {
        'workspace': 'workspace',
        'query': 'query',
        'loadQuery': 'query',
        'results': 'results'
    }
});

// Dispatch to all handlers that are listening
router.on('route:workspace', function() {

});

*/


define([
    'backbone',
    'underscore',
    'loglevel'
], function(Backbone, _, loglevel) {


    // Multi-handler router that
    var Router = Backbone.Router.extend({
        options: {
            main: 'body',
            root: null
        },

        initialize: function(options) {
            this.options = _.extend({}, _.result(this, 'options'), options);

            // Array of named views that are currently loaded based on the
            // current route. TODO not needed?
            this._loaded = [];

            // Map of paths to an array of named views registered for that path
            this._routes = {};

            // Map of internal handlers per path that handles unloading the previous
            // routes and loading the ones that match the path
            this._handlers = {};

            // Map of registered views by name/id
            this._registered = {};

            _.bindAll(this, '_unloadAll', '_loadAll', '_unload', '_load', '_render');
        },

        // Unload all views that are currently loaded
        _unloadAll: function() {
            var args = [].slice.call(arguments);

            _.each(this._loaded.slice(), function(id) {
                this._unload.apply(this, [this._registered[id], false].concat(args));
            }, this);
        },

        // Load all views registered the route
        _loadAll: function(route) {
            var ids = this._routes[route];
            if (!ids) return;

            var args = [].slice.call(arguments, 1);

            _.each(ids, function(id) {
                this._load.apply(this, [this._registered[id]].concat(args));
            }, this);
        },

        _unload: function(route, force) {
            if (force === undefined) force = true;

            var index = this._loaded.indexOf(route.id);

            if (route.route || (force && index >= 0)) {
                this._loaded.splice(index, 1);

                if (route._view) {
                    route._view.$el.hide();

                    var args = [].slice.call(arguments, 2);

                    route._view.trigger.apply(route._view, [
                        'router:unload',
                        this,
                        Backbone.history.fragment
                    ].concat(args));
                }
            }
        },

        _load: function(options) {
            var args = [].slice.call(arguments, 1);

            // If the view has not be loaded before, check if it's a
            // module string and load asynchronously
            if (!options._view) {
                if (_.isString(options.view)) {
                    var _this = this;

                    require([options.view], function(View) {
                        options._view = new View(options.options);
                        _this._render.apply(_this, [options].concat(args));
                        _this._loaded.push(options.id);
                    }, function(err) {
                        loglevel.error(err);
                    });
                    return;
                }

                options._view = options.view;
            }

            this._render.apply(this, [options].concat(args));
            this._loaded.push(options.id);
        },

        _render: function(options) {
            var args = [].slice.call(arguments, 1);

            var view = options._view;

            if (!view._rendered) {
                view._rendered = true;

                if (options.el !== false) {
                    var target;

                    if (options.el) {
                        target = Backbone.$(options.el, this.options.main);
                    }
                    else {
                        target = Backbone.$(this.options.main);
                    }

                    target.append(view.el);
                    view.render();
                }
            }

            view.$el.show();
            view.trigger.apply(view, [
                'router:load',
                this,
                Backbone.history.fragment
            ].concat(args));
        },

        _register: function(options) {
            if (this._registered[options.id]) {
                throw new Error('Route "' + options.id + '" already registered');
            }

            // Clone since the options options will be augmented
            options = _.clone(options);

            // Non-routable view.. immediately load and only once
            if (!options.route) {
                this._load(options);
            }
            else if (!this._handlers[options.route]) {
                this._routes[options.route] = [];

                var handler = _.bind(function() {
                    var args = [].slice.call(arguments);
                    this._unloadAll.apply(this, args);
                    this._loadAll.apply(this, [options.route].concat(args));
                }, this);

                this._handlers[options.route] = handler;
                this.route(options.route, options.id, handler);
            }

            if (options.route) this._routes[options.route].push(options.id);

            this._registered[options.id] = options;
        },

        // Returns a route config by id
        get: function(id) {
            return this._registered[id];
        },

        // Returns true if the route config is registered with this router and
        // is navigable.
        isNavigable: function(id) {
            var config = this.get(id);
            return config && config.navigable !== false;
        },

        // Checks if the current fragment or id is currently routed
        isCurrent: function(fragment) {
            if (fragment === Backbone.history.fragment) return true;

            var ids = this._routes[Backbone.history.fragment] || [];

            return _.any(ids, function(id) {
                return fragment === id;
            });
        },

        // Returns true if the supplied route is in the list of routes known
        // to this router and false if it isn't known to this router.
        hasRoute: function(route) {
            return this._routes.hasOwnProperty(route);
        },

        // Attempt to get the corresponding config if one exists and use
        // the route specified on the config. This provides a means of
        // aliasing a name/key to a particular route.
        navigate: function(fragment, options) {
            if (this.isNavigable(fragment)) {
                fragment = this.get(fragment).route;
            }

            return Backbone.Router.prototype.navigate.call(this, fragment, options);
        },

        // Register one or more routes
        register: function(routes) {
            if (!routes) return;
            if (!_.isArray(routes)) routes = [routes];

            _.each(routes, function(options) {
                if (options.view) this._register(options);
            }, this);
        },

        // Unregister a route by id or all registered routes
        unregister: function(id) {
            if (id === undefined) {
                _.each(this._registered, function(value, id) {
                    this.unregister(id);
                }, this);

                return;
            }

            var options = this._registered[id];

            if (!options) throw new Error('No route registered by id "' + id + '"');

            this._unload(options);
            delete this._registered[id];

            var routes = this._routes[options.route];

            if (routes && routes.indexOf(id) >= 0) {
                this._routes[options.route].splice(routes.indexOf(id), 1);
            }
        },

        // Shortcut for starting the Backbone.history
        start: function(options) {
            if (Backbone.History.started) return;

            var root = this.options.root || '/';

            if (root.charAt(root.length - 1) !== '/') root = root + '/';

            options = _.extend({root: root, pushState: true}, options);

            return Backbone.history.start(options);
        }
    });


    return {
        Router: Router
    };


});
