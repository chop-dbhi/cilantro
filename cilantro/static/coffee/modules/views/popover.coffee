define ->

    directions =
        right: (reference, target) ->
            tHeight = target.outerHeight()
            rOffset = reference.offset()
            rHeight = reference.outerHeight()
            rWidth = reference.outerWidth()

            target.animate
                top: rOffset.top - (tHeight - rHeight) / 2.0
                left: rOffset.left + rWidth + 5.0
            , 400, 'easeOutQuint'

        left: (reference, target) ->
            tHeight = target.outerHeight()
            tWidth = target.outerWidth()
            rOffset = reference.offset()
            rHeight = reference.outerHeight()

            target.animate
                top: rOffset.top - (tHeight - rHeight) / 2.0
                left: rOffset.left - tWidth - 5.0
            , 400, 'easeOutQuint'

        above: (reference, target) ->
            tHeight = target.outerHeight()
            tWidth = target.outerWidth()
            rOffset = reference.offset()
            rWidth = reference.outerWidth()

            target.animate
                top: rOffset.top - tHeight - 5.0
                left: rOffset.left - (tWidth - rWidth) / 2.0
            , 400, 'easeOutQuint'

        below: (reference, target) ->
            tWidth = target.outerWidth()
            rOffset = reference.offset()
            rHeight = reference.outerHeight()
            rWidth = reference.outerWidth()

            target.animate
                top: rOffset.top + rHeight + 5.0
                left: rOffset.left - (tWidth - rWidth) / 2.0
            , 400, 'easeOutQuint'

    class Popover extends Backbone.View

        events:
            'mouseenter': 'mouseenter'
            'mouseleave': 'mouseleave'

        elements:
            '.title': 'title'
            '.content': 'content'

        update: (view) ->

        show: (view, side='right') ->
            clearTimeout @_hoverTimer
            @_hoverTimer = setTimeout =>
                # update the popover relative to the view/model
                @update(view)
                # update the class corresponding to the specified side
                @el.removeClass('right left above below').addClass(side)
                # call handler relative to the side/direction it should show
                directions[side](view.el, @el)
                @el.fadeIn()
            , 200

        hide: (immediately=false) ->
            clearTimeout @_hoverTimer
            if immediately
                @el.fadeOut()
            else if not @entered
                @_hoverTimer = setTimeout =>
                    @el.fadeOut()
                , 100

        mouseenter: (view) ->
            clearTimeout @_hoverTimer
            @entered = true

        mouseleave: ->
            clearTimeout @_hoverTimer
            @entered = false
            @hide()


    return {
        Popover: Popover
    }
