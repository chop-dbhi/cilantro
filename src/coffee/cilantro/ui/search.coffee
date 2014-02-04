define [
    'underscore'
    'marionette'
    'tpl!templates/search.html'
], (_, Marionette, templates...) ->

    templates = _.object ['search'], templates


    class Search extends Marionette.ItemView
        className: 'search'

        template: templates.search

        ui:
            input: 'input'

        onRender: ->
            if @options.placeholder
                @ui.input.attr('placeholder', @options.placeholder)
            _.defer =>
                if @_isRendered and not @isClosed
                    @ui.input.focus()


    { Search }
