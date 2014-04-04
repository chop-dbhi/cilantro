/* global define */

define([
    'underscore',
    './field/info',
    './field/form',
    './field/stats',
    './field/controls'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
