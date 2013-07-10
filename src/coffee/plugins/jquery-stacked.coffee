define [
    'jquery'
    'underscore'
], ($, _) ->

    defaultOptions =
        # Selector of "fluid" elements which take up any remaining space
        # available
        fluid: null

        # An explicit value or relative offset
        maxHeight: null

        # An explicit value or relative offset
        minHeight: null

        # Animate restack
        animate: true

        stackedClass: 'stacked'

        # Overlay classes for adjacent siblings before and after the
        # overflowed element
        overlayBeforeClass: 'overlay-before'
        overlayAfterClass: 'overlay-after'

        # Overlay classes for the parent for the first and last elements
        overlayFirstClass: 'overlay-first'
        overlayLastClass: 'overlay-last'


    # Extracts the number portion of a pixel string, e.g. '50px' => 50
    parsePixelString = (string) ->
        match = string.match(/(\d*(?:\.\d+)?)px/)
        if match? then return parseFloat(match[1])


    # Matches relative sizes e.g. -=4, -=4., +=4.0, +=.4, -=0.4
    relativeSizeRe = /([-\+])=?(\d*(?:\.\d+)?)/


    # Checks if `string` is relative size
    isRelativeSize = (string) ->
        relativeSizeRe.test(string)


    # Applies a relative size to the base value
    applyRelativeSize = (base, string) ->
        if string?
            toks = string.match(relativeSizeRe)
            return base + parseFloat(toks.slice(1).join(''))
        return base


    # Return the minimum height of the element. This is used as the
    # threshold for switching children to static positioning.
    getMinHeight = ($elem, options) ->
        minHeight = options.minHeight

        if minHeight? and not isRelativeSize(minHeight)
            return minHeight

        if not (height = parsePixelString($elem.css('min-height')))?
            height = 0

        height = applyRelativeSize(height, minHeight)
        return height


    # Returns the maximum for the element. It defaults to the element top
    # offset to the bottom of the window.
    getMaxHeight = ($elem, options) ->
        maxHeight = options.maxHeight

        if maxHeight? and not isRelativeSize(maxHeight)
            return maxHeight

        # Calculate the max-height based on the window height, top offset
        # of the element, and the margins
        if not (height = parsePixelString($elem.css('max-height')))?

            windowHeight = $(window).outerHeight()

            # Offset relative to the document (including the top margin)
            offsetTop = $elem.offset().top

            # Substract the bottom margin from the height to respect the
            # spacing
            marginBottom = parsePixelString($elem.css('marginBottom'))

            height = windowHeight - offsetTop - marginBottom

        height = applyRelativeSize(height, maxHeight)
        return height


    # Returns the vertical padding
    getPaddingHeight = ($elem, options) ->
        top = parsePixelString($elem.css('paddingTop'))
        bottom = parsePixelString($elem.css('paddingBottom'))
        return top + bottom


    # Returns the vertical margin
    getMarginHeight = ($elem, options) ->
        top = parsePixelString($elem.css('marginTop'))
        bottom = parsePixelString($elem.css('marginBottom'))
        return top + bottom


    # Calculates the scroll height, not including the height of the element
    getScrollHeight = ($elem, options) ->
        height = $elem.outerHeight(true)
        childHeight = $elem.children().outerHeight(true)
        return Math.max(0, childHeight - height)


    # Applies a class to adjacent siblings if the scroll position is non-zero.
    # If no adjacent siblings are present, alternate classes will applied to
    # the parent which can provide an inner overlap (inset box-shadow)
    toggleChildOverlay = ($child, options) ->
        scrollTop = $child.scrollTop()
        scrollHeight = getScrollHeight($child, options)

        afterTop = scrollTop > 0
        beforeBottom = scrollTop < scrollHeight

        if ($prev = $child.prev())[0]?
            $prev.toggleClass(options.overlayBeforeClass, afterTop)
        else
            $child.parent().toggleClass(options.overlayFirstClass, afterTop)

        if ($next = $child.next())[0]?
            $next.toggleClass(options.overlayAfterClass, beforeBottom)
        else
            $child.parent().toggleClass(options.overlayLastClass, beforeBottom)
        return


    # Returns child elements that are fluid
    getFluidChildren = ($elem, options) ->
        $elem.children().filter(options.fluid)


    # Returns an array of objects with the pending height of each child.
    # Fluid element heights will be calculated after all static heights
    # have been removed from the target height.
    getStackedHeights = ($elem, options) ->
        remainingHeight = options.maxHeight - getPaddingHeight($elem, options)

        $children = $elem.children()
        $fluidChildren = getFluidChildren($elem, options)

        heights = []

        # Get all the heights, fluid children are null
        $children.each (i, child) ->
            $child = $(child)

            config =
                margin: getMarginHeight($child)
                padding: getPaddingHeight($child)

            if $child.is(options.fluid)
                config.fluid = true
            else
                height = $child.outerHeight(true)
                remainingHeight -= height
                config.fluid = false
                config.height = height - config.margin

            heights.push(config)

        # Calculate the height of each fluid child
        fluidHeight = remainingHeight / $fluidChildren.length

        # Fill in the gaps
        for config, i in heights
            config.height ?= (fluidHeight - config.margin)

        return heights


    # Calculates and sets the position of each child based on the height and
    # type which was calculated using getStackedHeights.
    applyStackedHeights = ($elem, heights, options) ->
        # Set the explicit height of the element
        $elem.height((height = options.maxHeight))

        # Respect padding; the top padding is added to the top position,
        # the bottom padding is added to the bottom since the inverse is
        # used.
        top = parsePixelString($elem.css('paddingTop'))
        bottom = parsePixelString($elem.css('paddingBottom'))

        reverse = false

        $elem.children().each (i, child) ->
            $child = $(child)
            config = heights[i]

            # Top margin of child
            top += parsePixelString($child.css('marginTop'))

            bottom = height - top - config.height # parsePixelString($child.css('marginBottom'))

            # Fluid elements need both the top and bottom specified to be
            # anchored relative to the fixed elements.
            if config.fluid
                reverse = true
                css = top: top, bottom: bottom
            else if reverse
                css = bottom: bottom
            else
                css = top: top

            $child.css(css)

            # Add height and bottom margin for next iteration
            top += config.height + parsePixelString($child.css('marginBottom'))


    class StackedColumn
        constructor: (element, options) ->
            @$element = $(element).addClass(options.stackedClass)
            @options = options

            @restack()

            @_optimized = getFluidChildren(@$element, @options).length < 2

            # An optimized stack does not require debouncing since it does
            # not involving recomputing the child positions.
            if @_optimized
                @_restack = @restack
            else
                @_restack = _.debounce(@restack, 50)

            @_scroll = (event) =>
                $child = $(event.target)
                toggleChildOverlay($child, @options)

            @listen()

        overlay: =>
            @$element.children().each (i, child) =>
                toggleChildOverlay($(child), @options)
            return @

        restack: =>
            options = $.extend {}, @options,
                maxHeight: getMaxHeight(@$element, @options)
                minHeight: getMinHeight(@$element, @options)

            if @_optimized
                @$element.clearQueue('fx')
                if @options.animate
                    @$element.animate(height: options.maxHeight, 200)
                else
                    @$element.height(options.maxHeight)
            else
                heights = getStackedHeights(@$element, options)
                applyStackedHeights(@$element, heights, options)
            return @

        listen: ->
            $(window).on('resize', @_restack)
            @$element.children().on('scroll', @_scroll)
            return @

        unlisten: ->
            $(window).off('resize', @_restack)
            @$element.children().off('scroll', @_scroll)
            return @


    $.fn.stacked = (option) ->
        if $.isPlainObject option
            options = $.extend {}, defaultOptions, option
        else
            options = $.extend {}, defaultOptions

        @each ->
            $this = $ @
            data = $this.data('stacked')
            if not data
                $this.data 'stacked', (data = new StackedColumn $this, options)
            if typeof option is 'string' and option.charAt(0) isnt '_'
                data[option]()


    $.fn.stacked.Constructor = StackedColumn

    return $
