/* global define */

define([
    'underscore',
    './query/dialog',
    './query/item',
    './query/list',
    './query/loader'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
