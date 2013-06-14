define [
    './core'
], (c) ->

    # Method for rendering a count. It will prettify the number for display
    # and set the (delimited) raw number as the title for a popover. If the
    # count is null, 'n/a' will be displayed.
    renderCount: ($el, count, fallback='<em>n/a</em>') ->
        if not count?
            $el.html(fallback)
        else
            $el.text(c.utils.prettyNumber(count))
                .attr('title', c.utils.toDelimitedNumber(count))
