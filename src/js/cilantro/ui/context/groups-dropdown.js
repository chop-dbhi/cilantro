/* global define */

define([
  'underscore',
  'marionette',
  '../../core'
], function(_, Marionette, c) {

    var GroupItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'context/groups-item',

        events: {
          'click a': 'handleAddGroup',
          'click [data-action=delete-group]': 'handleDeleteGroup'
        },

        handleAddGroup: function(event) {
          event.preventDefault();
          this.trigger('select');
        },

        handleDeleteGroup: function(event) {
          event.preventDefault();
          this.model.destroy();
        }
    });

    var ContextGroupsDropdown = Marionette.CompositeView.extend({
        template: 'context/groups-dropdown',

        className: 'btn-group pull-right',

        itemView: GroupItem,

        itemViewContainer: 'ul',

        itemEvents: {
            'select': 'handleItemSelect'
        },

        ui: {
          list: 'ul'
        },

        events: {
            'click @ui.list a': 'handleItemClick',
        },

        handleItemSelect: function(event, item) {
            var filter = this.model.define({
              name: item.model.get('name') || item.model.id,
              composite: item.model.id
            });

            filter.apply();
        },

        // Include only the relevant context items.
        addItemView: function(model, ItemView, index) {
            if ((model.get('session') || model.get('template'))) return;
            Marionette.CompositeView.prototype.addItemView.apply(this, arguments);
        }
    });

  return {
    ContextGroupsDropdown: ContextGroupsDropdown
  };

});
