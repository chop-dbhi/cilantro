/* global define */

define([
    'underscore',
    'marionette'
], function(_, Marionette) {

    var Welcome = Marionette.ItemView.extend({
        className: 'welcome',

        template: 'welcome'
    });

    return {
        Welcome: Welcome
    };

});
