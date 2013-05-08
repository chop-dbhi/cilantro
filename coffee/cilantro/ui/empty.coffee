define [
    './core'
], (c) ->

    loader = -> '<div class="loader"><i class="icon-spinner icon-spin"></i></div>'

    class EmptyView extends c.Marionette.ItemView
        options:
            loader: true
            message: ''

        constructor: ->
            super

            if not @template?
                if @options.loader
                    @template = loader
                else if @options.message
                    @template = -> @options.message

            @$el.addClass('empty-view')


    { EmptyView }
