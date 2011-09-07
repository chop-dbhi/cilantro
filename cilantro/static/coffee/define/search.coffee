define ['common/views/collection', 'common/models/state', 'common/views/state'], (collectionview, statemodel, stateview) ->

    class Result extends statemodel.Model

    class ResultCollection extends Backbone.Collection
        model: Result

        url: App.urls.criteria

        query: (query) ->
            $.get @url, q: query, (ids) =>
                @each (model) ->
                    if model.id in ids then model.enable() else model.disable()



    class ResultItemView extends stateview.View
        template: _.template '<span class="name"><%= name %></span>
            <br><span class="info"><%= domain.name %></span>'

        events:
            'click': 'click'

        render: ->
            @el.html @template @model.toJSON()
            @

        click: ->
            App.hub.publish 'concept/request', @model.id
            return false


    class ResultListView extends collectionview.View
        el: '#concept-search-results'
        viewClass: ResultItemView

        noResults: $('<div class="info">No results found</div>').hide()

        elements:
            '.content': 'content'

        events:
            'mouseenter': 'mouseenter'
            'mouseleave': 'mouseleave'

        initialize: (options) ->
            if not @input
                @input = new InputView
                @input.results = @
                @content.append @noResults
            @render()
            super

        insertChild: (view) ->
            @content.append view.el

        render: ->
            @el.appendTo 'body'
            @reposition()
            $(window).bind 'resize', @reposition
            @

        reposition: =>
            rWidth = @el.outerWidth()
            iOffset = @input.el.offset()
            iHeight = @input.el.outerHeight()
            iWidth = @input.el.outerWidth()

            @el.css
                top: iOffset.top + iHeight + 5
                left: iOffset.left - (rWidth - iWidth) / 2.0

        query: (value) ->
            xhr = @collection.query value
            xhr.success (ids) =>
                if ids.length
                    @noResults.hide()
                else
                    @noResults.show()

        mouseenter: ->
            @entered = true

        mouseleave: ->
            @entered = false
            @hide() if not @input.focused

        show: ->
            @el.fadeIn('fast')

        hide: ->
            @el.fadeOut('fast')


    class InputView extends Backbone.View
        el: '#concept-search'

        elements:
            ':parent': 'form'

        events:
            'focus': 'focus'
            'blur': 'blur'
            'keyup': 'keyup'

        focus: ->
            @focused = true
            if @el.val() isnt ''
                @results.show()

        blur: ->
            @focused = false
            if not @results.entered
                @results.hide()

        keyup: ->
            @results.show()
            clearTimeout @_searchTimer
            @_searchTimer = setTimeout =>
                @results.query @el.val()
            , 200


    $ ->
        collection = new ResultCollection

        results = new ResultListView
            collection: collection

        collection.fetch()
