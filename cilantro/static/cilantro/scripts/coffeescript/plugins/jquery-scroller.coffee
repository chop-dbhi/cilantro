define ['jquery', 'underscore'], ($, _) ->

    ###
    jQuery plugin for triggering a scroll event once a certain threshold is
    reached. A use case of this is the "infinite" scrolling element in which
    data is being populated in the element on-demand.

    Options:
      `threshold` - Percent scrolled from the top of the element which triggers
        the event. Once this thresholder has been reached the `reset` method
        must be called to reset this state.

    Methods are invoked by passing the method name as a string in the
    constructor method, e.g. `$(...).panel('open')`.

    Methods:
      `reset` - Resets the pre-calculated aboslute dimensions and thresholds.
        Use this when the element size changes.
    ###

    defaultOptions =
        # Percentage of the way to the bottom, e.g. at 75% of the
        # total height, trigger the event
        threshold: 0.75

    Scroller = (element, options) ->
        @element = $(element)
        @options = options

        # Total height of element
        if options.relative
            @height = @element.find(options.relative).innerHeight() - @element.innerHeight()
        else
            @height = @element.innerHeight()

        # Scroller threshold when the event will be triggered
        @threshold = @height * options.threshold

        @element.on 'scroll', _.debounce =>
            if not @reached and @element.scrollTop() >= @threshold
                @reached = true
                @element.trigger 'scroller'
        , 50

        if options.trigger
            @element.on 'scroller', options.trigger

        return @

    Scroller:: =
        constructor: Scroller

        reset: ->
            @reached = false
            # Total height of element
            if @options.relative
                @height = @element.find(@options.relative).innerHeight() - @element.innerHeight()
            else
                @height = @element.innerHeight()
            @threshold = @height * @options.threshold
            return @


    $.fn.scroller = (option) ->
        if $.isPlainObject option
            options = $.extend {}, option, defaultOptions
        else
            options = $.extend {}, defaultOptions

        @each ->
            $this = $ @
            data = $this.data('scroller')
            $this.data 'scroller', (data = new Scroller(@, options)) unless data
            data[option]() if typeof option is 'string'

    $.fn.scroller.Constructor = Scroller
