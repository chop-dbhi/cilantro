define [
    'underscore'
    'marionette'
    '../core'
    'tpl!templates/query/loader.html'
], (_, Marionette, c, templates...) ->

    templates = _.object ['loader'], templates

    class QueryLoader extends Marionette.ItemView
        className: 'query-loader'

        template: templates.loader

        ui:
            loadingMessage: '.loading-message'
            errorMessage: '.error-message'

        initialize: ->
            @data = {}

            if not (@data.context = @options.context)
                throw new Error 'context model required'
            if not (@data.view = @options.view)
                throw new Error 'view model required'
            if not (@data.queries = @options.queries)
                throw new Error 'queries collection required'

            @on 'router:load', @onRouterLoad

            @data.queries.on 'sync', @loadRequestedQuery

        onRouterLoad: (router, fragment, args...) =>
            @requestedQueryId = null
            if args? and args[0]?
                @requestedQueryId = parseInt(args[0])

        loadRequestedQuery: =>
            if @requestedQueryId?
                query = _.findWhere(@data.queries.models, {'id': @requestedQueryId})

                delete @requestedQueryId

                if query?
                    @data.view.save('json', query.get('view_json'))
                    @data.context.save('json', query.get('context_json'), reset: true)
                    c.router.navigate('results', trigger: true)
                else
                    @ui.loadingMessage.hide()
                    @ui.errorMessage.show()

    { QueryLoader }
