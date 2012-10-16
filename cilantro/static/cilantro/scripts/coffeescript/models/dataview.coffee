define [
    'underscore'
    'serrano'
], (_, Serrano) ->

    class DataViews extends Serrano.DataViews
        url: App.urls.dataviews


    class DataViewHistory extends Serrano.DataViews
        url: App.urls.dataviewHistory


    views = new DataViews
    views.on 'reset', ->
        if not views.hasSession()
            defaults = session: true
            defaults.json = App.defaults.dataview
            views.create defaults

    history = new DataViewHistory

    views.fetch()
    history.fetch()
