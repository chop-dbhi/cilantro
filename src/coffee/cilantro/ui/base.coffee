define [
    './core'
    'tpl!templates/base/error-overlay.html'
    'tpl!templates/panel.html'
], (c, templates...) ->

    templates = c._.object ['errorOverlay', 'panel'], templates

    # Simple set of views for representing various states.
    #
    # Options include:
    #   - icon
    #   - message
    #   - align
    #   - template
    #
    # If a template is not provided, one will be created based on
    # the icon and the message.
    #
    # `align` corresponds to the text alignment. Options are 'left', 'right'
    # and 'center'.

    class StateView extends c.Marionette.ItemView
        align: 'center'

        constructor: ->
            super

            if not @template?
                if @options.template
                    @template = @options.template
                else
                    html = []

                    if (icon = @options.icon or @icon)
                        html.push icon
                    if (message = @options.message or @message)
                        html.push message

                    @template = ->
                        html.join ' '

            if @align then @$el.css('text-align', @align)


    class EmptyView extends StateView
        className: 'empty-view'

        icon: '<i class="icon-info"></i>'

        message: 'No data available'


    class ErrorView extends StateView
        className: 'error-view'

        icon: '<i class="icon-exclamation"></i>'

        message: 'Something went awry..'


    class ErrorOverlayView extends ErrorView
        className: 'error-overlay-view'

        template: templates.errorOverlay

        onRender: ->
            $(@options.target)
                .css('position', 'relative')
                .append(@$el)


    class LoadView extends StateView
        className: 'load-view'

        icon: '<i class="icon-spinner icon-spin"></i>'

        message: 'Loading...'


    class Panel extends c.Marionette.Layout
        className: 'panel'

        template: templates.panel

        options:
            content: null
            position: 'left'
            closed: false

        regions:
            toggle: '.panel-toggle'
            content: '.panel-content'

        initialize: ->
            @$el.panel(@options)

        onRender: ->
            if @options.content
                @content.show(@options.content)


    { EmptyView, ErrorView, ErrorOverlayView, LoadView, Panel }
