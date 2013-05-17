define [
    '../core'
    '../structs'
], (c, structs) ->


    class Results extends structs.Frame
        url: ->
            c.getSessionUrl('preview')

        initialize: ->
            super
            @resolve()
            c.subscribe c.SESSION_OPENED, @refresh
            c.subscribe c.SESSION_CLOSED, @reset
            c.subscribe c.CONTEXT_SYNCED, @refresh
            c.subscribe c.VIEW_SYNCED, @refresh

        refresh: =>
            if not @isPending()
                @pending()
                @fetch(reset: true).done =>
                    @resolve()


    { Results }
