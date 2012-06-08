define ['jquery'], ($) ->

    Panel = (element) ->
        @element = $(element)
        # Total width of panel
        @slideWidth = @element.outerWidth()

        # If a .panel-toggle exists within the panel, substract the width
        # to it is still visible for use
        if (toggle = @element.children('.panel-toggle'))[0]
            toggle.on 'click', => @element.panel 'toggle'
            @slideWidth -= toggle.outerWidth()

        @state = 1

        if @element.hasClass('panel-right')
            @side = 'right'
        else
            @side = 'left'

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
        $('.panel').panel()

        $('[data-toggle*=panel]').each ->
            (toggle = $(this)).on 'click', ->
                # If this data-toggle specifies a target, use that, otherwise assume
                # it is a .panel-toggle within the panel itself.
                if toggle.data('target')
                    panel = $(toggle.data('target'))
                else
                    panel = toggle.parent()
                panel.panel 'toggle'
