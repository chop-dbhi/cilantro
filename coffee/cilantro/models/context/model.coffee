define [
    '../../core'
    './nodes'
], (c, nodes) ->

    contextNodeModels =
        branch: nodes.BranchNodeModel
        condition: nodes.ConditionNodeModel
        composite: nodes.CompositeNodeModel


    # Returns the node type for attrs or throws an error if none can be
    # determined
    getContextNodeType = (attrs, options) ->
        if attrs instanceof nodes.ContextNodeModel
            return attrs.nodeType
        for type, model of contextNodeModels
            if not model::validate.call(attrs, attrs, options)
                return type
        throw new nodes.ContextNodeError 'Unknown context node type'


    # Class-level method for create a node instance of the specified type
    nodes.ContextNodeModel.create = (type, attrs, options) ->
        # No type provided, infer the type and validate
        if typeof type is 'object'
            attrs = type
            type = getContextNodeType(attrs, options)
        if not (klass = contextNodeModels[type])?
            throw new nodes.ContextNodeError 'Unknown context node type'
        return new klass(attrs, options)


    class ContextModel extends c.Backbone.Model
        url: ->
            if @isNew() then return super
            return @get('_links').self.href

        constructor: (attrs, options={}) ->
            @root = new nodes.BranchNodeModel
            options.parse = true
            super(attrs, options)

        initialize: ->
            @on 'request', ->
                c.publish c.CONTEXT_SYNCING, @

            @on 'sync', ->
                @resolve()
                c.publish c.CONTEXT_SYNCED, @, 'success'

            # If the sync fails on the server
            @on 'error', ->
                c.publish c.CONTEXT_SYNCED, @, 'error'

            # Notify subscribers the this object has changed
            @on 'change', ->
                c.publish c.CONTEXT_CHANGED, @

            # Pause syncing with the server
            c.subscribe c.CONTEXT_PAUSE, (id) =>
                if @id is id or not id and @isSession()
                    @pending()

            # Resume syncing with the server
            c.subscribe c.CONTEXT_RESUME, (id) =>
                if @id is id or not id and @isSession()
                    @resolve()

            # Clear all nodes from the context
            c.subscribe c.CONTEXT_CLEAR, (id) =>
                if @id is id or not id and @isSession()
                    @clear()

            c.subscribe c.CONTEXT_SAVE, (id) =>
                if @id is id or not id and @isSession()
                    @save()

            @resolve()

        parse: (resp) =>
            if (attrs = resp.json)?
                # This is for legacy responses where the root node has not
                # been correctly defined
                if attrs.concept? or attrs.field?
                    @root.children.add(attrs)
                else
                    @root.set(attrs, save: true)
                delete resp.json
            return resp

        save: ->
            @root.save()
            super

        toJSON: ->
            attrs = super
            attrs.json = @root.public.toJSON()
            return attrs

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'


    class ContextCollection extends c.Backbone.Collection
        model: ContextModel

        url: ->
            c.getSessionUrl('contexts')

        initialize: ->
            super
            c.subscribe c.SESSION_OPENED, =>
                @fetch(reset: true).done =>
                    @ensureSession()
                    @resolve()
            c.subscribe c.SESSION_CLOSED, => @reset()

        getSession: ->
            (@filter (model) -> model.get 'session')[0]

        hasSession: ->
            !!@getSession()

        ensureSession: ->
            if not @hasSession()
                defaults = session: true
                defaults.json = c.getOption('defaults.context')
                @create defaults


    { ContextModel, ContextCollection }
