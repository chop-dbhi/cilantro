/* global define, require */

define([
    'jquery',
    'underscore',
    'backbone',
    './models',
    './utils',
    './router',
    './core'
], function($, _, Backbone, models, utils, router, c) {

    var events = {
        SESSION_OPENING: 'session:opening',
        SESSION_ERROR: 'session:error',
        SESSION_UNAUTHORIZED: 'session:unauthorized',
        SESSION_OPENED: 'session:opened',
        SESSION_CLOSED: 'session:closed'
    };


    // Mapping of Serrano resource links to corresponding collections or models.
    var collectionLinkMap = {
        concepts: models.Concepts,
        fields: models.FieldCollection,
        contexts: models.ContextCollection,
        views: models.ViewCollection,
        preview: models.Results,
        exporter: models.ExporterCollection,
        queries: models.Queries,
        public_queries: models.Queries,  // jshint ignore:line
        stats: models.Stats
    };


    /*
    A session opens a connection with a Serrano-compatible API endpoint and
    uses the response to drive the application state. All the necessary data,
    views, router and other state that is specific to a particular endpoint
    is stored here. The lifecycle of a session involves:

        - validating the options
        - requesting the root endpoint of API (with optional authentication)
        - initializing the collections supported by the API
        - fetching the collection data in the background
        - initializing a router and registering top-level routes and views
    */
    var Session = models.Model.extend({
        idAttribute: 'url',

        options: function() {
            return c.config.get('session.defaults');
        },

        initialize: function(attrs, options) {
            this.options = _.extend({}, _.result(this, 'options'), options);

            this.opened = false;
            this.started = false;
            this.opening = false;

            this.state = {};

            _.bindAll(this, 'ping', 'startPing', 'stopPing');
        },

        // Ensure a url is defined when the session is initialized
        // or updated (using set). See http://backbonejs.org///Model-validate
        // for details.
        validate: function(attrs) {
            if (!attrs || !attrs.url) return 'url is required';
        },

        startPing: function() {
            // Only if the ping endpoint is available and has a non-falsy ping
            // interval.
            if (this.links.ping && this.options.ping && !this._ping) {
                this.ping();
                this._ping = setInterval(this.ping, this.options.ping);
            }
        },

        stopPing: function() {
            clearTimeout(this._ping);
            delete this._ping;
        },

        ping: function() {
            var _this = this;

            Backbone.ajax({
                type: 'GET',
                url: this.links.ping,
                dataType: 'json',
                success: function(resp) {
                    if (resp.status === 'timeout') {
                        _this.stopPing();
                        _this.timeout(resp.location);
                    }
                },

                error: function(xhr, status, error) {
                    _this.stopPing();

                    // Handle redirect
                    if (error === 'FOUND') {
                        _this.timeout(xhr.getResponseHeader('Location'));
                    }
                }
            });
        },

        timeout: function(loc) {
            var message;

            if (loc) {
                message = 'Your session timed out. Please ' +
                          '<a href="' + loc + '">refresh the page</a>.';
            } else {
                message = 'Your session timed out. Please refresh the page.';
            }

            c.notify({
                header: 'Session Timeout',
                message: message,
                dismissable: false,
                timeout: false,
                level: 'warning'
            });

            // Auto-refresh after some time.
            setTimeout(function() {
                if (loc) {
                    window.location = loc;
                }
                else {
                    // `true` argument forces a fetch from the server rather
                    // than using local cache.
                    window.location.reload(true);
                }
            }, 5000);
        },

        _parseLinks: function(model, xhr) {
            models.Model.prototype._parseLinks.call(this, model, xhr);

            var Collection;

            // Iterate over the available resource links and initialize
            // the corresponding collection with the URL.
            this.data = {};

            _.each(model.links, function(url, name) {
                if ((Collection = collectionLinkMap[name])) {
                    this.data[name] = new Collection();
                    this.data[name].url = url;
                    this.data[name].fetch({reset: true});
                }
            }, this);
        },

        parse: function(attrs) {
            attrs = attrs || {};

            // Title of the API.
            this.title = attrs.title;

            // Version of the API.
            this.version = attrs.version;

            // Define router with the main element and app root based on
            // the global configuration.
            this.router = new router.Router({
                main: c.config.get('main'),
                root: c.config.get('root')
            });

            // Register pre-defined routes.
            var routes = this.get('routes');

            if (routes) {
                // String indicates external module, load and register.
                if (typeof routes === 'string') {
                    var _this = this;

                    require([routes], function(routes) {
                        _this.router.register(routes);
                    });
                } else {
                    if (typeof routes === 'function') {
                        routes = routes();
                    }

                    this.router.register(routes);
                }
            }

            return attrs;
        },

        // Opens a session. This sends a request to the target URL which is
        // assumed to be the root resource of a Serrano-compatible API. If
        // credentials are supplied, the request will be a POST with the
        // credentials supplied as JSON. A successful response will _ready_
        // the session for use.
        open: function() {
            // Session already opened or opening, return a promise.
            if (this.opened || this.opening) return this._opening.promise();

            // Ensure the session is valid before opening.
            if (!this.isValid()) throw new Error(this.validationError);

            // Set state and create deferred that will be used for creating
            // promises while the session is opening and after it is opened
            // to maintain a consistent interface.
            this.opening = true;
            this._opening = $.Deferred();

            var options = {
                url: this.get('url'),
                type: 'GET',
                dataType: 'json'
            };

            // If credentials switch to POST and add the credentials.
            var credentials = this.get('credentials');

            if (credentials) {
                $.extend(options, {
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(credentials)
                });
            }

            var _this = this;

            this.fetch(options)
                .always(function() {
                    _this.opening = false;
                })
                .done(function(resp, status, xhr) {
                    _this.opened = true;
                    _this._opening.resolveWith(_this, [_this, resp, status, xhr]);
                })
                .fail(function(xhr, status, error) {
                    _this.error = error;
                    _this._opening.rejectWith(_this, [this, xhr, status, error]);
                });

            return this._opening.promise();
        },

        // Closing a session will remove the cached data and require it to be
        // opened again.
        close: function() {
            this.end();
            this.opening = this.opened = false;

            // Reset all session data to deference models.
            _.each(this.data, function(item) {
                // Can't guarantee that all the session data elements are
                // collections so check for reset before calling it to avoid
                // calling reset on models.
                if (item.reset) {
                    item.reset();
                }
                else {
                    item.clear();
                }

                delete item.url;
            });

            delete this._opening;
            delete this.data;
        },

        // Starts/enables the session.
        start: function(routes, options) {
            // Already started, return false denoting the start was not
            // successful.
            if (this.started) return false;

            if (!this.opened) throw new Error('Session must be opened before loaded');

            this.started = true;

            if (routes) this.router.register(routes);

            // Start the router history.
            this.router.start(options);
            this.startPing();

            // When the page loses focus, stop pinging, resume when visibility
            // is regained.
            this.listenTo(c, {
                visible: this.startPing,
                hidden: this.stopPing,
                focus: this.startPing,
                blur: this.stopPing
            });

            // Only show the unsupported warning when debug mode is enabled
            // as this message is confusing to general users and is meant more
            // for developers.
            if (c.config.get('debug') && !c.isSupported(c.getSerranoVersion())) {
                c.notify({
                    header: 'Serrano Version Unsupported',
                    level: 'warning',
                    timeout: false,
                    message: 'You are connecting to an unsupported version of ' +
                             'Serrano. Some functionality may be broken or missing ' +
                             'due to compatibility issues.'
                });
            }
        },

        // Ends/disables the session.
        end: function() {
            this.started = false;
            this.stopPing();
            this.stopListening(c, 'visible hidden');
            this.router.unregister();
        }
    });


    // Keeps track of sessions as they are created and switched between.
    // The `pending` property references any session that is currently loading
    // and will be made the active once finished. The `active` property
    // references the currently active session if one exists.
    var SessionManager = Backbone.Collection.extend({
        _switch: function(session) {
            if (this.active === session) return;
            delete this.pending;

            // End the current active session.
            this.close();

            // Set session as active and start it.
            this.active = session;
            this.trigger(events.SESSION_OPENED, session);
        },

        // Opens a session. Takes an object of options that are passed into
        // the session constructor. The url can be passed by itself as the
        // first argument as a shorthand method for opening sessions.
        open: function(url, options) {
            if (typeof url === 'object') {
                options = url;
            } else {
                options = options || {};
                options.url = url;
            }

            // Get or create the session.
            var session = this.get(options.url);

            if (!session) {
                session = new Session(options);
                this.add(session);
            }

            // Ensure redundant calls are not being made.
            if (session !== this.active && session !== this.pending) {
                this.pending = session;
                this.trigger(events.SESSION_OPENING, session);
            }

            // Open returns a deferred object. If the opened session is *still*
            // the pending session, activate it. This could not be true if the
            // client quickly switches between available sessions and the first
            // session has not yet responded.
            var _this = this;

            return session.open()
                .done(function() {
                    if (_this.pending !== session) return;
                    _this._switch(session);
                })
                .fail(function(_session, xhr, status, error) {
                    if (_this.pending !== session) return;

                    _this.pending = null;

                    // Select to the appropriate channel to publish on depending
                    // if it's a forbidden, unauthorized, or general error.
                    var event;

                    if (xhr.statusCode === 401 || xhr.statusCode === 403) {
                        event = events.SESSION_UNAUTHORIZED;
                    } else {
                        event = events.SESSION_ERROR;
                    }

                    _this.trigger(event, session, error);
                });
        },

        // Closes the current sessions and publishes a message.
        close: function() {
            if (this.active) {
                var session = this.active;
                delete this.active;
                this.remove(session);
                session.close();
                this.trigger(events.SESSION_CLOSED, session);
            }
        },

        // Closes the current session and clears all sessions.
        clear: function() {
            this.close();
            this.reset();
        }
    });


    return _.extend({
        SessionManager: SessionManager,
        Session: Session,
        events: events
    });


});
