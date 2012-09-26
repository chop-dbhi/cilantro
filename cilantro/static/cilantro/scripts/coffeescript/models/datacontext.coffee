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
                else
                    # Initial publish of being synced since Backbone does
                    # not consider a fetch or reset to be a _sync_ operation
                    # in this version. This has been changed in Backbone
                    # @ commit 1f3f4525
                    mediator.publish 'datacontext/synced'

                @session.on 'sync', =>
                    mediator.publish 'datacontext/synced'

                mediator.subscribe 'datacontext/changed', =>
                    mediator.publish 'datacontext/syncing'
                    @session.save()

                mediator.subscribe 'datacontext/remove', (node) =>
                    @session.remove node

                mediator.subscribe 'datacontext/add', (node) =>
                    @session.add node

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
