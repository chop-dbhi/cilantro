define [
    '../core'
], (c) ->

    class ContextNodeError extends Error


    queryAttrs = (attrs, query) ->
        if attrs instanceof ContextNodeModel
            attrs = attrs.attributes
        if query.concept? and attrs.concept is query.concept
            return true
        if query.field? and attrs.field is query.field
            return true
        return false


    # Represents a single node within a ContextModel tree. Non-branch nodes
    # must be carefully handled and not removed from the tree unless explicitly
    # removed
    class ContextNodeModel extends c.Backbone.Model
        initialize: (options={}) ->
            # Save the initial state of the internal attributes
            @save(options)

        toJSON: ->
            @publicAttributes

        # Override to create a copy of the internal attributes for exposing
        # as `public` attributes. This will must be called to make
        # the attributes visible (via toJSON) for upstream callers
        save: (options) ->
            if (isValid = @isValid(options))
                @publicAttributes = c._.clone @attributes
            return isValid

        validate: (attrs, options) ->
            try
                model = getContextNodeModel(attrs)
                if not model.isValid(options)
                    return model.validationError
            catch error
                return error.message
            return

        isTyped: ->
            @attributes.field? or @attributes.concept?

        fetch: (query) ->
            if queryAttrs(@, query)
                return @


    # Branch-type node that acts as a container for other nodes. The `type`
    # determines the conditional relationship between the child nodes.
    class BranchNodeModel extends ContextNodeModel
        nodeType: 'branch'

        validate: (attrs, options) ->
            if not (attrs.type is 'and' or attrs.type is 'or')
                return 'Not a valid branch node'

            options = c._.extend deep: true, options

            # Recurse children and validate
            if options.deep
                for child in attrs.children
                    if child instanceof ContextNodeModel
                        if not child.isValid(options)
                            return child.validationError
                    else if (message = ContextNodeModel::validate.call(null, child, options))
                        return message
            return

        fetch: (query) ->
            if (node = super) then return node

            children = @get('children')
            for child, i in children
                if queryAttrs(child, query)
                    # If this a match, convert the child into an instance
                    # for downstream use.
                    if not (child instanceof ContextNodeModel)
                        child = children[i] = getContextNodeModel(child)
                    return child
            return

        # If this is a deep save, recursively save children prior to
        # creating a copy to publicAttributes.
        save: (options) ->
            options = c._.extend
                deep: true
                ignore: true
                strict: false
            , options

            if not super(deep: false) then return false

            attrs = @publicAttributes
            children = []

            # Recurse on children to ensure no node instances are present
            for child in attrs.children
                if child instanceof ContextNodeModel
                    # Save child node if the deep option is passed. If strict
                    # if true, any validation error will cause the save to fail
                    if options.deep
                        if child.save(options)
                            child = child.publicAttributes
                        else
                            if options.strict
                                return false
                            # Invalid children can be ignored (excluded from the array)
                            # otherwise the previous state is maintained
                            child = if options.ignore then null else child.publicAttributes
                    else
                        child = child.publicAttributes

                # Only if the child is not empty, append to the output
                if child? then children.push(child)

            attrs.children = children
            return true

        toJSON: ->
            attrs = super
            children = []
            # Recurse on children to ensure no node instances are present
            for child in attrs.children
                if child instanceof ContextNodeModel
                    child = child.toJSON()
                children.push(child)
            attrs.children = children
            return attrs

        # Adds variable number of nodes to branch ensuring the same node
        # is not added twice
        add: (nodes...) ->
            children = @get('children') or []

            for node in nodes
                if node is @
                    throw new ContextNodeError 'Cannot add self as child'
                if not (node instanceof ContextNodeModel)
                    throw new ContextNodeError 'Node must be an instance'
                if node not in children
                    children.push(node)

            @set('children', children)
            return @

        # Removes variable number of nodes from branch
        remove: (nodes...) ->
            children = @get('children') or []

            for node in nodes
                if not (node instanceof ContextNodeModel)
                    throw new ContextNodeError 'Node must be an instance'
                if (idx = children.indexOf node) >= 0
                    children.pop(idx)

            @set('children', children)
            return @

        clear: (options) ->
            options = c._.extend
                deep: true
                destroy: false
            , options

            if options.deep or options.destroy
                children = []

                # Recurse on children to ensure no node instances are present
                for child in @get('children') or []
                    if child instanceof ContextNodeModel
                        if options.destroy
                            child.destroy()
                        else
                            child.clear(options)
                            children.push(child)

                @set('children', children)
            return @


    class ConditionNodeModel extends ContextNodeModel
        nodeType: 'condition'

        validate: (attrs) ->
            if not (attrs.operator? and attrs.field? and attrs.value?)
                return 'Not a valid condition node'


    class CompositeNodeModel extends ContextNodeModel
        nodeType: 'composite'

        validate: (attrs) ->
            if not attrs.composite?
                return 'Not a valid composite node'


    contextNodeModels = [
        BranchNodeModel
        ConditionNodeModel
        CompositeNodeModel
    ]

    # Returns the node model class appropriate for attrs
    getContextNodeModel = (attrs, options) ->
        for model in contextNodeModels
            if not model::validate.call(null, attrs)
                return new model(attrs, options)
        throw new ContextNodeError 'Unknown context node type'


    class ContextModel extends c.Backbone.Model
        options:
            autosave: false

        url: ->
            if @isNew() then return super
            return @get('_links').self.href

        constructor: (attrs, options={}) ->
            options.parse = true
            @root = new BranchNodeModel
                type: 'and'
                children: []
            super attrs, options

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

            # Add a node. Either an ID must be explicitly defined or
            # if no ID is defined and this is the session context
            c.subscribe c.CONTEXT_ADD, (id, node) =>
                # Shift arguments for session
                if not c._.isNumber id
                    node = id
                    id = null
                if @id is id or not id and @isSession()
                    @add node

            # Remove a node. Either an ID must be explicitly defined or
            # if no ID is defined and this is the session context
            c.subscribe c.CONTEXT_REMOVE, (id, node) =>
                # Shift arguments for session
                if not c._.isNumber id
                    node = id
                    id = null
                if @id is id or not id and @isSession()
                    @remove node

            # Clear all nodes from the context
            c.subscribe c.CONTEXT_CLEAR, (id) =>
                if @id is id or not id and @isSession()
                    @clear()

            @resolve()

        parse: (resp) =>
            # Recreate the root node if the top-level node is a branch and
            # not typed (which means this is the root node)
            if resp.json?
                node = getContextNodeModel(resp.json)
                if node.nodeType is 'branch' and not node.isTyped()
                    @root = node
                else
                    @root.add(node)
            return resp

        save: =>
            @set 'json', @root.toJSON()
            c.publish c.CONTEXT_SYNCING, @
            super
            return

        toJSON: ->
            attrs = super
            if @root.get('children').length > 0
                attrs.json = @root.toJSON()
            return attrs

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'

        fetch: (args...) ->
            @root.fetch args...

        add: (args...) ->
            @root.add args...
            return @

        remove: (args...) ->
            @root.remove args...
            return @

        clear: (args...) ->
            @root.clear args...
            return @


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


    {
        ContextNodeModel, BranchNodeModel, ConditionNodeModel,
        CompositeNodeModel, ContextModel, ContextCollection
    }
