define [
    'underscore'
    'marionette'
    './base'
    'tpl!templates/paginator.html'
], (_, Marionette, base, templates...) ->

    templates = _.object ['links'], templates


    class EmptyPage extends base.EmptyView
        message: 'No page results'


    class LoadingPage extends base.LoadView
        message: 'Loading page...'


    # Set of pagination links that are used to control/navigation the bound
    # model.
    #
    # The model is assumed to implement the 'paginator protocol', see
    # cilantro/models/paginator
    class Paginator extends Marionette.ItemView
        template: templates.links

        requestDelay: 250

        className: 'paginator'

        ui:
            first: '[data-page=first]'
            prev: '[data-page=prev]'
            next: '[data-page=next]'
            last: '[data-page=last]'
            pageCount: '.page-count'
            currentPage: '.current-page'
            buttons: '[data-toggle=tooltip]'

        modelEvents:
            'change:pagecount': 'renderPageCount'
            'change:currentpage': 'renderCurrentPage'

        events:
            'click [data-page=first]': 'requestChangePage'
            'click [data-page=prev]': 'requestChangePage'
            'click [data-page=next]': 'requestChangePage'
            'click [data-page=last]': 'requestChangePage'

        initialize: ->
            @_changePage = _.debounce(@changePage, @requestDelay)

        onRender: ->
            # The tooltip call MUST be done before the render calls below or
            # the tooltip options set here will not be respected because some
            # of the buttons will be disabled.
            @ui.buttons.tooltip({animation: false, placement: 'bottom'})

            if not @model.pageIsLoading()
                @renderPageCount(@model, @model.getPageCount())
                @renderCurrentPage(@model, @model.getCurrentPageStats()...)

        renderPageCount: (model, value, options) ->
            @ui.pageCount.text(value)

        renderCurrentPage: (model, value, options) ->
            @ui.currentPage.text(value)
            @ui.first.prop('disabled', !!options.first)
            @ui.prev.prop('disabled', !!options.first)
            @ui.next.prop('disabled', !!options.last)
            @ui.last.prop('disabled', !!options.last)

            # If we have disabled the buttons then we need to force hide the
            # tooltip to prevent it from being permanently visible
            if !!options.first
                @ui.first.tooltip('hide')
                @ui.prev.tooltip('hide')
            if !!options.last
                @ui.next.tooltip('hide')
                @ui.last.tooltip('hide')

        changePage: (newPage) ->
            switch newPage
                when "first" then @model.getFirstPage()
                when "prev" then @model.getPreviousPage()
                when "next" then @model.getNextPage()
                when "last" then @model.getLastPage()
                else throw new Error "Unknown paginator direction: #{ newPage }"

        requestChangePage: (event) ->
            @_changePage $(event.currentTarget).data('page')


    # Page for containing model-based data
    class Page extends Marionette.ItemView


    # Page for containing collection-based data
    class ListingPage extends Marionette.CollectionView
        itemView: Page

        emptyPage: EmptyPage

        itemViewOptions: (item, index) ->
            _.defaults
                model: item
                index: index
            , @options


    # Renders multiples pages as requested, but only shows the current
    # page. This is delegated by the paginator-based collection bound to
    # this view.
    #
    # The contained views may be model-based or collection-based. This is
    # toggled based on the `options.list` flag. If true, the `listView`
    # will be used as the item view class. Otherwise the standard `itemView`
    # will be used for model-based data.
    #
    # If list is true, the `listViewOptions` will be called to produce the
    # view options for the collection view. By default the item passed in
    # is assumed to have an `items` collection on it that will be used.
    class PageRoll extends Marionette.CollectionView
        options:
            list: true

        itemView: Page

        listView: ListingPage

        # The first page is guaranteed (assumed) to be fetch and rendered,
        # thus the empty view for the page roll is the loading state.
        emptyView: LoadingPage

        # Toggle between the list-based vs. item-based page roll
        getItemView: ->
            if @options.list then @listView else @itemView

        listViewOptions: (item, index) ->
            collection: item.items

        itemViewOptions: (item, index) ->
            options = model: item, index: index
            if @options.list
                _.extend options, @listViewOptions(item, index)
            _.defaults options, @options

        collectionEvents:
            'change:currentpage': 'showCurentPage'

        showCurentPage: (model, num, options) ->
            @children.each (view) ->
                view.$el.toggle(view.model.id is num)


    { Paginator, Page, ListingPage, PageRoll }
