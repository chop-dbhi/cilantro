define [
    'jquery'
    'underscore'
], ($, _) ->

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
