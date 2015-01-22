/* global define */

define([
    'underscore',
    'backbone',
    'loglevel',
    '../utils'
], function(_, Backbone, loglevel, utils) {

    // Base model for Cilantro.
    var Model = Backbone.Model.extend({
        constructor: function(attrs, options) {
            options = _.defaults({parse: true}, options);
            this.links = {};

            Backbone.Model.prototype.constructor.call(this, attrs, options);

            // TODO: Should this be limited to listening to those attributes
            // that are in link templates on the collection?
            if (this.collection) {
                this.on('change', function() {
                    // TODO: Common method for this since it's similar to what is
                    // in parse()?
                    if (this.collection) {
                        _.extend(
                            this.links,
                            utils.getLinksFromTemplates(
                                this, this.collection.linkTemplates)
                        );
                    }
                }, this);
            }
        },

        url: function() {
            if (this.isNew()) {
                return Backbone.Model.prototype.url.call(this);
            }

            return this.links.self;
        },

        _parseLinks: function(model, xhr) {
            model.links = utils.getLinks(xhr);
        },

        parse: function(attrs, options) {
            if (this.collection) {
                _.extend(
                    this.links,
                    utils.getLinksFromTemplates(attrs, this.collection.linkTemplates)
                );
            }

            // 2.3.x Backwards compatibility for resources that were not ported
            // to using the Link header.
            if (attrs && attrs._links) {
                _.each(attrs._links, function(link, name) {
                    this.links[name] = link.href;
                }, this);
            }

            return Backbone.Model.prototype.parse.call(this, attrs, options);
        },

        sync: function(method, model, options) {
            var success = options.success,
                _this = this;

            options.success = function(resp, status, xhr) {
                _this._parseLinks(model, xhr);

                if (success) success(resp, status, xhr);
            };

            return Backbone.Model.prototype.sync.call(
                this, method, model, options);
        }
    });

    var StatModel = Model.extend({
        constructor: function(attrs, options) {
            Model.prototype.constructor.call(this, attrs, options);

            this.parent = {};

            if (!(this.parent = attrs.parent)) {
                throw new Error('parent model required');
            }

            this.listenTo(this.parent, 'request', this.onParentRequest);
            this.listenTo(this.parent, 'sync', this.onParentSync);
        },

        onParentRequest: function() {
            // if the parent make a request and we are
            // waiting for a stat response, it will be
            // stale when it arrives
            if (this.xhr) {
                this.xhr.abort();
                this.xhr = null;
            }
        },

        onParentReset: function() {
            this.xhr = this.fetch();
        },

        onParentSync: function() {
            this.xhr = this.fetch();
        },

        url: function() {
            if (!this.parent.id && this.parent.collection) {
                return this.parent.collection.links.self;
            }
            else if (this.parent.links.stats) {
                return this.parent.links.stats;
            }
            else {
                throw new Error('Stat supported model has no stats URL defined.');
            }
        },

        manualFetch: function() {
           this.xhr = this.fetch();
           return this.xhr;
        }
    });

    var StatsSupportedModel = Model.extend({
        statModel: StatModel,

        constructor: function(attrs, options) {
            if (!this.statModel) {
                throw new Error('statModel must be defined');
            }

            this.stats = new this.statModel({parent: this});

            Model.prototype.constructor.call(this, attrs, options);

            if (this.collection) {
                this.stats.listenTo(this.collection, 'reset', this.stats.onParentReset);
            }
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model,

        constructor: function(attrs, options) {
            options = _.defaults({parse: true}, options);
            this.links = {};

            Backbone.Collection.prototype.constructor.call(this, attrs, options);
        },

        _parseLinks: function(collection, xhr) {
            collection.links = utils.getLinks(xhr);
            collection.linkTemplates = utils.getLinkTemplates(xhr);
        },

        sync: function(method, collection, options) {
            var success = options.success,
                _this = this;

            options.success = function(resp, status, xhr) {
                _this._parseLinks(collection, xhr);

                if (success) success(resp, status, xhr);
            };

            return Backbone.Collection.prototype.sync.call(
                this, method, collection, options);
        }
    });

    // Base collection class that is session-aware. A session is always
    // created on initialization which enables immediately binding to the
    // session object, as well transparency when switching between session
    // objects. This is used for Context, View and Query collections.
    var SessionCollection = Collection.extend({
        initialize: function() {
            this.session = this.add({session: true});
        },

        // Prevent deferencing the session.
        reset: function(models, options) {
            options = options || {};
            models = models || [];

            // Search for session model, merge into existing and remove it.
            var model, match;

            for (var i = 0; i < models.length; i++) {
                model = models[i];

                if (model instanceof Backbone.Model) {
                    if (model.get('session') === true) match = model.toJSON();
                } else if (model && model.session === true) {
                    match = model;
                }

                if (match) {
                    this.session.set(match, options);
                    models.splice(i, 1);
                    break;
                }
            }

            models.push(this.session);
            return Collection.prototype.reset.call(this, models, options);
        },

        // Extend `get` to lookup by session if passed. The session model
        // may change over time which is independent of the model id.
        // Furthermore, it guarantees views will have something to bind to
        // prior to it being fetched from the server.
        get: function(attrs) {
            var session = false;

            if (attrs instanceof Backbone.Model) {
                session = attrs.get('session');
            }

            if (attrs === 'session' || (typeof attrs === 'object' && attrs.session)) {
                session = true;
            }

            if (session) return this.findWhere({session: true});

            return Collection.prototype.get.call(this, attrs);
        },

        getSession: function() {
            return this.session;
        }
    });


    return {
        Model: Model,
        StatModel: StatModel,
        StatsSupportedModel: StatsSupportedModel,
        Collection: Collection,
        SessionCollection: SessionCollection
    };

});
