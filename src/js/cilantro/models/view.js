/* global define */

define([
    'underscore',
    'backbone',
    '../core',
    './base'
], function(_, Backbone, c, base) {

    var Facet = Backbone.Model.extend({
        idAttribute: 'concept'
    });

    var Facets = Backbone.Collection.extend({
        model: Facet
    });

    var ViewModel = base.Model.extend({
        constructor: function() {
            this.facets = new Facets();

            // HACK: Convert columns in facets with the specific sets of
            // models. This is until the facets API is supported on the server.
            this.on('change:json', function(model, value) {
                return this.jsonToFacets(value);
            });

            base.Model.prototype.constructor.apply(this, arguments);
        },

        initialize: function() {
            var _this = this;

            this.on('request', function() {
                return c.trigger(c.VIEW_SYNCING, this);
            });

            this.on('sync', function(model, attrs, options) {
                if (!options) options = {};

                if (options.silent !== true) {
                    return c.trigger(c.VIEW_SYNCED, this, 'success');
                }
            });

            this.on('error', function() {
                return c.trigger(c.VIEW_SYNCED, this, 'error');
            });

            this.on('change', function() {
                return c.trigger(c.VIEW_CHANGED, this);
            });

            return c.on(c.VIEW_SAVE, function(id) {
                if (_this.id === id || !id && _this.isSession()) {
                    return _this.save();
                }
            });
        },

        isSession: function() {
            return this.get('session');
        },

        isArchived: function() {
            return this.get('archived');
        },

        toJSON: function() {
            var attrs = base.Model.prototype.toJSON.apply(this, arguments);
            attrs.json = this.facetsToJSON();
            return attrs;
        },

        parse: function(attrs) {
            base.Model.prototype.parse.apply(this, arguments);
            this.jsonToFacets(attrs.json);
            return attrs;
        },

        jsonToFacets: function(json) {
            if (!json) json = {};

            // Implies this is an array of object, set directly. This is for
            // forwards compatibility.
            if (_.isArray(json)) {
                this.facets.reset(json);
                return;
            }

            var attrs, id, order;
            var models = [];
            var columns = json.columns || [];
            var ordering = json.ordering || [];

            for (var i = 0; i < columns.length; i++) {
                id = columns[i];
                attrs = {
                    concept: id
                };

                for (var j = 0; j < ordering.length; j++) {
                    order = ordering[j];

                    if (id === order[0]) {
                        attrs.sort = order[1];
                        attrs.sort_index = j;       // jshint ignore:line
                    }
                }

                models.push(attrs);
            }

            return this.facets.reset(models);
        },

        facetsToJSON: function() {
            var json = {
                ordering: [],
                columns: []
            };

            this.facets.each(function(model) {
                var direction, index, sort;

                json.columns.push(model.get('concept'));

                if ((direction = model.get('sort'))) {
                    index = model.get('sort_index');
                    sort = [model.get('concept'), direction];
                    return json.ordering.splice(index, 0, sort);
                }
            });

            return json;
        }
    });

    var ViewCollection = base.SessionCollection.extend({
        model: ViewModel
    });

    return {
        ViewModel: ViewModel,
        ViewCollection: ViewCollection
    };

});
