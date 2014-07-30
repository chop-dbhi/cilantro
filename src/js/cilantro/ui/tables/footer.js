/* global define */

define([
    'marionette'
], function(Marionette) {

    var Footer = Marionette.ItemView.extend({
        tagName: 'tfoot',

        template: function() {}
    });

    return {
        Footer: Footer
    };

});
