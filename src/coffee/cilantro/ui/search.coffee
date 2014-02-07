define [
    'underscore'
    'marionette'
], (_, Marionette) ->

    class Search extends Marionette.ItemView
        className: 'search'

        template: 'search'

        ui:
            input: 'input'

        onRender: ->
            if @options.placeholder
                @ui.input.attr('placeholder', @options.placeholder)
            _.defer =>
                if @_isRendered and not @isClosed
                    @ui.input.focus()


    { Search }
