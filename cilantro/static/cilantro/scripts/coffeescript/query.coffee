define ['jquery', 'underscore', 'backbone', 'serrano'], ($, _, Backbone, Serrano) ->

    $ ->

        $('[data-toggle=detail]').each ->
            toggle = $(this)
            details = toggle.parent().siblings('.details')

            toggle.on 'click', ->
                if details.is(':visible')
                    details.slideUp 200
                else
                    details.slideDown 200

