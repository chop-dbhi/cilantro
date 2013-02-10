define ['../core', 'serrano'], (c, Serrano) ->
    
    class ViewModel extends Serrano.ViewModel

    class ViewCollection extends Serrano.ViewCollection
        url: ->
            c.getSessionUrl('views')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, =>
                @fetch().done => @ensureSession()
            c.subscribe c.SESSION_CLOSED, => @reset()

        ensureSession: ->
            if not @hasSession()
                defaults = session: true
                defaults.json = cilantro.getOption('defaults.view')
                @create defaults

    { ViewCollection, ViewModel }
