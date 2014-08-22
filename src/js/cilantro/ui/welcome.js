/* global define */

define([
    'underscore',
    'marionette'
], function(_, Marionette) {

    var Welcome = Marionette.ItemView.extend({
        className: 'welcome',

        template: 'welcome',

        ui: {
            firstTime: '[data-target=first-time]',
            welcomeBack: '[data-target=welcome-back]'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            this.listenTo(this.data.context, 'change', this.renderWelcomeMessage);
        },

        renderWelcomeMessage: function() {
            var isReturningUser = false;

            // If there is no session then this is not a returning user.
            if (this.data.context.get('session') === true) {
                // Just because the context has been created doesn't mean it
                // is a returning user. We assume that a returning user will
                // have at least one filter setup so we check for a created 
                // date and a filter in order to qualify a user as returning.
                if (this.data.context.get('created') && 
                        !_.isEmpty(this.data.context.get('json'))) {
                    isReturningUser = true;
                }
            }

            if (isReturningUser) {
                this.ui.firstTime.hide();
                this.ui.welcomeBack.show();
            }
            else {
                this.ui.firstTime.show();
                this.ui.welcomeBack.hide();
            }
        }
    });

    return {
        Welcome: Welcome
    };

});
