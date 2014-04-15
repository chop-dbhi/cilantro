/* global define */

define([
    './base'
], function(base) {


    var Query = base.Model.extend({
        parse: function(attrs, options) {
            if (attrs && !attrs.shared_users) {  // jshint ignore:line
                attrs.shared_users = [];  // jshint ignore:line
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
