/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../../core',
    './base'
], function(_, Backbone, Marionette, c, base) {

    var SelectionListItem = Marionette.ItemView.extend({
        template: function() {},

        tagName: 'option',

        modelEvents: {
            'change:selected': 'render'
        },

        onRender: function() {
            var label = this.model.get('label');

            if (label === '') {
                this.$el.text('(empty)');
            }
            else if (label === 'null') {
                this.$el.text('(null)');
            }
            else {
                this.$el.text(label);
            }

            this.$el.attr('value', this.model.get('value'));
            this.$el.attr('selected', this.model.get('selected'));
        }
    });

    // Renders a dropdown of items allowing for selection of a single item
    // from the list.
    var SingleSelectionList = base.ControlCompositeView.extend({
        className: 'selection-list',

        template: 'controls/select/list',

        itemView: SelectionListItem,

        itemViewOptions: function(model) {
            return {
                model: model
            };
        },

        itemViewContainer: '.items',

        ui: {
            items: '.items'
        },

        events: {
            'change .items': 'onSelectionChange'
        },

        collectionEvents: {
            'reset': 'onCollectionSync'
        },

        initialize: function() {
            var limit;

            this.wait();

            if (!this.collection) {
                this.collection = new Backbone.Collection();

                // This is a hack to prevent a 500 error that occurs in
                // Serrano prior to 2.3.1 if limit is set to 0. The assumption
                // here is that if this type of control is being used for
                // selecting a value, it is unlikely to be rendering a large
                // number of values due to its poor usability. The field search
                // control is more appropriate for a large number of values.
                if (c.isSupported('2.3.1')) {
                    limit = 0;
                }
                else {
                    limit = 1000;
                }

                var _this = this;
                this.model.values({limit: limit}).done(function(resp) {
                    _this.collection.reset(resp.values);
                    return _this.ready();
                });
            }

            this.on('ready', function() {
                // Since the first item is selected immediately by the very
                // nature of a drow down list without a placeholder, we need to
                // call the change method when the control originally renders
                // so the value is set to the default selected option in the
                // dropdown and the apply(or update) filter button becomes
                // activated.
                this.change();
            });
        },

        onCollectionSync: function() {
            this.render();
        },

        onSelectionChange: function() {
            this.change();
        },

        getField: function() {
            return this.model.id;
        },

        getOperator: function() {
            return 'exact';
        },

        getValue: function() {
            return this.ui.items.val();
        },

        setValue: function(value) {
            this.ui.items.val(value);
        },

        validate: function(attrs) {
            if (_.isNull(attrs.value) || _.isUndefined(attrs.value)) {
                return 'An option must be selected';
            }
        }
    });

    var MultiSelectionList = SingleSelectionList.extend({
        onCollectionSync: function() {
            this.render();
        },

        onSelectionChange: function() {
            var _this = this;

            this.ui.items.children().each(function(i, el) {
                _this.collection.models[i].set('selected', el.selected);
            });

            this.change();
        },

        onRender: function() {
            this.ui.items.attr('multiple', true);
        },

        getOperator: function() {
            return 'in';
        },

        getValue: function() {
            return _.map(this.collection.where({selected: true}), function(model) {
                return model.get('value');
            });
        },

        setValue: function(values) {
            if (!values) {
                values = [];
            }

            this.collection.each(function(model) {
                model.set('selected', (values.indexOf(model.get('value')) >= 0));
            });
        },

        validate: function(attrs) {
            if (!attrs.value || !attrs.value.length) {
                return 'At least one option must be selected';
            }
        }
    });

    return {
        SingleSelectionList: SingleSelectionList,
        MultiSelectionList: MultiSelectionList
    };

});
