/* global define */

define([
    'marionette',
    '../../base'
], function(Marionette, base) {


    var SelectedItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'concept/columns/selected-item',

        events: {
            'click [data-action=remove]': 'triggerRemove',
            'sortupdate': 'updateIndex'
        },

        modelEvents: {
            'columns:remove': 'remove'
        },

        triggerRemove: function(event) {
            event.preventDefault();

            this.model.trigger('columns:remove', this.model);
        },

        // Silently move the model to a new index in the collection based
        // on the current position in the DOM from the sort event.
        updateIndex: function(event, index) {
            event.stopPropagation();

            this.collection.remove(this.model, {silent: true});
            this.collection.add(this.model, {at: index, silent: true});
        }
    });


    var NoSelectedItem = base.EmptyView.extend({
        message: 'No columns selected.'
    });


    var SelectedColumns = Marionette.CollectionView.extend({
        tagName: 'ul',

        className: 'selected-columns',

        itemView: SelectedItem,

        emptyView: NoSelectedItem,

        events: {
            'sortupdate': 'triggerItemSort'
        },

        // Explicitly pass the collection to enable re-ordering the models
        // when they are sorted.
        itemViewOptions: function(model, index) {
            return {
                model: model,
                index: index,
                collection: this.collection
            };
        },

        onRender: function() {
            this.$el.sortable({
                cursor: 'move',
                forcePlaceholderSize: true,
                placeholder: 'placeholder'
            });
        },

        // 'Sortable' events are not triggered on the item being sorted
        // so this handles proxying the event to the item itself.
        // See the SelectedItem handler for the event above.
        triggerItemSort: function(event, ui) {
            ui.item.trigger(event, [ui.item.index()]);
        }
    });


    return {
        SelectedItem: SelectedItem,
        SelectedColumns: SelectedColumns
    };

});
