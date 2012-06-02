define [
    'environ'
    'mediator'
    'underscore'
    'serrano'
], (environ, mediator, _, Serrano) ->

    class DataContexts extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/'

        initialize: ->
            @deferred = @fetch()

        getNamed: ->
            @filter (model) -> model.get('name')


    class DataContextHistory extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/history/'

         initialize: ->
            @deferred = @fetch()

    App.DataContext = new DataContexts
    App.DataContextHistory = new DataContextHistory

    # Special treatment for the session
    App.DataContext.deferred.done ->
        session = App.DataContext.getSession()
        if not session
            session = App.DataContext.create session: true

        session.on 'sync', ->
            mediator.publish 'datacontext/change'

