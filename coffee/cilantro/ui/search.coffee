define [
    './core'
    'tpl!templates/search.html'
], (c, templates...) ->

    templates = c._.object ['search'], templates


    class Search extends c.Marionette.ItemView
        className: 'search'

        template: templates.search

        ui:
            input: 'input'

        onRender: ->
            if @options.placeholder
                @ui.input.attr('placeholder', @options.placeholder)
            c._.defer => @ui.input.focus()


    { Search }
