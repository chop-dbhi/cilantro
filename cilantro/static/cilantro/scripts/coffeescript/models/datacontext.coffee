define [
    'environ'
    'mediator'
    'underscore'
    'serrano'
], (environ, mediator, _, Serrano) ->

    class DataContexts extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/'

        initialize: ->
            super
            @on 'reset', ->
                # Special treatment for the session
                if not (@session = @getSession())
                    @session = @create session: true

                @session.on 'sync', =>
                    mediator.publish 'datacontext/change'

                @session.on 'change:json', =>
                    # Mute the change event, circular calls are bad..
                    @session.save null, silent: true

                mediator.subscribe 'datacontext/delete', (node) =>
                    @session.remove node

                mediator.subscribe 'datacontext/put', (node) =>
                    @session.add node

                mediator.subscribe 'datacontext/save', =>
                    mediator.publish 'datacontext/sync'
                    @session.save()

                # Resolve all pending handlers
                @resolve()

            @fetch()

    class DataContextHistory extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/history/'

         initialize: ->
            super
            @on 'reset', @resolve
            @fetch()


    App.DataContext = new DataContexts
    App.DataContextHistory = new DataContextHistory

    # Attach DataContextNode which can be used to create standalone nodes
    # and publish them to the session or other datacontext.
    App.Models.DataContextNode = Serrano.DataContextNode
