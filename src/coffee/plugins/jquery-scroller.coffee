define ['jquery', 'underscore'], ($, _) ->

    ###
    jQuery plugin for triggering a scroll event once a certain threshold is
    reached. A use case of this is the "infinite" scrolling element in which
    data is being populated in the element on-demand.

    Options:
      `container` - The container element that this element is scrolling
      relative to. Default is window

      `threshold` - Percent scrolled from the top of the element which triggers
        the event. Once this thresholder has been reached the `reset` method
        must be called to reset this state.

      `autofill` - For cases where each trigger event appends to this element
      (e.g. infinite scroll), this option will trigger the `scroller` event
      until this element's is greater than the container height.

      `resize` - Adds an event handler to trigger a reset when the window is
      resized.

      `trigger` - A single handler to fire when the `scroller` event fires.
      This can be bound directly to the element as a normal, but having it
      as an option keeps the code tidier.

    Methods are invoked by passing the method name as a string in the
    constructor method, e.g. `$(...).scroller('reset')`.

    Methods:
      `reset` - Resets the pre-calculated aboslute dimensions and thresholds.
        Use this when the element size changes.
    ###

    defaultOptions =
        container: window
        threshold: 0.75
        autofill: false
        resize: true
        trigger: null

    Scroller = (element, options) ->
        @element = $(element)
        @options = options
        @container = $(options.container)

        # Reset the dimensions on a window resize
        if options.resize
            $(window).on 'resize', _.debounce =>
                @reset()
            , 100

         @container.on 'scroll', _.debounce =>
            scrollTop = @container.scrollTop()
            threshold = (@element.height() - @container.height()) * @options.threshold
            if not @reached and scrollTop >= threshold
                @reached = true
                @element.trigger 'scroller'
        , 100

        # Add trigger handler
        if options.trigger
            @element.on 'scroller', options.trigger

        return @

    Scroller:: =
        constructor: Scroller

        reset: ->
            # Reset the flag which denotes when the threshold has been reached
            @reached = false

            # If autofill is enabled and the element is too *short* trigger
            # the event
            if @options.autofill and (@element.height() - @container.height()) < 0
                @element.trigger 'scroller'

            return @


    $.fn.scroller = (option) ->
        if $.isPlainObject option
            options = $.extend {}, defaultOptions, option
        else
            options = $.extend {}, defaultOptions

        @each ->
            $this = $ @
            data = $this.data('scroller')
            if not data
                $this.data 'scroller', (data = new Scroller $this, options)
            data[option]() if typeof option is 'string'

    $.fn.scroller.Constructor = Scroller
