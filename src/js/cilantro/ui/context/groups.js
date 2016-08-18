/* global define */

define([
  'underscore',
  'marionette',
  '../../core',
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


    var ContextGroups = Marionette.CompositeView.extend({
        template: 'context/groups',

        className: 'btn-group pull-right',

        ui: {
            list: 'ul',
            input: 'input[name=group-name]',
            button: '[data-action=create-group]'
        },

        itemView: GroupItem,

        itemViewContainer: 'ul',

        itemEvents: {
            'select': 'handleItemSelect'
        },

        events: {
            'click @ui.list a': 'handleItemClick',
            'click @ui.input': 'handleFocusInput',
            'click @ui.button': 'handleCreateGroup'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.contexts = this.collection)) {
                throw new Error('context collection required');
            }
        },

        handleFocusInput: function(event) {
            this.ui.button.addClass('btn-primary');
            this.ui.button.removeClass('btn-danger');
            this.ui.input.removeClass('error');
            event.stopPropagation();
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
        },

        handleCreateGroup: function(event) {
          var groupName = this.ui.input.val();

          if (!groupName) {
            this.ui.button.addClass('btn-danger');
            this.ui.button.removeClass('btn-primary');
            this.ui.input.addClass('error');
            event.stopPropagation();
            event.preventDefault();
            return;
          }

          // Check if there are other saved contexts by the same name
          // and prevent this.
          var model = this.collection.findWhere({name: groupName});

          if (model) {
            this.ui.button.addClass('btn-danger');
            this.ui.button.removeClass('btn-primary');
            this.ui.input.addClass('error');
            event.stopPropagation();
            event.preventDefault();
            return;
          }

          var session = this.model;

          var attrs = {
            name: groupName,
            json: session.toJSON().json
          };

          this.collection.create(attrs, {
            wait: true,
            success: function(model) {
              session.unapply(session.filters, {save: false});

              var filter = session.define({
                name: model.get('name'),
                composite: model.id
              });

              filter.apply();
            }
          });
        }

    });


    return {
        ContextGroups: ContextGroups
    };

});
