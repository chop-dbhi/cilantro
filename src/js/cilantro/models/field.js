/* global define */

define([
    'underscore',
    './field/base',
    './field/stats'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(_, [{}].concat(mods));

});
