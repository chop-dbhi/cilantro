define [
    './core'
], (c) ->

    loader = '<div class="loader"><i class="icon-spinner icon-spin"></i></div>'

    class EmptyView extends c.Marionette.ItemView
        options:
            loader: true
            message: ''

        constructor: ->
            super

            if not @template?
                if @options.template
                    @template = @options.template
                else
                    html = []

                    if @options.loader
                        html.push loader
                    if @options.message
                        html.push @options.message

                    @template = -> html.join ' '

            @$el.addClass('empty-view')


    { EmptyView }
