define ['jquery'], ($) ->

    ###
    jQuery plugin for an side-panel which can open and close on the
    left or right edge of the document.

    Methods are invoked by passing the method name as a string in the
    constructor method, e.g. `$(...).panel('open')`.

    Methods:
      `open` - Opens the panel
      `close` - Closes the panel
      'toggle` - Toggles the panel open/close state

    CSS classes:
      `.panel` - base class for panel container
      `.panel-toggle` - edge toggle on the panel itself which is kept
          exposed while in a closed state
      `.panel-right` - positions the panel on the right edge of the document
      `.panel-left` - positions the panel on the left edge of the document
      `.closed` - start the panel in a closed state

    HTML markup:
      <div class="panel panel-left closed">
          <div class="panel-toggle"></div>
          <div class="panel-content">
              ...
          </div>
      </div>
    ###

    getSlideWidth = (element, options={}) ->
        # Total width of panel
        slideWidth = element.outerWidth()

        # If a .panel-toggle exists within the panel, substract the width
        # to it is still visible for use
        if options.full isnt false and (toggle = element.children('.panel-toggle'))[0]
            return slideWidth - toggle.outerWidth()

        return slideWidth

    Panel = (element, options) ->
        @element = $(element)

        @options = $.extend {},
            side: 'left'
            closed: false
        , options

        @state = 1

        if @options.side is 'right' or @element.hasClass('panel-right')
            @element.addClass('panel-right')
            @side = 'right'
        else
            @side = 'left'

        # Hide without animation
        if @options.closed is true or @element.hasClass 'closed'
            @state = 0
            @element.addClass('closed').hide()

        @element.on 'click', '.panel-toggle', =>
            @toggle()

        return @

    Panel:: =
        constructor: Panel

        open: (options={}) ->
            if not @state
                @state = 1

                # Ensure the position is off screen to start. This
                # is to handle the case when the element was hidden
                (css = {})[@side] = -getSlideWidth(@element, options)
                @element.css(css).show()

                (attrs = {})[@side] = 0

                @element.stop()

                if options.animate isnt false
                    @element.animate(attrs, 300)
                else
                    @element.css(attrs)

                @element.removeClass('closed')

        close: (options={}) ->
            if @state
                @state = 0

                slideWidth = getSlideWidth(@element, options)

                (attrs = {})[@side] = -slideWidth

                @element.stop()

                if options.animate isnt false
                    @element.animate(attrs, 300)
                else
                    @element.css(attrs)

                @element.addClass('closed')

        toggle: -> if @state then @close() else @open()

        isOpen: -> @state is 1

        isClosed: -> @state is 0


    $.fn.panel = (option, options) ->
        @each ->
            $this = $(@)

            if not (data = $this.data('panel'))
                if typeof option is 'object' then options = option
                $this.data('panel', (data = new Panel(@, options)))

            if typeof option is 'string'
                data[option](options)

    $.fn.panel.Constructor = Panel


    $ ->
        # Bootstrap pre-rendered DOM elements
        $('.panel').panel()

        $('[data-toggle*=panel]').each ->
            (toggle = $(this)).on 'click', ->
                # If this data-toggle specifies a target, use that, otherwise assume
                # it is a .panel-toggle within the panel itself.
                if toggle.data 'target'
                    panel = $ toggle.data('target')
                else
                    panel = toggle.parent()
                panel.panel 'toggle'
