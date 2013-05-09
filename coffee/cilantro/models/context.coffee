define [
    '../core'
], (c) ->

    class ContextNodeError extends Error


    # Represents a single node within a ContextModel tree. Non-branch nodes
    # must be carefully handled and not removed from the tree unless explicitly
    # removed
    class ContextNodeModel extends c.Backbone.Model

        # Save of the default public attributes on initialization
        initialize: (attrs, options) ->
            @save(options)

        # Returns the public attributes
        toJSON: ->
            @publicAttributes

        # Override to create a copy of the internal attributes for exposing
        # as `public` attributes. This will must be called to make
        # the attributes visible (via toJSON) for upstream callers
        save: (options) ->
            if (isValid = @isValid(options))
                @publicAttributes = c._.clone @attributes
            return isValid

        # Clears all attributes except for the field and concept identifers
        clear: (options) ->
            attrs =
                field: @get 'field'
                concept: @get 'concept'
            super(silent: true)
            @set attrs, validate: false
            return

        # Validates the attributes are valid for the node type
        validate: (attrs, options) ->
            try
                model = getContextNodeModel(attrs)
                if not model.isValid(options)
                    return model.validationError
            catch error
                return error.message
            return

        # Determines if the node is 'typed', that is, whether it is associated
        # with a specific field or concept. If not, the node is considered a
        # container for the attributes.
        isTyped: ->
            @attributes.field? or @attributes.concept?

        # Attempts to fetch a node relative to this one. The `query` is a set
        # of attributes the the target node must match in order to be
        # returned. The current node is checked first and recurses (for branch
        # nodes).
        fetch: (query, options={}) ->
            if c._.isEmpty(query) then return false

            match = true

            # Check against each key in the query for a match on attrs
            for key, value of query
                if @attributes[key] isnt value
                    match = false
                    break

            if match
                return @
            else if options.create
                klass = contextNodeModels[options.create]
                return new klass(query)


    # Branch-type node that acts as a container for other nodes. The `type`
    # determines the conditional relationship between the child nodes.
    class BranchNodeModel extends ContextNodeModel
        nodeType: 'branch'

        defaults: ->
            type: 'and'
            children: []

        # If `deep` is true, children are immediately converted into their
        # respective context node instances. This is normally performed during
        # a fetch.
        initialize: (attrs, options) ->
            options = c._.extend
                deep: true
            , options

            if options.deep
                children = @get('children')
                for child, i in children
                    if not (child instanceof ContextNodeModel)
                        children[i] = getContextNodeModel(child, options)

            super(attrs, options)

        # If `deep` is true, children are also validated (and recursed). If
        # any fail to validate, the branch is considered invalid. If `strict`
        # is true, the branch must have at least one child to be valid
        validate: (attrs, options) ->
            options = c._.extend
                deep: true
                strict: false
            , options

            if not (attrs.type is 'and' or attrs.type is 'or')
                return 'Not a valid branch type'

            if options.strict and not attrs.children.length
                return 'No children in branch'

            if options.deep
                for child in attrs.children
                    if child instanceof ContextNodeModel
                        if not child.isValid(options)
                            return child.validationError
                    else if (message = ContextNodeModel::validate.call(null, child, options))
                        return message
            return

        # Attempts to fetch this node or one of the children based on the
        # query attributes. To prevent pre-maturely creating a new node, the
        # `create` option is explicity set to false during the recursion.
        # One thing to note, is that a fetch does not uniformly increase it's
        # depth of search per iteration. It will recurse as deep as it can go
        # per child.
        fetch: (query, options={}) ->
            create = options.create
            options.create = false

            # Initially check if this node matches
            if (node = super(query, options))
                return node

            children = @get('children')

            for child, i in children
                if not (child instanceof ContextNodeModel)
                    child = children[i] = getContextNodeModel(child, options)
                if (node = child.fetch(query, options))
                    return node

            # No nodes matched, create a node of the specified type with the
            # query as the default attributes.
            if create
                klass = contextNodeModels[create]
                @add(node = new klass query)
                return node

        # If `deep` is true, the save is recursed to each child. If `ignore`
        # is true, child nodes that do validate will not be updated, but not
        # be removed from the public attributes if already present, but their
        # public attributes are not replaced. If `strict` is true, an invalid
        # node will stop processing and return false
        save: (options) ->
            options = c._.extend
                deep: true
                ignore: true
                strict: false
            , options

            previousPublic = @publicAttributes

            if not super(deep: false)
                return false

            # New attributes from super save
            attrs = @publicAttributes
            children = []

            for child in attrs.children
                if child instanceof ContextNodeModel
                    if options.deep
                        if child.isValid(options)
                            child.save(options)
                        else if options.strict
                            @publicAttributes = previousPublic
                            return false
                        else if not options.ignore
                            continue
                    child = child.toJSON()
                children.push(child)

            attrs.children = children
            return true

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
            if not (children = @get('children')) or not children.length
                return

            # Recurse on children and clear
            for child in children
                if child instanceof ContextNodeModel
                    child.clear(options)

            return


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


    contextNodeModels =
        branch: BranchNodeModel
        condition: ConditionNodeModel
        composite: CompositeNodeModel

    # Returns the node model class appropriate for attrs
    getContextNodeModel = (attrs, options) ->
        for type, model of contextNodeModels
            if not model::validate.call(null, attrs, options)
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

            c.subscribe c.CONTEXT_SAVE, (id) =>
                if @id is id or not id and @isSession()
                    @save()

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

        save: ->
            @root.save()
            super

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
