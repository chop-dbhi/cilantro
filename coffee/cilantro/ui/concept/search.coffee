define [
    '../core'
    '../search'
], (c, search)->

    # Takes a collection of concepts to filter/get the concept model instances
    # for rendering
    class ConceptSearch extends search.Search
        className: 'concept-search search'

        events:
            'typeahead:selected input': 'focusConcept'
            'typeahead:autocompleted input': 'focusConcept'

        options: ->
            url = c.data.concepts.url()

            return {
                name: 'Concepts'
                valueKey: 'name'
                limit: 10
                remote:
                    url: "#{ url }?query=%QUERY&brief=1"
                    filter: (resp) =>
                        datums = []
                        c._.each resp, (datum) =>
                            if @collection.get(datum.id)
                                datums.push(datum)
                        return datums
            }

        focusConcept: (event, datum) ->
            c.publish c.CONCEPT_FOCUS, datum.id


    { ConceptSearch }
