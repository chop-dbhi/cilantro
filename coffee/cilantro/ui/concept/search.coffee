define [
    'jquery' 
    '../core'
    'tpl!templates/views/concept-search.html'
], ($, c, template) ->

    class ConceptSearch extends c.Marionette.ItemView
        className: 'concept-search'

        ui: 
            input:  '.search-input'

        template: template

        onRender: ->
            url = c.data.concepts.url()
            search = $(@ui.input).typeahead
                name: 'Concepts'
                remote: "#{ url }?q=%QUERY"
                valueKey: 'label'
            search.on("typeahead:selected", (event, datum) ->
                c.publish c.CONCEPT_FOCUS, datum.id)

    { ConceptSearch }
