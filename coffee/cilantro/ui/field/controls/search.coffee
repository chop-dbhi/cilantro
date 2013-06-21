define [
    '../../core'
    '../../../models'
    '../../controls'
    '../../paginator'
    '../../values'
    '../../search'
    'tpl!templates/search.html'
    'tpl!templates/field/controls/multi-value-item.html'
    'tpl!templates/field/controls/multi-value-search.html'
], (c, models, controls, paginator, values, search, templates...) ->

    templates = c._.object ['search', 'item', 'layout'], templates


    # Single page of values
    class SearchPageModel extends models.Page
        constructor: (attrs, options={}) ->
            options.parse = true
            @items = new models.Values
            super(attrs, options)

        parse: (resp, options) ->
            @items.reset(resp.values, options)
            delete resp.values
            return resp


    # Paginator (collection) of pages which is driven by a field values
    # endpoint.
    class SearchPaginator extends models.Paginator
        model: SearchPageModel

        initialize: (models, options={}) ->
            @field = options.field
            super(models, options)

        url: ->
            url = @field.links.values
            if @urlParams? then url = "#{ url }?#{ c.$.param(@urlParams) }"
            return url


    # View for querying field values
    class ValueSearch extends search.Search
        className: 'field-search search'

        template: templates.search

        ui:
            input: 'input'

        events:
            'keydown input': 'search'

        initialize: ->
            super
            @paginator = @options.paginator
            @search = c._.debounce(@search, 300)

        search: (event) ->
            value = @ui.input.val()
            if value
                @paginator.urlParams = query: value
            else
                @paginator.urlParams = null
            @paginator.refresh()


    # Single search result item
    class SearchItem extends c.Marionette.ItemView
        className: 'value-item'

        template: templates.item

        ui:
            actions: '.actions'

        events:
            'click button': 'addItem'

        constructor: (options={}) ->
            if (@values = options.values)
                @listenTo @values, 'add', @setState, @
                @listenTo @values, 'remove', @setState, @
                @listenTo @values, 'reset', @setState, @
            super(options)

        addItem: ->
            # Mark as valid since it was derived from a controlled list
            attrs = c._.extend @model.toJSON(), valid: true
            @values.add(attrs)

        setState: ->
            @$el.toggleClass('disabled', !!@values.get(@model))

        onRender: ->
            @setState()


    # A single page of search results
    class SearchPage extends paginator.ListingPage
        className: 'search-value-list'

        itemView: SearchItem


    # All search result pages, only the current page is shown, the rest are
    # hidden.
    class SearchPageRoll extends paginator.PageRoll
        listView: SearchPage


    class FieldValueSearch extends controls.Control
        className: 'field-value-search'

        template: templates.layout

        regions:
            search: '.search-region'
            paginator: '.paginator-region'
            browse: '.browse-region'
            values: '.values-region'

        initialize: (options) ->
            super(options)
            # Initialize a new collection of values for use by the
            # two regions.
            if not @collection
                @collection = new models.Values
                @collection.url = =>
                    @model.links.values

            # Trigger a change event on all collection events
            @collection.on 'all', @change, @

            @valuesPaginator = new SearchPaginator null,
                field: @model

            @valuesPaginator.refresh()

        onRender: ->
            @search.show new ValueSearch
                model: @model
                paginator: @valuesPaginator
                placeholder: "Search #{ @model.get('plural_name') }..."

            @browse.show new SearchPageRoll
                collection: @valuesPaginator
                values: @collection

            @paginator.show new paginator.Paginator
                className: 'paginator mini'
                model: @valuesPaginator

            @values.show new values.ValueList
                collection: @collection

            # TODO move this elsewhere, look in cilantro/ui/controls/base
            # Set the values from the context
            @set(@context)

        # This is currently always an 'in', however 'not in' may be
        # desirable as well.
        getOperator: -> 'in'

        # Returns an array of objects with value and label attributes.
        # These are returned as is to enable correct repopulation.
        getValue: ->
            @collection.toJSON()

        setValue: (value) ->
            # Do not merge into existing models since the collection contains
            # additional state (which would be removed due to the merge).
            @collection.set(value, merge: false)


    { FieldValueSearch }
