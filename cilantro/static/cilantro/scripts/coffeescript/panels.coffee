define ['jquery'], ($) ->

    $('[data-toggle*=panel]').each ->
        toggle = $(this)

        # If this data-toggle specifies a target, use that, otherwise assume
        # it is a .panel-toggle within the panel itself.
        if toggle.data('target')
            panel = $(toggle.data('target'))
            content = panel.children('.panel-content')
        else
            panel = toggle.parent()
            content = toggle.siblings('.panel-content')

        # Total width of panel
        slideWidth = panel.outerWidth()

        # If a .panel-toggle exists within the panel, substract the width
        # to it is still visible for use
        if panel.children('.panel-toggle')[0]
            slideWidth -= panel.children('.panel-toggle').outerWidth()

        # Setup the appropriate handlers depending on which side the panel
        # exists on
        if panel.hasClass('panel-right')
            panel.css(right: -slideWidth).show() if panel.hasClass('closed')
            toggle.on 'click', ->
                panel.toggleClass 'closed'
                panel.animate
                    right: (if parseInt(panel.css('right'), 10) is 0 then -slideWidth else 0)
                , 300
        else if panel.hasClass('panel-left')
            panel.css(left: -slideWidth).show() if panel.hasClass('closed')
            toggle.on 'click', ->
                panel.toggleClass 'closed'
                panel.animate
                    left: (if parseInt(panel.css('left'), 10) is 0 then -slideWidth else 0)
                , 300
