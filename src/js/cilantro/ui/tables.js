/* global define */

define([
    'underscore',
    './tables/cell',
    './tables/row',
    './tables/header',
    './tables/footer',
    './tables/body',
    './tables/table'
], function(_) {

    // Modules to be mixed-in with exports.
    var mods = Array.prototype.slice.call(arguments, 1);

    // Merge the mods into an empty object that will be exported.
    return _.extend.apply(_, [{}].concat(mods));

});
