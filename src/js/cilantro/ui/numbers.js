/* global define */

define([
    './core'
], function(c) {

    // Method for rendering a count. It will prettify the number for display
    // and set the (delimited) raw number as the title for a popover. If the
    // count is null, 'n/a' will be displayed.
    var renderCount = function($el, count, fallback) {
        if (!fallback) fallback = '<em>n/a</em>';

        if (!count) {
            $el.html(fallback);
        }
        else {
            $el.html(c.utils.prettyNumber(count, c.config.get('threshold')))
               .attr('title', c.utils.toDelimitedNumber(count));
        }
    };

    return {
        renderCount: renderCount
    };

});
