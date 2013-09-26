define [
    '../../core'
    '../base'
    './manager'
    './nodes'
], (c, base, manager, nodes) ->


    contextNodeModels =
        branch: nodes.BranchNodeModel
        condition: nodes.ConditionNodeModel
        composite: nodes.CompositeNodeModel


    # Returns the node type for attrs. If none can be inferred, the default is
    # the condition type.
    getContextNodeType = (attrs, options) ->
        if attrs instanceof nodes.ContextNodeModel
            return attrs.type
        for type, model of contextNodeModels
            if not model::validate.call(attrs, attrs, options)
                return type
        return 'condition'


    # Class-level method for create a node instance of the specified type
    nodes.ContextNodeModel.create = (attrs, options) ->
        # No type provided, infer the type and validate
        type = options.type or getContextNodeType(attrs, options)
        if not (klass = contextNodeModels[type])?
            throw new nodes.ContextNodeError 'Unknown context node type'
        return new klass(attrs, options)


    class ContextModel extends base.Model
        managerEventPrefix: 'tree'

        initialize: ->
            @manager = new manager.ContextTreeManager(@)

            # Proxy events from manager through model
            @listenTo @manager, 'all', (manager, event, args...) =>
                @trigger("#{ @managerEventPrefix }:#{ event }", args...)

            @on 'sync', ->
                c.publish c.CONTEXT_SYNCED, @, 'success'

            @on 'change:json', (model, value, options) ->
                @manager.set(value, options)


        toJSON: (options={}) ->
            attrs = super
            attrs.json = @manager.toJSON()
            return attrs

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'


    class ContextCollection extends base.Collection
        model: ContextModel

        url: ->
            c.session.url('contexts')

        initialize: ->
            c.subscribe c.SESSION_OPENED, =>
                @fetch(reset: true).done =>
                    @ensureSession()
            c.subscribe c.SESSION_CLOSED, => @reset()

            @on 'reset', ->
                c.promiser.resolve('contexts')

        getSession: ->
            (@filter (model) -> model.get 'session')[0]

        hasSession: ->
            !!@getSession()

        ensureSession: ->
            if not @hasSession()
                defaults = session: true
                defaults.json = c.config.get('defaults.context')
                @create defaults


    { ContextModel, ContextCollection }
