/* global define */

define([
    'underscore',
    'marionette',
    './base'
], function(_, Marionette, base) {

    var Item = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'accordian/item'
    });


    var Section = Marionette.CompositeView.extend({
        className: 'section',

        itemView: Item,

        template: 'accordian/section',

        itemViewContainer: '.items',

        ui: {
            heading: '.heading'
        },

        // Returns true if this group is *empty*
        isEmpty: function() {
            return this.collection.length === 0;
        },

        // Hide section if collection is empty. In practice if the
        // groups and sections are derived from the items, this should
        // never occur.
        onCompositeCollectionRendered: function() {
            this.$el.toggle(!this.isEmpty());
        }
    });


    var Group = Marionette.CompositeView.extend({
        className: 'group',

        template: 'accordian/group',

        itemView: Section,

        itemViewContainer: '.sections',

        itemSectionItems: 'items',

        options: {
            collapsable: true,
            // Denotes the initial state of the group
            collapsed: true
        },

        ui: {
            heading: '.heading',
            icon: '.heading [data-toggle]',
            inner: '.inner'
        },

        events: {
            'click > .heading': 'toggleCollapse'
        },

        itemViewOptions: function(model, index) {
            return {
                model: model,
                index: index,
                collection: model[this.itemSectionItems]
            };
        },

        initialize: function() {
            this.collapsed = this.options.collapsed;
        },

        onRender: function() {
            // Remove the icon that denotes the group is collapsable
            if (!this.options.collapsable) {
                this.renderExpanded();
                // Ensure the group is expanded if it cannot be toggled
                this.ui.icon.hide();
            }
            // Expand the collapsed group
            else if (this.collapsed) {
                this.renderCollapsed();
            }
        },

        // Returns true if this group is *empty* which includes having no
        // sections or having sections without any items.
        isEmpty: function() {
            if (this.collection.length > 0) return false;

            for (var i = 0; i < this.collection.length; i++) {
                if (this.collection.models[i].items.length > 0) {
                    return false;
                }
            }

            return true;
        },

        onCompositeCollectionRendered: function() {
            this.$el.toggle(!this.isEmpty());

            // Hide the first heading
            if (this.collection.length > 0) {
                // Get the first model and view for toggle conditions
                var model = this.collection.at(0),
                    view = this.children.findByModel(model);

                // If only a single child is present, hide the heading unless it
                // is using an explicit heading
                view.ui.heading.toggle(this.collection.length > 1 || model.id > -1);
            }
        },

        collapse: function(options) {
            if (this.options.collapsable) {
                this.collapsed = true;
                this.renderCollapsed(options);
            }
        },

        expand: function(options) {
            if (this.options.collapsable) {
                this.collapsed = false;
                this.renderExpanded(options);
            }
        },

        toggleCollapse: function(event) {
            event.preventDefault();

            if (this.options.collapsable) {
                if (this.collapsed) {
                    this.expand({animate: true});
                } else {
                    this.collapse({animate: true});
                }
            }
        },

        // Renders the current state based on the collapsed flag
        renderState: function(options) {
            if (this.collapsed && this.options.collapsable) {
                this.renderCollapsed(options);
            } else {
                this.renderExpanded(options);
            }
        },

        renderExpanded: function(options) {
            options = options || {};

            this.$el.removeClass('collapsed');

            if (options.animate) {
                this.ui.inner.collapse('show');
            } else {
                this.ui.inner.addClass('in');
            }
        },

        renderCollapsed: function(options) {
            options = options || {};

            this.$el.addClass('collapsed');

            if (options.animate) {
                this.ui.inner.collapse('hide');
            } else {
                this.ui.inner.removeClass('in');
            }
        }
    });


    var Accordian = Marionette.CollectionView.extend({
        className: 'accordian',

        itemView: Group,

        emptyView: base.EmptyView,

        itemGroupSections: 'sections',

        options: {
            // Denotes whether this group can be collapsed/expanded
            collapsable: true
        },

        itemViewOptions: function(model, index) {
            return {
                model: model,
                index: index,
                collection: model[this.itemGroupSections],
                collapsable: this.options.collapsable
            };
        }
    });


    return {
        Accordian: Accordian,
        AccordianGroup: Group,
        AccordianSection: Section,
        AccordianItem: Item
    };

});
