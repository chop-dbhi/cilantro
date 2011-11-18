define [
    'backbone'
    'common/views/collection'
    'common/models/state'
    'common/views/state'
], (Backbone, collectionview, statemodel, stateview) ->

    class Result extends statemodel.Model

    class ResultCollection extends Backbone.Collection
        model: Result

        query: (query) ->
            @$.get @url, q: query, (ids) =>
                @each (model) ->
                    if model.id in ids then model.enable() else model.disable()


    class InputView extends Backbone.View
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


    class ResultListView extends collectionview.View
        inputViewClass: InputView

        defaultContent: '<div class="info">No results found</div>'

        elements:
            '.content': 'content'

        events:
            'mouseenter': 'mouseenter'
            'mouseleave': 'mouseleave'

        initialize: (options) ->
            if not @input
                @input = new @inputViewClass
                @input.results = @
                @defaultContent = @$(@defaultContent)
            @render()
            super

        insertChild: (view) ->
            @content.append view.el

        render: ->
            @el.appendTo 'body'
            @$(window).bind 'resize', @reposition
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
            @collection.query(value)
                .success (ids) =>
                    if ids.length
                        @defaultContent.detach()
                    else
                        @defaultContent.show().prependTo(@content)

        mouseenter: ->
            @entered = true

        mouseleave: ->
            @entered = false
            @hide() if not @input.focused

        show: ->
            @reposition()
            @el.fadeIn('fast')

        hide: ->
            @el.fadeOut('fast')


    return {
        ResultModel: Result
        ResultCollection: ResultCollection
        ResultListView: ResultListView
        InputView: InputView
    }
