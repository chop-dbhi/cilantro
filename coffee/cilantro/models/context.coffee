define [
    '../core'
], (c) ->

    class ContextNodeError extends Error

    isBranch = (attrs) ->
        (attrs.type is 'and' or attrs.type is 'or') and attrs.children?.length >= 2

    isCondition = (attrs) ->
        attrs.operator and attrs.id and attrs.value?

    isComposite = (attrs) ->
        attrs.composite is true and attrs.id


    # Represents a single node within a ContextModel tree. Non-branch nodes
    # must be carefully handled and not removed from the tree unless explicitly
    # removed
    class ContextNodeModel extends c.Backbone.Model

        # Individual nodes cannot be synced with the server..
        sync: ->

        validate: (attrs) ->
            # Some kind of node
            if isBranch(attrs) or isCondition(attrs) or isComposite(attrs)
                return

            # Check for all undefined values
            for key, value of attrs
                if value? then return 'Unknown node type'

            return

        toJSON: ->
            json = null

            if @isBranch()
                json =
                    type: @get 'type'
                    children: (node.toJSON() for node in @get 'children')

            else if @isComposite()
                json =
                    id: @get 'id'
                    composite: @get 'composite'

            else if @isCondition()
                json =
                    id: @get 'id'
                    operator: @get 'operator'
                    value: @get 'value'

            return json

        isRoot: ->
            not @parent?

        isEmpty: ->
            c._.isEmpty @attributes

        isBranch: ->
            isBranch @attributes

        isCondition: ->
            isCondition @attributes

        isComposite: ->
            isComposite @attributes

        # Retrieve this node's siblings
        siblings: ->
            if @isRoot() then false else c._.without @parent.get('children'), @

        # Creates a new branch and adds this node along with one or more other
        # nodes to the branch
        promote: (nodes...) ->
            if nodes.length is 0
                throw new ContextNodeError 'At least one node must be supplied'

            if @isRoot()
                type = 'and'
            # Alternate operators at each level. If the parent and child
            # branches have the same operator, the child can be demoted.
            else
                type = if @parent.get('type') is 'and' then 'or' else 'and'

            # Pass this node's attributes in the map parser to convert into
            # a newly referenced node.
            children = c._.map [@attributes, nodes...], (attrs) =>
                parseAttrs @nodeModel, attrs, @

            # Clear the existing attributes and set the new ones
            @clear slient: true
            @set type: type, children: children
            return @

        # Takes a node and removes it from the current branch and adds it
        # to the branch's parent. If the branch has only one node left, it
        # too gets demoted and the branch is destroyed.
        demote: ->
            # Nothing to do if this is the root
            if @isRoot() then return false

            # If the parent is the root and this is the only child node, can
            # it be demoted. This is a special case when the root is a branch
            # and one of the children has been removed. Since this will cause
            # the other sibling to be demoted, this will ensure the single
            # condition becomes the root.
            if @parent.isRoot()
                if @siblings().length is 0
                    @parent.clear silent: true
                    @parent.set @attributes
                    return @parent
                return false

            # Check the state of the siblings. If only one sibling is left,
            # demote the parent instead
            @parent.parent.get('children').push @remove()
            return @

        # Add one or more nodes to this branch.
        add: (nodes...) ->
            if not @isBranch()
                throw new ContextNodeError 'Node is not a branch. Use "promote" to convert it into one'
            @get('children').push nodes...
            return @

        # Removes itself from it's parent. When only one sibling remains in the
        # respective branch, the sibling gets demoted.
        remove: ->
            # If this is the root, simply clear the attributes
            if @isRoot()
                @clear()
            else
                children = @parent.get 'children'
                # Ensure the node exists, then splice it directly out of
                # the attributes. This bypasses validation since this operation
                # is recursive.
                if (idx = children.indexOf @) >= 0
                    children.splice(idx, 1)[0]
                    if children.length is 1
                        children[0].demote()
            return @


    parseAttrs = (nodeModel, attrs, parent, callback) ->
        if not attrs or c._.isEmpty attrs
            node = new nodeModel

        # Existing node
        else if attrs instanceof nodeModel
            node = attrs

        # Branch
        else if isBranch attrs
            node = new nodeModel type: attrs.type
            children = c._.map attrs.children, (_attrs) ->
                parseAttrs nodeModel, _attrs, node, callback
            node.set children: children

        # Condition
        else if isCondition attrs
            node = new nodeModel attrs

        # Composite
        else if isComposite attrs
            node = new nodeModel attrs

        else
            throw new ContextNodeError 'Unknown node type'

        if parent
            node.parent = parent

        callback?(node)
        return node


    updateAttrs = (node, attrs) ->
        if node.isBranch()
            children = node.get 'children'
            for _attrs, i in attrs.children
                updateAttrs children[i], _attrs
        else
            node.set attrs


    class ContextModel extends c.Backbone.Model
        nodeModel: ContextNodeModel

        options:
            autosave: false

        deferred:
            # Defer and only execute once
            save: true
            clear: true

            # Defer (and queue) add and remove operations to ensure the tree
            # does not change as a sync occurs. This is due to the entire
            # tree being sent (via PUT) rather than a single node (via PATCH).
            # An example is when a node from a root branch is removed which
            # demotes the sibling node to the root. The response would attempt
            # to update those nodes, but now their structure has changed.
            add: false
            remove: false

        url: ->
            if @isNew() then return super
            return @get('_links').self.href

        initialize: ->
            super

            # Node hash based on `id`
            @nodes ?= {}

            # Node has based on `cid`
            @clientNodes ?= {}

            # Define an initial bare root node
            @root ?= new @nodeModel

            # Early exit for archived objects
            if @isArchived()
                @resolve()
                return

            # Initial publish of being synced since Backbone does
            # not consider a fetch or reset to be a _sync_ operation
            # in this version. This has been changed in Backbone
            # @ commit 1f3f4525
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
            if resp
                if not @root
                    @nodes = {}
                    @clientNodes = {}
                    @root = parseAttrs @nodeModel, resp.json, null, @_referenceNode
                else
                    updateAttrs @root, resp.json
            return resp

        save: =>
            @set 'json', @root.toJSON()
            super
            c.publish c.CONTEXT_SYNCING, @
            @pending()

        toJSON: ->
            attrs =
                id: @id
                name: @get 'name'
                json: null
                description: @get 'description'
                keywords: @get 'keywords'
                published: @get 'published'
                archived: @get 'archived'
                composite: @get 'composite'
                session: @get 'session'

            if @root and not @root.isEmpty()
                attrs.json = @root.toJSON()

            return attrs

        # Conditional save when a referenced node in the tree has changed
        _nodeSave: (node) =>
            if node.get('id')? and node.get('value')? then @save()

        # Each condition or composite node has a reference stored in
        # a array grouped by `id` to enable manipulating nodes in flat
        # means.
        _referenceNode: (node) =>
            if not node.id? then return

            if not (cache = @nodes[node.id])
                cache = @nodes[node.id] = []

            # Don't add redundant cache
            if cache.indexOf(node) is -1 then cache.push node

            # This is to keep track of references for all node objects
            @clientNodes[node.cid] = node

            # Add change handler on node, only trigger if the value is not
            # empty
            if @options.autosave then node.on 'change', @_nodeSave

        # Deference a node from the tree and unbind the change handler
        _deferenceNode: (node) =>
            if (cache = @nodes[node.id]) and (idx = cache.indexOf(node)) >= 0
                cache.splice(idx, 1)

            delete @clientNodes[node.cid]

            # Remove change handlers from node
            node.off 'change', @_nodeSave

        isSession: ->
            @get 'session'

        isArchived: ->
            @get 'archived'

        # Returns an array of nodes for the provided `id`.
        getNodes: (id) ->
            @nodes[id] or []

        # Add a node to the data context. If no root is defined, this node
        # becomes the root. Otherwise, a new branch node is created and the
        # current root changed to a child node
        add: (node) ->
            if not @clientNodes[node.cid]
                @_referenceNode node

                if @root.isEmpty()
                    @root = node
                # If the root is already a branch and simply a container,
                # add it as a child
                else if @root.isBranch() and not @root.id
                    @root.get('children').push node
                else
                    branch = new @nodeModel
                        type: 'and'
                        children: [@root, node]
                    @root = branch
                if @options.autosave then @save()

        remove: (node) ->
            if @clientNodes[node.cid]
                # Replace the root with a placeholder
                if node is @root
                    @root = new @nodeModel

                # If the root is a branch and only has a single sibling,
                # the sibling must be demoted
                else if @root.isBranch()
                    children = @root.get('children')

                    if (idx = children.indexOf(node)) >= 0
                        children.splice(idx, 1)[0]

                    if children.length is 1
                        @root = children[0]

                @_deferenceNode node
                if @options.autosave then @save()

        # Removes all nodes from this context
        clear: ->
            # Unbind all change handlers
            for cid, node of @clientNodes
                if @options.autosave then node.off 'change', @_nodeSave

            @nodes = {}
            @clientNodes = {}

            if @root.id
                @root = new @nodeModel
            else
                @root.clear()
            if @options.autosave then @save()


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


    { ContextNodeModel, ContextModel, ContextCollection }
