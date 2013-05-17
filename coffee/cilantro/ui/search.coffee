define [
    './core'
    'tpl!templates/views/search.html'
], (c, templates...) ->

    templates = c._.object ['search'], templates


    class Search extends c.Marionette.ItemView
        className: 'search'

        template: templates.search

        ui:
            input: 'input'

        options:
            valueKey: 'label'
            limit: 10

        onRender: ->
            @ui.input.typeahead(@options)


    { Search }
