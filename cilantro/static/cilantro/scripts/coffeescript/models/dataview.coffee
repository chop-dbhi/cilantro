define [
    'serrano'
], (Serrano) ->

    class DataViews extends Serrano.DataViews
        url: App.urls.dataviews


    class DataViewHistory extends Serrano.DataViews
        url: App.urls.dataviewHistory


    views = new DataViews
    views.on 'reset', ->
        if not views.hasSession()
            views.create session: true

    history = new DataViewHistory

    views.fetch()
    history.fetch()
