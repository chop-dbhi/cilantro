/* global define */

define([
    'underscore',
    'backbone',
    '../core',
    './base',
    './field'
], function(_, Backbone, c, base, field) {

    var embedConceptFields = function(fields) {
        return _.map(fields, function(cf) {
            // Get the bare field and add the concept field data.
            // TODO this appears backwards..
            var f = c.data.fields.findWhere({id: cf.pk});

            f.set({
                'alt_name': cf.alt_name,     // jshint ignore:line
                'alt_plural_name': cf.alt_plural_name    // jshint ignore:line
            });

            return f;
        });
    };


    var Concept = base.Model.extend({
        constructor: function() {
            this.fields = new field.FieldCollection();
            base.Model.prototype.constructor.apply(this, arguments);
        },

        parse: function(resp, options) {
            base.Model.prototype.parse.call(this, resp, options);

            // Should only be falsy on a PUT request.
            if (!resp) return;

            // Response has the IDs of the fields for this concept. We need to
            // retrieve the fields from the local list based on the IDs in
            // the response.
            if (resp.fields) {
                var fields = resp.fields;

                if (c.data.fields.length) {
                    fields = embedConceptFields(fields);
                    this.fields.set(fields, options);
                }
                else {
                    this.listenToOnce(c.data.fields, 'sync', function() {
                        fields = embedConceptFields(fields);
                        this.fields.set(fields, options);
                    });
                }

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
                    return !!model.get('queryable');
                }));

                this.viewable.reset(this.filter(function(model) {
                    return !!model.get('viewable');
                }));
            });
        }
    });


    return {
        Concept: Concept,
        Concepts: Concepts
    };

});
