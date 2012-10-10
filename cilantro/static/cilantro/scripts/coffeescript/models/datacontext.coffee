define [
    'serrano'
], (Serrano) ->

    class DataContexts extends Serrano.DataContexts
        url: App.urls.datacontexts


    class DataContextHistory extends Serrano.DataContexts
        url: App.urls.datacontextHistory


    contexts = new DataContexts
    contexts.on 'reset', ->
        if not contexts.hasSession()
            contexts.create session: true

    history = new DataContextHistory

    contexts.fetch()
    history.fetch()
