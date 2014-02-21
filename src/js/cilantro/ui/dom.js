/* global define */

define(function() {

    // Inserts a element as a child of parent at a particular index.
    // This handles indexes that are out or bounds.
    // The primary use case for this is when child elements are being
    // inserted non-sequentially, but need to ordered in the DOM.
    var insertAt = function(parent, index, element) {
        var children = parent.children(),
            lastIndex = children.size();

        if (index < 0) {
            index = Math.max(0, lastIndex + 1 + index);
        }

        parent.append(element);

        if (index < lastIndex) {
            children.eq(index).before(children.last());
        }

        return parent;
    };

    return {
        insertAt: insertAt
    };

});
