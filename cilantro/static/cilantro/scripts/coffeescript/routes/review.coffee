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
            @table.$el.scroller
                relative: 'table'
                trigger: =>
                    @loadData true

            mediator.subscribe channels.DATAVIEW_SYNCED, =>
                @loadData()

            mediator.subscribe channels.DATACONTEXT_SYNCED, =>
                @loadData()

            @page = 1
            @defer 'loadData'

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
            if @page is @num_pages then return

            url = '/api/data/'

            if append
                url = url + '?page=' + (@page + 1)
            else
                @table.$el.addClass 'loading'

            @xhr = Backbone.ajax
                url: environ.absolutePath url
                success: (resp) =>
                    if append
                        @page++
                    else
                        @page = 1
                        @num_pages = resp.num_pages
                        @table.setHeader resp.header
                    @table.setBody resp.rows, append
                complete: =>
                    @table.$el.removeClass 'loading'
                    @table.$el.scroller 'reset'

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
