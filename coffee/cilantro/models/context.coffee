define ['../core', 'serrano'], (c, Serrano) ->
    
    class ContextNodeModel extends Serrano.ContextNodeModel
    
    class ContextModel extends Serrano.ContextModel
        nodeModel: ContextNodeModel

    class ContextCollection extends Serrano.ContextCollection
        model: ContextModel
        
        url: ->
            c.getSessionUrl('contexts')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, =>
                @fetch().done => @ensureSession()
            c.subscribe c.SESSION_CLOSED, => @reset()

        ensureSession: ->
            if not @hasSession()
                defaults = session: true
                defaults.json = c.getOption('defaults.context')
                @create defaults

    { ContextCollection, ContextNodeModel, ContextModel }
