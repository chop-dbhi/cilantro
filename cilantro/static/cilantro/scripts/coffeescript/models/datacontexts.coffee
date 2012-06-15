define [
    'environ'
    'mediator'
    'underscore'
    'serrano'
], (environ, mediator, _, Serrano) ->

    class DataContexts extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/'

        initialize: ->
            @pending()
            @on 'reset', -> @resolve()
            @fetch()

        getNamed: ->
            @filter (model) -> model.get('name')


    class DataContextHistory extends Serrano.DataContexts
        url: environ.absolutePath '/api/contexts/history/'

         initialize: ->
            @pending()
            @on 'reset', -> @resolve()
            @fetch()


    App.DataContext = new DataContexts
    App.DataContextHistory = new DataContextHistory

    App.Models.DataContextNode = Serrano.DataContextNode

    # Special treatment for the session
    App.DataContext.when ->
        if not (session = App.DataContext.getSession())
            session = App.DataContext.create session: true

        App.DataContext.session = session

        session.on 'sync', ->
            mediator.publish 'datacontext/change'

        session.on 'change:json', ->
            # Mute the change event, circular calls are bad..
            session.save null, silent: true

        mediator.subscribe 'datacontext/remove', (node) ->
            session.remove node

        mediator.subscribe 'datacontext/add', (data) ->
            if session.isCondition() or session.isComposite()
                session.promote null, data
            else
                session.add null, data
