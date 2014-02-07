define [
    'underscore'
    'marionette'
    '../core'
], (_, Marionette, c) ->

    class QueryLoader extends Marionette.ItemView
        className: 'query-loader'

        template: 'query/loader'

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

        onRouterLoad: (router, fragment, id) =>
            @requestedQueryId = parseInt(id) or null

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
