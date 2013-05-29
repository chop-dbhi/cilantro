define [
    './core'
], (c) ->


    class StateView extends c.Marionette.ItemView
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


    class EmptyView extends StateView
        className: 'empty-view'

        icon: '<i class="icon-info"></i>'

        message: 'No data available'


    class ErrorView extends StateView
        className: 'error-view'

        icon: '<i class="icon-exclamation"></i>'

        message: 'Something went awry..'


    class LoadView extends StateView
        className: 'load-view'

        icon: '<i class="icon-spinner icon-spin"></i>'

        message: 'Loading...'


    { EmptyView, ErrorView, LoadView }
