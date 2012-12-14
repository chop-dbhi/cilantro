define [
    'underscore'
    'serrano'
], (_, Serrano) ->

    class DataContexts extends Serrano.DataContexts
        url: App.urls.datacontexts


    class DataContextHistory extends Serrano.DataContexts
        url: App.urls.datacontextHistory


    contexts = new DataContexts
    contexts.on 'reset', ->
        if not contexts.hasSession()
            defaults = session: true
            defaults.json = App.defaults.datacontext
            contexts.create defaults

    history = new DataContextHistory

    contexts.fetch()
    history.fetch()

    App.DataContext = contexts
