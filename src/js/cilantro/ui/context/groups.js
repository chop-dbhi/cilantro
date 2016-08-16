/* global define */

define([
  'underscore',
  'marionette',
  '../../core',
  './groups-dropdown',
], function(_, Marionette, c, dropdown) {

    var ContextGroups = Marionette.Layout.extend({
        template: 'context/groups',

        ui: {
            input: 'input[name=group-name]',
            button: '[data-action=create-group]'
        },

        events: {
            'click @ui.input': 'handleFocusInput',
            'click @ui.button': 'handleCreateGroup'
        },

        regions: {
            dropdown: '[data-region=dropdown]',
        },

        regionViews: {
            dropdown: dropdown.ContextGroupsDropdown,
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.contexts = this.collection)) {
                throw new Error('context collection required');
            }
        },

        onRender: function() {
            var dropdown = new this.regionViews.dropdown({
                model: this.model,
                collection: this.data.contexts
            });

            this.dropdown.show(dropdown);

            this.bindUIElements();
        },

        handleFocusInput: function(event) {
            this.ui.button.addClass('btn-primary');
            this.ui.button.removeClass('btn-danger');
            this.ui.input.removeClass('error');
            event.stopPropagation();
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
