/* global define */

define([
    'underscore',
    'backbone',
    'loglevel',
    '../core',
    './base',
    './filters'
], function(_, Backbone, loglevel, c, base, filters) {

    var getRequiredFilters = function() {
        var lookups = [];

        _.each(c.config.get('filters.required'), function(lookup)  {
            lookups.push(lookup);
        });

        var concepts = c.config.get('query.concepts.required');

        if (concepts) {
            loglevel.warn('The "query.concepts.required" option is ' +
                             'deprecated, use "filters.required" instead ' +
                             'with fully qualified lookups.');

            _.each(concepts, function(concept)  {
                lookups.push({concept: concept});
            });
        }

        return lookups;
    };

    /*
     * The context model provides an interface for [un]applying filters. Filters
     * are uniquely identified by field, concept, or both.
     */
    var Context = base.Model.extend({

        options: {
            saveDelay: 300
        },

        initialize: function(attrs, options) {
            attrs = attrs || {};

            this.requiredFilters = getRequiredFilters();

            // Internal collection of all filters
            this._filters = new filters.Filters(attrs.json,
                _.defaults({parse: true}, options));

            // Public collection of filters that are applied
            this.filters = new filters.Filters(attrs.json,
                _.defaults({parse: true}, options));

            // Proxy events from individual nodes as they are altered
            this.listenTo(this._filters, {
                'apply': this.apply,
                'unapply': this.unapply
            });

            this.listenTo(this.filters, {
                'unapply': this.unapply,
                'change:enabled': function() {
                    this._save();
                }
            });

            // Watch for changes to the JSON attribute, update filters.
            // On a reset, the internal filters are also set to reflect the state
            // of the filters. Note, the below order is required so the internal
            // filters can be compared with the updated "public" filters.
            this.on('change:json', function(model, value, options) {
                this.filters.set(value, _.defaults({parse: true}, options));

                if (options.reset) {
                    this._filters.set(value, _.defaults({
                        parse: true,
                        remove: false
                    }, options));
                }

                // Add the `required` attribute to filters marked as such
                this.filters.each(function(model) {
                    if (this.isFilterRequired(model.attributes)) {
                        model.set('required', true);
                    }
                    else {
                        model.unset('required');
                    }
                }, this);
            });

            // Trigger Cilantro event when context is saved
            this.on('sync', function(model, attrs, options) {
                options = options || {};

                // Validate the context on sync
                this.validate();

                if (options.silent !== true) {
                    c.trigger(c.CONTEXT_SYNCED, this, 'success');
                }
            });

            // Define a debounced save method for handling rapid successions
            // of [un]apply events.
            this._save = _.debounce(this.save, this.options.saveDelay);
        },

        validate: function() {
            var invalid = [];

            _.each(this.requiredFilters, function(lookup) {
                var reason, model = this.filters.findWhere(lookup);

                if (!model) {
                    reason = 'undefined';
                } else if (!model.isEnabled()) {
                    reason = 'disabled';
                }

                if (reason) {
                    invalid.push(_.extend({reason: reason}, lookup));
                }
            }, this);

            if (invalid.length) {
                c.trigger(c.CONTEXT_INVALID, invalid);
                return 'One or more filters are invalid';
            }
        },

        // Only compare values for keys defined on the lookup
        isFilterRequired: function(attrs) {
            return _.any(this.requiredFilters, function(lookup) {
                return _.isEqual(_.pick(attrs, _.keys(lookup)), lookup);
            });
        },

        _apply: function(filter, options) {
            // Ensure only attributes are being added to prevent references
            var attrs = filter.toJSON({id: true});
            // Filters are enabled by default. If a filter is previously disabled
            // and re-applied, it will be enabled.
            attrs.enabled = true;
            attrs.required = this.isFilterRequired(attrs);
            delete attrs.language;

            // Add/merge public filter
            var model = this.filters.add(attrs, _.defaults({merge: true}, options));

            // Trigger the applied event on the internal filter
            var internal = this._filters.get(model);
            internal.trigger('applied', internal, options);

            // Prevent redundant handlers from firing.
            model.stopListening(this);

            // Emulate request/sync events by piggy-backing the context save.
            model.listenToOnce(this, 'request', function(context, xhr, options) {
                this.trigger('request', this, xhr, options);
            });

            model.listenToOnce(this, 'sync', function(context, response, options) {
                this.trigger('sync', this, this.toJSON(), options);
            });
        },

        // Takes one or more filters and applies it by adding/updating it in the
        // public filters collection.
        apply: function(filters, options) {
            if (filters instanceof Backbone.Collection) {
                filters = filters.slice();
            }
            else if (!_.isArray(filters)) {
                filters = [filters];
            }

            // Apply the filters
            _.each(filters, function(filter) {
                this._apply(filter, options);
            }, this);

            // This can be useful for applying multiple filters and doing a
            // batch save of them. Since the handlers above are bound, all the
            // filters that are unsynced will fire their events.
            if (options && options.save === false) return;

            this._save();
        },

        _unapply: function(filter, options) {
            // Ensure only attributes are being added to prevent references
            var attrs = filter.toJSON({id: true});

            if (this.isFilterRequired(attrs)) {
                loglevel.debug('skipping unapplying required filter', attrs);
                return;
            }

            var model = this.filters.remove(attrs, options);

            // Filter does not exist, exit early
            if (!model) return;

            // Ensure we trigger on the reference filter
            var internal = this._filters.get(model);
            internal.trigger('unapplied', internal, options);

            // Unbind handles from the apply method in case the events have not
            // fired yet.
            model.stopListening(this);
        },

        unapply: function(filters, options) {
            if (filters instanceof Backbone.Collection) {
                filters = filters.slice();
            }
            else if (!_.isArray(filters)) {
                filters = [filters];
            }

            // Apply the filters
            _.each(filters, function(filter) {
                this._unapply(filter, options);
            }, this);

            if (options && options.save === false) return;

            this._save();
        },

        // Gets or creates a filter based on the bare attributes. The
        // id is derived from the attributes and used to look up the instance
        // in the internal filters.
        define: function(attrs) {
            var id = this._filters.model.prototype.generateId(attrs),
                model = this._filters.get(id);

            if (!model) model = this._filters.create(attrs);

            return model;
        },

        // Sets the `json` attribute based on the contents of the filters
        toJSON: function() {
            var attrs = base.Model.prototype.toJSON.call(this),
                filters = this.filters.toJSON();

            if (filters.length) {
                attrs.json = {
                    type: 'and',
                    children: filters
                };
            }
            else {
                attrs.json = null;
            }

            return attrs;
        },

        isSession: function() {
            return this.get('session');
        },

        isArchived: function() {
            return this.get('archived');
        },

        isFilterApplied: function(model) {
            return this.filters.get(model) !== undefined;
        },

        // Compares the values of the internal and applied filters for the
        // specified set of keys.
        hasFilterChanged: function(model, keys) {
            var current = this.filters.get(model);
            if (!current) return;

            if (!keys) keys = _.keys(model.attributes);

            return _.any(keys, function(key) {
                return !_.isEqual(model.get(key), current.get(key));
            });
        }
    });


    var ContextCollection = base.SessionCollection.extend({
        model: Context
    });


    return {
        Context: Context,
        ContextCollection: ContextCollection
    };

});
