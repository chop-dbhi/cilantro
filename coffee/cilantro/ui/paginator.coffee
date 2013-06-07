define [
    './core'
    'tpl!templates/views/paginator.html'
], (c, templates...) ->

    templates = c._.object ['links'], templates


    # Set of pagination links that are used to navigate the bound object.
    # The object is assumed to implement the 'paginator protocol'
    class Paginator extends c.Marionette.ItemView
        template: templates.links

        requestDelay: 250 # In milliseconds

        className: 'paginator'

        ui:
            first: '[data-page=first]'
            prev: '[data-page=prev]'
            next: '[data-page=next]'
            last: '[data-page=last]'
            pageCount: '.page-count'
            currentPage: '.current-page'

        modelEvents:
            'change:pagecount': 'renderPageCount'
            'change:currentpage': 'renderCurrentPage'

        events:
            'click [data-page=first]': 'requestChangePage'
            'click [data-page=prev]': 'requestChangePage'
            'click [data-page=next]': 'requestChangePage'
            'click [data-page=last]': 'requestChangePage'

        initialize: ->
            @_changePage = c._.debounce(@changePage, @requestDelay)

        onRender: ->
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

        changePage: (newPage) ->
            switch newPage
                when "first" then @model.getFirstPage()
                when "prev" then @model.getPreviousPage()
                when "next" then @model.getNextPage()
                when "last" then @model.getLastPage()
                else console.log "Unknown paginator direction: #{ newPage }"

        requestChangePage: (event) ->
            @_changePage $(event.target).data('page')
                    

    { Paginator }
