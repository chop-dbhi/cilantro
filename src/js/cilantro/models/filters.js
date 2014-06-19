/* global define */


define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var generateId = function(attrs) {
        var id = '';
        if (attrs.concept) id += 'c' + attrs.concept;
        if (attrs.field) id += 'f' + attrs.field;
        if (!id) throw new Error('Cannot generate id for filter');
        return id;
    };

    // A filter encapsulates a single context node. The attributes must be tagged
    // with an identifier, either a `concept` id, `field` id or both.
    var Filter = Backbone.Model.extend({
        constructor: function(attrs, options) {
            if (attrs && !attrs.id) {
                attrs[this.idAttribute] = generateId(attrs);
            }
            Backbone.Model.prototype.constructor.call(this, attrs, options);
        },

        // This coincides with a possible feature in Backbone 1.1.3 that enables
        // dynamically generating ids rather than relying on a static id as defined
        // by idAttribute
        generateId: function(attrs) {
            return generateId(attrs);
        },

        clear: function(options) {
            var attrs = _.clone(this.attributes);

            // Do not unset required fields
            delete attrs.id;
            delete attrs.field;
            delete attrs.concept;

            // Void out the value for each key being unset otherwise
            // the change will not be recorded in Backbone
            _.each(attrs, function(value, key) {
                attrs[key] = undefined;
            });

            this.set(attrs, _.defaults({unset: true}, options));
        },

        // No syncing, i.e. no request, sync, error
        sync: function() {},

        apply: function(options) {
            this.trigger('apply', this, options);
        },

        unapply: function(options) {
            this.trigger('unapply', this, options);
        },

        // Performs a deep copy to prevent any shared referenced in nested
        // structures. Remove the id attribute by default
        toJSON: function(options) {
            options = _.defaults(options || {}, {id: false});
            var attrs = $.extend(true, {}, this.attributes);
            if (!options.id) delete attrs[this.idAttribute];
            return attrs;
        },

        // Convenience method for checking if the filter is enabled. If the
        // attribute is not set, this also implies it is enabled.
        isEnabled: function() {
            return this.get('enabled') !== false;
        },

        // Toggles if the filter is enabled/disabled
        toggleEnabled: function() {
            this.set('enabled', !this.isEnabled());
        }
    });


    // Collection of "filters" which correspond to an arbitrarily complex context node
    var Filters = Backbone.Collection.extend({
        model: Filter,

        constructor: function(models, options) {
            options = _.defaults({parse: true}, options);
            Backbone.Collection.prototype.constructor.call(this, models, options);
        },

        sync: function() {},

        apply: function(options) {
            this.trigger('apply', this, options);
        },

        unapply: function(options) {
            this.trigger('unapply', this, options);
        },

        // Handles both a normal array of model attributes and a context tree.
        // IDs are generated at this stage so attrs/models can be properly merged
        // into the existing collection.
        parse: function(models) {
            if (_.isArray(models)) {
                _.each(models, function(attrs) {
                    if (!attrs.id) {
                        attrs.id = this.model.prototype.generateId(attrs);
                    }
                });
            } else {
                var attrs = models || {};

                models = [];

                if (attrs.field) {
                    var id = this.model.prototype.generateId(attrs);
                    models.push(_.extend({id: id}, attrs));
                }

                // Bare branch or standalone concept; traverse children.
                // Note: concept-level filters are not yet supported, so they
                // need to be deconstructed to their containing fields. The
                // will be augmented on the child if present.
                else if (attrs.children) {
                    var concept = attrs.concept;

                    _.each(attrs.children, function(child) {
                        if (concept !== undefined) {
                            child = _.extend({concept: concept}, child);
                        }
                        models = models.concat(this.parse(child));
                    }, this);
                }
            }

            return models;
        }
    });


    return {
        Filter: Filter,
        Filters: Filters,
    };

});
