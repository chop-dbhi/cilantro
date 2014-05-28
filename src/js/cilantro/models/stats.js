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

            // Reverse the order of 'min' and 'max'. If changing the order
            // of other stats are required, put them into this array in the
            // order required.
            var order = ['min', 'max'];

            stats.sort(function(a,b) {
                var ai = order.indexOf(a.key),
                    bi = order.indexOf(b.key);

                // If both defined, compare
                if (ai >= 0 && bi >= 0) return ai - bi;
                // Sort lexicographically otherwise
                if (ai < 0 && bi < 0) return a.key > b.key;
                // If one of them defined, promote
                if (ai >= 0) return -1;
                return 1;
            });

            return stats;
        }
    });

    return {
        StatModel: StatModel,
        StatCollection: StatCollection
    };

});
