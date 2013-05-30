define [
    '../core'
    '../structs'
], (c, structs) ->


    class Page extends structs.Frame
        idAttribute: 'page_num'

        url: ->
            "#{ @collection.url() }?page=#{ @id }&per_page=#{ @collection.perPage }"

        initialize: ->
            super
            @resolve()


    # Array of result frames (pages). The first fetch sets the state
    # of the collection including the frame size, number of possible
    # frames, etc. A refresh resets the collection as well as changes
    # to the frame size.
    class Results extends structs.FrameArray
        model: Page

        comparator: 'page_num'

        url: ->
            c.getSessionUrl('preview')

        initialize: ->
            super
            # Initially resolve to trigger pending on refresh
            # TODO this logic is odd and should be changed
            @resolve()
            c.subscribe c.SESSION_OPENED, @refresh
            c.subscribe c.SESSION_CLOSED, @reset
            c.subscribe c.CONTEXT_SYNCED, @refresh
            c.subscribe c.VIEW_SYNCED, @refresh

        refresh: =>
            if not @isPending()
                @pending()
                @fetch(reset: true).done =>
                    @resolve()
                    @setCurrentPage(@models[0].id)

        # Parses the initial fetch which is a single page, resets if necessary
        parse: (resp, options) ->
            if @perPage isnt resp.per_page
                if not options.reset
                    # TODO Smartly update frames when size changes
                    # The data is not invalid, just broken up differently
                    @reset(null, silent: true)
                @currentPageNum = null
                @perPage = resp.per_page
                @trigger('change:pagesize', @, @perPage)

            if @numPages isnt resp.num_pages
                @numPages = resp.num_pages
                @trigger('change:pagecount', @, @numPages)

            super([resp])

        # Ensures `num` is within the bounds
        hasPage: (num) ->
            1 <= num <= @numPages

        # Checks the a _next_ page exists for num (or the current page)
        hasNextPage: (num=@currentPageNum) ->
            num < @numPages

        # Checks the a _previous_ page exists for num (or the current page)
        hasPreviousPage: (num=@currentPageNum) ->
            num > 1

        # Set the current page which triggers the 'change:page' event
        setCurrentPage: (num) ->
            if num is @currentPageNum then return
            if not @hasPage(num)
                throw new Error 'Cannot set the current page out of bounds'

            @previousPageNum = @currentPageNum
            @currentPageNum = num

            @trigger 'change:currentpage', @, @getCurrentPageStats()...

        # Gets or fetches the page for num, if options.active is true
        # the page is set as the current one.
        # If the page does not already exist, the model is created, added
        # to the collected and fetched. Once fetched, the page is resolved.
        getPage: (num, options={}) ->
            if not @hasPage(num) then return

            if not (model = @get(num)) and options.load isnt false
                (model = new @model(page_num: num)).pending()
                @add(model)
                model.fetch().done =>
                    model.resolve()

            if model and options.active isnt false
                @setCurrentPage(num)

            return model

        getCurrentPage: (options) ->
            @getPage(@currentPageNum, options)

        getFirstPage: (options) ->
            @getPage(1, options)

        getLastPage: (options) ->
            @getPage(@numPages, options)

        # Gets the next page relative to the current page
        getNextPage: (num=@currentPageNum, options) ->
            @getPage(num + 1, options)

        # Gets the previous page relative to the current page
        getPreviousPage: (num=@currentPageNum, options) ->
            @getPage(num - 1, options)

        # Checks if the current page is pending. Use of this check prevents
        # stampeding the server with requests if the current one has not
        # responded yet
        pageIsLoading: (num=@currentPageNum) ->
            if (page = @getPage(num, active: false, load: false))
                return page.isPending()

        getPageCount: ->
            return @numPages

        getCurrentPageStats: ->
            [
                @currentPageNum
                previous: @previousPageNum
                first: @currentPageNum is 1
                last: @currentPageNum is @numPages
            ]


    { Results }
