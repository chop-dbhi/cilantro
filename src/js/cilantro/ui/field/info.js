/* global define */

define([
    'underscore',
    'marionette'
], function(_, Marionette) {

    var FieldInfo = Marionette.ItemView.extend({
        className: 'field-info',

        template: 'field/info'
    });


    return {
        FieldInfo: FieldInfo
    };

});
