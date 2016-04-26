/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {

    // Remove extraneous attributes on the context nodes.
    var stripContext = function(attrs) {
      if (attrs.children) {
        return {
          type: attrs.type,
          children: _.map(attrs.children, stripContext)
        };
      }

      return {
        concept: attrs.concept,
        field: attrs.field,
        operator: attrs.operator,
        value: attrs.value
      };
    };

    var ApiScriptDialog = Marionette.ItemView.extend({
        className: 'modal hide',

        template: 'api/dialog',

        ui: {
            // This is a faux pas to use IDs in a view selector,
            // but Bootstrap requires them for the tab functionality.
            curl: '#api-curl textarea',
            python: '#api-python textarea',
            type: 'input[name=type]'
        },

        events: {
          'click @ui.type': 'changeType'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            if (!(this.data.view = this.options.view)) {
                throw new Error('view model required');
            }
        },

        onRender: function() {
            var style = {
              boxSizing: 'border-box',
              width: '100%',
              resize: 'none',
              fontFamily: 'Monaco,Menlo,Consolas,"Courier New",monospace',
              fontSize: '0.9em'
            };

            this.ui.curl.css(style);
            this.ui.python.css(style);

            this.$('.modal-body').css({
              maxHeight: '600px'
            });

            this.$el.css({
                bottom: '10%'
            }).modal({
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
        },

        open: function() {
            this.$el.modal('show');
            this.renderSnippets();
        },

        close: function() {
            this.$el.modal('hide');
        },

        changeType: function() {
          this.renderSnippets();
        },

        renderSnippets: function() {
            // Prepare body of POST request using the current context and view.
            var body = JSON.stringify({
              context: stripContext(this.data.context.get('json')),
              view: this.data.view.get('json')
            });

            // Escape single quotes in the JSON string since it will be embedded in a
            // single quoted string in the target language.
            body = body.replace("'", "\\'");

            var type = this.ui.type.filter(':checked').val();

            // Get the URI for the JSON exporter.
            var url = c.data.exporter.get(type).get('uri');

            var ctx = {
              url: url,
              body: body,
              type: type,
              token: 'YOUR-TOKEN-HERE'
            };

            // Render the templates.
            var curl = c.templates.get('api/curl')(ctx);
            var python = c.templates.get('api/python')(ctx);

            // Fill the textareas.
            this.ui.curl.val(curl);
            this.ui.python.val(python);
        }
    });

    return {
        ApiScriptDialog: ApiScriptDialog
    };
});
