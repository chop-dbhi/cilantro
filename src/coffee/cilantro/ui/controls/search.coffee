define [
    'underscore'
    'marionette'
    './base'
    '../../models'
    '../../constants'
    '../paginator'
    '../values'
    '../search'
], (_, Marionette, base, models, constants, paginator, values, search) ->

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
            if @urlParams? then url = "#{ url }?#{ $.param(@urlParams) }"
            return url


    # View for querying field values
    class ValueSearch extends search.Search
        className: 'field-search search'

        ui:
            input: 'input'

        events:
            'keydown input': 'search'

        initialize: ->
            super
            @paginator = @options.paginator
            @search = _.debounce(@search, constants.INPUT_DELAY)

        search: (event) ->
            value = @ui.input.val()
            if value
                @paginator.urlParams = query: value
            else
                @paginator.urlParams = null
            @paginator.refresh()


    # Single search result item
    class SearchItem extends Marionette.ItemView
        className: 'value-item'

        template: 'controls/search/item'

        ui:
            actions: '.actions'
            addButton: '.add-item-button'
            removeButton: '.remove-item-button'

        events:
            'click .add-item-button': 'addItem'
            'click .remove-item-button': 'removeItem'

        constructor: (options={}) ->
            if (@values = options.values)
                @listenTo @values, 'add', @setState, @
                @listenTo @values, 'remove', @setState, @
                @listenTo @values, 'reset', @setState, @
            super(options)

        addItem: ->
            # Mark as valid since it was derived from a controlled list
            attrs = _.extend @model.toJSON(), valid: true
            @values.add(attrs)

        removeItem: ->
            @values.remove(@model)

        setState: ->
            if !!@values.get(@model)
                @ui.addButton.hide()
                @ui.removeButton.show()
            else
                @ui.addButton.show()
                @ui.removeButton.hide()

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


    class SearchControl extends base.Control
        className: 'field-value-search'

        template: 'controls/search/layout'

        searchPaginator: SearchPaginator

        regions:
            search: '.search-region'
            paginator: '.paginator-region'
            browse: '.browse-region'
            values: '.values-region'

        regionViews:
            search: ValueSearch
            paginator: paginator.Paginator
            browse: SearchPageRoll
            values: values.ValueList

        initialize: (options) ->
            # Initialize a new collection of values for use by the
            # two regions. This is shared between the source data
            # and the selected values for toggling state changes.
            if not @collection
                @collection = new models.Values
                @collection.url = => @model.links.values

            # Trigger a change event on all collection events
            @collection.on('all', @change, @)

            @valuesPaginator = new @searchPaginator null,
                field: @model

            @valuesPaginator.refresh()

        onRender: ->
            @search.show new @regionViews.search
                model: @model
                paginator: @valuesPaginator
                placeholder: "Search #{ @model.get('plural_name') }..."

            @browse.show new @regionViews.browse
                collection: @valuesPaginator
                values: @collection

            @paginator.show new @regionViews.paginator
                className: 'paginator mini'
                model: @valuesPaginator

            @values.show new @regionViews.values
                collection: @collection

            @set(@context)


        getField: -> @model?.id

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


    { SearchControl, ValueSearch, SearchItem, SearchPage, SearchPageRoll, SearchPaginator }
