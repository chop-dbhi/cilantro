define [
    './core'
    'tpl!templates/views/paginator.html'
], (c, templates...) ->

    templates = c._.object ['links'], templates


    # Set of pagination links that are used to navigate the bound object.
    # The object is assumed to implement the 'paginator protocol'
    class Paginator extends c.Marionette.ItemView
        template: templates.links

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
            'click [data-page=first]': 'showFirstPage'
            'click [data-page=prev]': 'showPreviousPage'
            'click [data-page=next]': 'showNextPage'
            'click [data-page=last]': 'showLastPage'

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

        showFirstPage: (event) ->
            @model.getFirstPage()

        showLastPage: (event) ->
            @model.getLastPage()

        showNextPage: (event) ->
            @model.getNextPage()

        showPreviousPage: (event) ->
            @model.getPreviousPage()


    { Paginator }
