/* global define */

define([
    'jquery',
    'underscore',
    'marionette',
    'loglevel',
    './base',
    '../core',
    '../models',
    '../constants'
], function($, _, Marionette, loglevel, base, c, models, constants) {

    var ValueItem = Marionette.ItemView.extend({
        className: 'value-item',

        template: 'values/item'
    });


    // Interface for representing a user-defined/selected list of values
    // in a textarea (one per line). In majority of cases, values
    // correspond to the labels, but in certain cases, the underlying
    // values are surrogate identifiers. In this case the values rendered
    // in the textarea will be the labels.
    // This expects a collection such as cilantro/models/value#Values
    var ValueList = Marionette.ItemView.extend({
        className: 'value-list',

        template: 'values/list',

        // Listen for collection events to update the textarea to match
        // the values
        collectionEvents: {
            'add': 'reloadText',
            'remove': 'reloadText',
            'reset': 'reloadText'
        },

        ui: {
            textarea: 'textarea'
        },

        initialize: function() {
            _.bindAll(this, 'parseText', 'reloadText');

            this._parseText = _.debounce(this.parseText, constants.INPUT_DELAY);
        },

        // Load labels in textarea
        reloadText: function() {
            this.ui.textarea.val(this.collection.pluck('label').join('\n'));
        },

        // Split by line, create a new set of models and update the collection
        // based on the value
        parseText: function() {
            var models = [],
                labels = this.ui.textarea.val().split('\n');

            // We can only make use of the value as label at this point
            // since resolving the label may require an server lookups.
            // This is harmless since _this_ is what the user entered.
            // Also, the only cases where the value and label would
            // differ is either pretty formatting (capitalization) or the
            // value is the primary key and the label is some other
            // string (e.g. foreign key, lexicon, object set)
            _.each(labels, function(label) {
                label = $.trim(label);

                // Ignore empty lines
                if (!label) return;

                // If the model already exists, use it so revalidation does not
                // have to occur
                var model = this.collection.get(label);

                if (!model) {
                    // 2.3.2 correctly supports validating against the label.
                    // Prior to this, only the value is supported for validation.
                    if (c.isSupported('2.3.2')) {
                        model = {label: label};
                    }
                    else {
                        model = {value: label};
                        loglevel.warn('Serrano 2.3.2+ is required for proper ' +
                             'validation of search values');
                    }
                }

                models.push(model);
            }, this);

            this.collection.reset(models);
        },

        onRender: function() {
            this.ui.textarea.on('input propertychange', this._parseText);
        }
    });

    return {
        ValueItem: ValueItem,
        ValueList: ValueList
    };

});
