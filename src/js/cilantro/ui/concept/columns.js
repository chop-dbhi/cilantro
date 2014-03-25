/* global define */

define([
    'underscore',
    './columns/dialog'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(_, [{}].concat(mods));

});
