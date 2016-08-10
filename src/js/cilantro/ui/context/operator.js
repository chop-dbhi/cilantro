/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {


    var ContextOperator = Marionette.ItemView.extend({
        template: 'context/operator',

        ui: {
            and: '.operator-and',
            or: '.operator-or'
        },

        events: {
            'click @ui.and': 'handleClick',
            'click @ui.or': 'handleClick',
        },

        modelEvents: {
            'change:optype': 'setButton'
        },

        initialize: function() {
            _.bindAll(this, 'handleClick');
        },

        handleClick: function(event) {
          var optype = this.ui.and.is(event.target) ? 'and' : 'or';
          this.model.set('optype', optype);
        },

        setButton: function() {
          var and = false,
              or = false;

          this.model.get('optype') === 'and' ? and = true : or = true;

          this.ui.and.prop('disabled', and);
          this.ui.or.prop('disabled', or);
        },

        onRender: function() {
            var opts = {
                html: true,
                delay: 200
            };

            this.ui.and.tooltip(opts);
            this.ui.or.tooltip(opts);

            this.setButton();
        }
    });


    return {
        ContextOperator: ContextOperator
    };


});
