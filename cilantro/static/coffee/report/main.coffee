define 'cilantro/report/main', ['cilantro/main'], ->

    App = window.App
    if not App
        window.App = App = {}

    App.hub = new PubSub
