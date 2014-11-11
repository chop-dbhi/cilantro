/* global define */

define([
    'underscore',
    'backbone',
    '../utils'
], function(_, Backbone, utils) {

    // Base model for Cilantro.
    var Model = Backbone.Model.extend({
        constructor: function(attrs, options) {
            options = _.defaults({parse: true}, options);
            this.links = {};

            Backbone.Model.prototype.constructor.call(this, attrs, options);
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

    var Collection = Backbone.Collection.extend({
        model: Model,

        constructor: function(attrs, options) {
            options = _.defaults({parse: true}, options);
            this.links = {};

            Backbone.Collection.prototype.constructor.call(this, attrs, options);

            this.on('reset', this._updateModelLinks, this);
        },

        _updateModelLinks: function() {
            var templates = this.linkTemplates;

            _.each(this.models, function(model) {
                _.extend(
                    model.links,
                    utils.getLinksFromTemplates(model, templates)
                );
            });
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
        Collection: Collection,
        SessionCollection: SessionCollection
    };

});
