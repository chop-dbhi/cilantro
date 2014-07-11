/* global define */

define([
    'underscore',
    'marionette'
], function(_, Marionette) {

    // Represents a list of possible fields for use with a distrubution chart.
    var FieldAxis = Marionette.ItemView.extend({
        tagName: 'select',

        options: {
            enumerableOnly: false
        },

        initialize: function() {
            _.bindAll(this, 'render');

            this.collection.when(this.render);
        },

        render: function() {
            this.$el.append('<option value=>---</option>');

            var model;
            for (var i = 0; i < this.collection.models.length; i++) {
                model = this.collection.models[i];

                // No good way to represent large string-based data yet.
                if (model.get('searchable')) continue;

                if (this.options.enumerableOnly && !model.get('enumerable')) continue;

                this.$el.append('<option value="' + model.id + '">' +
                                model.get('name') + '</option>');
            }

            return this.$el;
        },

        getSelected: function() {
            return this.collection.get(parseInt(this.$el.val()));
        }
    });

    return {
        FieldAxis: FieldAxis
    };
});
