/* global define */

define([
    'underscore',
    './charts/dist',
    './charts/axis',
    './charts/editable'
], function(_) {

    // Modules to be mixed-in with exports.
    var mods = Array.prototype.slice.call(arguments, 1);

    // Merge the mods into an empty object that will be exported.
    return _.extend.apply(_, [{}].concat(mods));

});
