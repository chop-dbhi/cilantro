/* global define */

define([
    'underscore',
    'marionette',
    '../core'
], function(_, Marionette, c) {


    var ContextInfo = Marionette.ItemView.extend({
        template: 'context/info',

        ui: {
            query: '[data-route=query]',
            results: '[data-route=results]'
        },

        initialize: function() {
            _.bindAll(this, 'toggleButton');

            // Toggle buttons when the route changes
            c.router.on('route', this.toggleButton);
        },

        // Toggles the buttons relative to the current route. This is a shared
        // view across routes, thus it must be *aware* of which is the current
        // route.
        toggleButton: function() {
            this.ui.query.toggle(c.router.isCurrent('results'));
            this.ui.results.toggle(c.router.isCurrent('query'));
        },

        onRender: function() {
            this.toggleButton();
        }
    });


    return {
        ContextInfo: ContextInfo
    };


});
