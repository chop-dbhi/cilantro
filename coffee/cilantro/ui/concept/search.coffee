define [
    '../core'
    'tpl!templates/views/concept-search.html'
], (c, templates...) ->

    templates = c._.object ['search'], templates


    class ConceptSearch extends c.Marionette.ItemView
        className: 'concept-search'

        template: templates.search

        ui:
            input:  'input'

        onRender: ->
            c.data.concepts.when =>
                url = c.data.concepts.url()

                search = @ui.input.typeahead
                    name: 'Concepts'
                    remote: "#{ url }?query=%QUERY&brief=1"
                    valueKey: 'name'
                    filter: (resp) =>
                        c._.filter resp, (datum) =>
                            @collection.get(datum)

                search.on 'typeahead:selected', (event, datum) ->
                    c.publish c.CONCEPT_FOCUS, datum.id


    { ConceptSearch }
