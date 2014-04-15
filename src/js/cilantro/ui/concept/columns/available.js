/* global define */

define([
    '../index'
], function(index) {

    var AvailableItem = index.ConceptItem.extend({
        template: 'concept/columns/available-item',

        events: {
            'mouseover': 'triggerDetails',
            'mouseout': 'triggerDetails',
            'click [data-action=add]': 'triggerAdd'
        },

        modelEvents: {
            'columns:add': 'disable',
            'columns:remove': 'enable'
        },

        triggerAdd: function(event) {
            event.preventDefault();

            this.model.trigger('columns:add', this.model);
        },

        triggerDetails: function(event) {
            event.preventDefault();
            event.stopPropagation();

            this.model.trigger('columns:detail', this.model, event);
        },

        enable: function() {
            this.$el.removeClass('disabled');
        },

        disable: function() {
            this.$el.addClass('disabled');
        }
    });


    var AvailableSection = index.ConceptSection.extend({
        template: 'concept/columns/available-section',

        itemView: AvailableItem,

        events: {
            'click [data-action=add-section]': 'triggerAdd'
        },

        triggerAdd: function(event) {
            event.preventDefault();

            this.model.items.each(function(model) {
                model.trigger('columns:add', model);
            });
        }
    });


    var AvailableGroup = index.ConceptGroup.extend({
        template: 'concept/columns/available-group',

        itemView: AvailableSection,

        events: {
            'click [data-action=add-group]': 'triggerAdd'
        },

        triggerAdd: function(event) {
            event.preventDefault();

            this.model.sections.each(function(model) {
                model.items.each(function(model) {
                    model.trigger('columns:add', model);
                });
            });
        }
    });


    var AvailableColumns = index.ConceptIndex.extend({
        itemView: AvailableGroup,

        className: 'available-columns accordion'
    });


    return {
        AvailableItem: AvailableItem,
        AvailableSection: AvailableSection,
        AvailableGroup: AvailableGroup,
        AvailableColumns: AvailableColumns
    };

});
