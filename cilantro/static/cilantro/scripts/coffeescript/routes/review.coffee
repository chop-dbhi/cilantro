define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'

    'serrano/channels'
    'views/columns'
    'views/table'
], (environ, mediator, $, _, Backbone, channels, Columns, Table) ->

    modifyColumnsButton = _.template '<button class=btn title="Show/Hide Columns"><i class=icon-list alt="Show/Hide Columns"></i></button>'

    class ReviewArea extends Backbone.View
        id: 'review-area'

        options:
            perPage: 100

        events:
            'click table thead th': 'sort'
            'click .pinned-thead div': 'sort'

        deferred:
            loadData: true

        initialize: ->
            super
            @$el
                .hide()
                .appendTo('#main-area .inner')

            @$toolbar = $('<ul>')
                .addClass('nav pull-right')
                .hide()
                .appendTo '#subnav .container-fluid'

            @columns = new Columns
                collection: App.DataConcept

            @columns.$el
                .appendTo('body')

            $modifyColumns = $(modifyColumnsButton()).on 'click', (event) =>
                @columns.show()

            @$toolbar
                .append $('<li>').html($modifyColumns)

            @table = new Table
            @$el.append @table.el
            @table.$('#report-table').scroller
                autofill: true
                container: @table.$el
                trigger: =>
                    @loadData true

            mediator.subscribe channels.DATAVIEW_SYNCED, =>
                @loadData()

            mediator.subscribe channels.DATACONTEXT_SYNCED, =>
                @loadData()

            @page = 1
            @perPage = @options.perPage

            @loadData()

        load: ->
            @$el.fadeIn 100
            @$toolbar.fadeIn 100
            # Reset the scroll position from the last state
            if @tableScrollTop then @table.$el.scrollTop(@tableScrollTop)

        unload: ->
            # Track the scroll position since it resets when the element is hidden
            @tableScrollTop = @table.$el.scrollTop()
            @$el.hide()
            @$toolbar.hide()

        loadData: (append=false) =>
            # Check if the lastest page is the last page
            if append and @page is @numPages then return

            url = "#{ App.urls.preview }?per_page=#{ @perPage }"

            if append
                url = "#{ url }&page=#{ @page + 1 }"
            else
                @table.$el.addClass 'loading'

            Backbone.ajax
                url: url
                success: (resp) =>
                    if append
                        @page++
                    else
                        @page = 1
                        @numPages = resp.num_pages
                        @table.setHeader resp.keys
                    @table.setBody resp.objects, append
                complete: =>
                    @table.$el.removeClass 'loading'
                    @table.$('#report-table').scroller 'reset'

        sort: (event) ->
            $target = $(event.target)

            if not (prev = $target.data 'direction')
                direction = 'asc'
            else if prev is 'asc'
                direction = 'desc'
            else
                direction = null
            $target.data 'direction', direction
            $target.removeClass(prev).addClass direction

            if direction
                ordering = [[$target.data('id'), direction]]
            else
                ordering = []
            mediator.publish channels.DATAVIEW_ORDERING, ordering
