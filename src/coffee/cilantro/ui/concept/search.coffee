define [
    'underscore'
    '../search'
], (_, search)->


    class ConceptSearch extends search.Search
        className: 'concept-search search'

        options:
            placeholder: 'Search by name, description, or data...'

        onRender: ->
            super
            @ui.input.on 'keyup', _.debounce =>
                query = @ui.input.val()
                if query
                    @collection.search query, (resp) =>
                        @options.handler(query, resp)
                else
                    @options.handler(null, [])
            , 300


    { ConceptSearch }
