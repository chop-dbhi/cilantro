/* global define */

define([
    'backbone'
], function(Backbone) {

    var StatModel = Backbone.Model.extend({
        idAttribute: 'key'
    });

    var StatCollection = Backbone.Collection.extend({
        model: StatModel,

        parse: function(attrs) {
            var stats = [];

            var key, value;
            for (key in attrs) {
                value = attrs[key];

                if (key.charAt(0) === '_') {
                    continue;
                }

                stats.push({
                    key: key,
                    value: value
                });
            }

            return stats;
        }
    });

    return {
        StatModel: StatModel,
        StatCollection: StatCollection
    };

});
