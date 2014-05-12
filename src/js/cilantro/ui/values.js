/* global define, console */

define([
    'jquery',
    'underscore',
    'marionette',
    './base',
    '../core',
    '../models',
    '../constants'
], function($, _, Marionette, base, c, models, constants) {

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
            'reset': 'clearText'
        },

        ui: {
            textarea: 'textarea'
        },

        clear: function(event) {
            if (event) event.preventDefault();
            this.collection.reset();
        },

        clearText: function() {
            this.ui.textarea.val('');
        },

        initialize: function() {
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
                labels = $.trim(this.ui.textarea.val()).split('\n');

            // We can only make use of the value as label at this point
            // since resolving the label may require an server lookups.
            // This is harmless since _this_ is what the user entered.
            // Also, the only cases where the value and label would
            // differ is either pretty formating (capitalization) or the
            // value is the primary key and the label is some other
            // string (e.g. foreign key, lexicon, object set)
            for (var model, label, i = 0; i < labels.length; i++) {
                // Ignore empty lines
                if (!(label = $.trim(labels[i]))) continue;

                // If the model already exists, use it so it does not
                // reset (and thus revalidate) the attributes.
                if ((model = this.collection.get(label))) {
                    model.set('index', i);
                    models.push(model);
                } else {
                    // 2.3.2 correctly supports validating against the label.
                    // Prior to this, only the value is supported for validation.
                    if (c.isSupported('2.3.2')) {
                        models.push({label: label, index: i});
                    } else {
                        models.push({value: label, index: i});
                        var warn = console.warn || console.log;
                        warn('Serrano 2.3.2+ is required for proper ' +
                             'validation of search values');
                    }
                }
            }

            // We disable sorting when parsing the text because the sorting
            // can change the order of the textarea but not the cursor position.
            // For example, let's say you had 1, 3, 4, 5, 6 in the textarea and
            // you typed 2 and before you could type a 0, the 2 model is added
            // and the order changes so now the cursor is after the 6.
            // Basically, this prevents the text from changing while the user
            // is editing it. The sorting will only happen when items are
            // explicitly added to the collection.
            this.collection.set(models, {sort: false});
        },

        onRender: function() {
            var _this = this;

            this.ui.textarea.on('input propertychange', function() {
                _this._parseText();
            });
        }
    });

    return {
        ValueItem: ValueItem,
        ValueList: ValueList
    };

});
