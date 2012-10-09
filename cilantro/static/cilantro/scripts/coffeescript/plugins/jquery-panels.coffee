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

    Panel = (element) ->
        @element = $(element)
        # Total width of panel
        @slideWidth = @element.width()

        # If a .panel-toggle exists within the panel, substract the width
        # to it is still visible for use
        if (toggle = @element.children('.panel-toggle'))[0]
            toggle.on 'click', => @element.panel 'toggle'
            @slideWidth -= toggle.width()

        @state = 1

        if @element.hasClass('panel-right')
            @side = 'right'
        else
            @side = 'left'

        # Hide without animation
        if @element.hasClass 'closed'
            @state = 0
            (css = {})[@side] = -@slideWidth
            @element.css(css).show()

        return @

    Panel:: =
        constructor: Panel

        open: ->
            if not @state
                @state = 1
                (attrs = {})[@side] = 0
                @element.animate(attrs, 300).removeClass('closed')
            
        close: ->
            if @state
                @state = 0
                (attrs = {})[@side] = -@slideWidth
                @element.animate(attrs, 300).addClass('closed')

        toggle: -> if @state then @close() else @open()


    $.fn.panel = (option) ->
        @each ->
            $this = $ @
            data = $this.data('panel')
            $this.data 'panel', (data = new Panel(@)) unless data
            data[option]() if typeof option is 'string'

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
