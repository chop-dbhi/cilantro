/* global define */

define([
    'underscore',
    'backbone',
    '../core',
    './base',
    './field'
], function(_, Backbone, c, base, field) {


    var Concept = base.Model.extend({
        constructor: function() {
            this.fields = new field.FieldCollection();
            base.Model.prototype.constructor.apply(this, arguments);
        },

        initialize: function() {
            base.Model.prototype.initialize.call(this, arguments);

            // Fetch the field data the first time a concept receives focus
            c.on(c.CONCEPT_FOCUS, function(id) {
                if (this.id !== id) return;

                if (this.fields.length === 0) {
                    this.fields.fetch({reset: true});
                }
            }, this);
        },

        parse: function(resp, options) {
            base.Model.prototype.parse.call(this, resp, options);

            var _this = this;

            // Set the endpoint for related fields
            this.fields.url = function() {
                return _this.links.fields;
            };

            // Should only be falsy on a PUT request
            if (!resp) return;

            // Response has the fields data embedded
            if (resp.fields) {
                this.fields.set(resp.fields, options);
                delete resp.fields;
            }

            return resp;
        }
    });


    var BaseConcepts = base.Collection.extend({
        model: Concept,

        // Perform a remote search on this collection
        search: function(query, handler) {
            return Backbone.ajax({
                url: _.result(this, 'url'),
                data: {
                    query: query,
                    brief: 1
                },
                dataType: 'json',
                success: function(resp) {
                    handler(resp);
                }
            });
        }
    });


    var Concepts = BaseConcepts.extend({
        constructor: function() {
            this.queryable = new BaseConcepts();
            this.viewable = new BaseConcepts();

            var _this = this;

            this.queryable.url = function() {
                return _.result(_this, 'url');
            };

            this.viewable.url = function() {
                return _.result(_this, 'url');
            };

            BaseConcepts.prototype.constructor.apply(this, arguments);
        },

        initialize: function() {
            // Update the sub-collections with the specific sets of models
            this.on('add remove reset', function() {
                this.queryable.reset(this.filter(function(model) {
                    return !!model.get('queryable') || !!model.get('queryview');
                }));

                this.viewable.reset(this.filter(function(model) {
                    return !!model.get('viewable') || !!model.get('formatter_name');
                }));
            });
        }
    });


    return {
        Concept: Concept,
        Concepts: Concepts
    };

});
