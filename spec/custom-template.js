/* global define */

define(['underscore'], function(_) {
    return _.template('Hello <%= data.name %>', null, {variable: 'data'});
});
