/* global define */

define([
    'underscore',
    'backbone',
    'marionette'
], function(_, Backbone, Marionette) {

    var ButtonSelectEmptyOption = Marionette.ItemView.extend({
        className: 'disabled',

        tagName: 'li',

        template: 'button/select-option',

        events: {
            'click': 'prevent'
        },

        prevent: function(event) {
            if (event) {
                event.preventDefault();
            }
        },

        serializeData: function() {
            return {
                label: 'No options are available'
            };
        }
    });

    var ButtonSelectOption = Marionette.CompositeView.extend({
        tagName: 'li',

        template: 'button/select-option',

        events: {
            'click': 'select'
        },

        serializeData: function() {
            return {
                label: this.model.get('label') || this.model.get('value')
            };
        },

        select: function(event) {
            if (event) {
                event.preventDefault();
            }

            return this.model.set('selected', true);
        }
    });

    var ButtonSelect = Marionette.CompositeView.extend({
        className: 'btn-group btn-select',

        template: 'button/select',

        itemView: ButtonSelectOption,

        itemViewContainer: '.dropdown-menu',

        emptyView: ButtonSelectEmptyOption,

        options: {
            placeholder: '----'
        },

        ui: {
            toggle: '.dropdown-toggle',
            menu: '.dropdown-menu',
            selection: '.dropdown-selection'
        },

        collectionEvents: {
            'change:selected': 'updateSelection'
        },

        constructor: function(options) {
            if (!options) options = {};

            var choices = options.collection;

            if (!(choices instanceof Backbone.Collection)) {
                // Convert from flat list of values into objects
                if (choices && typeof choices[0] !== 'object') {
                    choices = _.map(choices, function(choice) {
                        return {
                            value: choice,
                            label: choice
                        };
                    });
                }

                options.collection = new Backbone.Collection(choices);
            }

            Marionette.CompositeView.prototype.constructor.call(this, options);
        },

        setSelection: function(value) {
            var model = this.collection.findWhere({value: value});

            if (model) {
                return model.set('selected', true);
            }
        },

        getSelection: function() {
            var model = this.collection.findWhere({selected: true});

            if (model) {
                return model.get('value');
            }
        },

        updateSelection: function(model, selected, options) {
            if (!selected) return;

            var value = model.get('value');

            // Disable all other selected models.
            this.collection.each(function(_model) {
                if (_model !== model) {
                    return _model.set('selected', false, {silent: true});
                }
            });

            this.ui.selection.html(model.get('label') || value);

            // Trigger DOM event
            this.$el.trigger('change', value);

            // Trigger view event
            this.trigger('change', model, value, options);
        },

        onRender: function() {
            if (/^(small|large|mini)$/.test(this.options.size)) {
                this.ui.toggle.addClass('btn-' + this.options.size);
            }

            this.ui.toggle.dropdown();

            var model = this.collection.findWhere({selected: true});
            if (model) {
                this.updateSelection(model, true);
            }
            else {
                this.ui.selection.html(this.options.placeholder);
            }
        }
    });

    return {
        ButtonSelectEmptyOption: ButtonSelectEmptyOption,
        ButtonSelectOption: ButtonSelectOption,
        ButtonSelect: ButtonSelect
    };

});
