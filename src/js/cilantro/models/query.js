/* global define */

define([
    './base',
    '../core',
    './context',
    './view'
], function(base, c, context, view) {

    var QueryStats = base.Model.extend({});

    var Query = base.StatsSupportedModel.extend({
        statModel: QueryStats,

        constructor: function(attrs, options) {
            attrs = attrs || {};

            // Use this.model.context.attributes.json to retrive query filters as
            // of this change.
            this.context = new context.Context({json: attrs.context_json}); // jshint ignore:line
            this.view = new view.ViewModel({json: attrs.view_json}); // jshint ignore:line

            base.Model.prototype.constructor.call(this, attrs, options);
        },

        parse: function(attrs, options) {
            if (attrs) {
                if (attrs && !attrs.shared_users) {  // jshint ignore:line
                    attrs.shared_users = [];  // jshint ignore:line
                }

                this.context.set({json: attrs.context_json}); // jshint ignore:line
                this.view.set({json: attrs.view_json}); // jshint ignore:line
            }

            return base.Model.prototype.parse.call(this, attrs, options);
        }
    });


    var Queries = base.Collection.extend({
        model: Query
    });


    return {
        Query: Query,
        Queries: Queries
    };

});
