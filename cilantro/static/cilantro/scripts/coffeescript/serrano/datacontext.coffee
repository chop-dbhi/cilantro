define [
    'mediator'
    'underscore'
    'backbone'
    'serrano/channels'
], (mediator, _, Backbone, channels) ->

    isBranch = (attrs) ->
        (attrs.type is 'and' or attrs.type is 'or') and attrs.children?.length >= 2

    isCondition = (attrs) ->
        attrs.operator and attrs.id and attrs.value isnt undefined

    isComposite = (attrs) ->
        attrs.composite is true and attrs.id


    # Represents a single node within a DataContext tree. Non-branch nodes
    # must be carefully handled and not removed from the tree unless explicitly
    # removed
    class DataContextNode extends Backbone.Model
        validate: (attrs) ->
            # Some kind of node
            if isBranch(attrs) or isCondition(attrs) or isComposite(attrs)
                return
            # Check for all undefined values
            for key, value of attrs
                if value isnt undefined
                    return 'Unknown node type'
            return

        toJSON: ->
            if @isBranch()
                json =
                    type: @get 'type'
                    children: @get 'children'

            else if @isComposite()
                json =
                    id: @get 'id'
                    composite: @get 'composite'
            else
                json =
                    id: @get 'id'
                    operator: @get 'operator'
                    value: @get 'value'

            return json

        isRoot: -> not @parent?

        isEmpty: -> _.isEmpty @attributes

        isBranch: -> isBranch @attributes

        isCondition: -> isCondition @attributes

        isComposite: -> isComposite @attributes

        # Retrieve this node's siblings
        siblings: ->
            if @isRoot() then false else _.without @parent.get('children'), @

        # Creates a new branch and adds this node along with one or more other
        # nodes to the branch
        promote: (nodes...) ->
            if nodes.length is 0
                throw new Error 'At least one node must be supplied'

            if @isRoot()
                type = 'and'
            # Alternate operators at each level. If the parent and child
            # branches have the same operator, the child can be demoted.
            else
                type = if @parent.get('type') is 'and' then 'or' else 'and'

            # Pass this node's attributes in the map parser to convert into
            # a newly referenced node.
            children = _.map [@attributes, nodes...], (attrs) =>
                DataContextNode.parseAttrs attrs, @

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
                throw new Error 'Node is not a branch. Use "promote" to convert it into one'
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


    DataContextNode.parseAttrs = (attrs, parent, callback) ->
        if not attrs or _.isEmpty attrs
            node = new DataContextNode
        # Existing node
        else if attrs instanceof DataContextNode
            node = attrs
        # Branch
        else if isBranch attrs
            node = new DataContextNode type: attrs.type
            children = _.map attrs.children, (_attrs) ->
                DataContextNode.parseAttrs _attrs, node, callback
            node.set children: children
        # Condition
        else if isCondition attrs
            node = new DataContextNode attrs
        # Composite
        else if isComposite attrs
            node = new DataContextNode attrs
        else
            throw new Error 'Unknown node type'

        if parent
            node.parent = parent

        callback?(node)
        return node


    DataContextNode.updateAttrs = (node, attrs) ->
        if node.isBranch()
            children = node.get('children')
            for _attrs, i in attrs.children
                DataContextNode.updateAttrs children[i], _attrs
        else
            node.set attrs


    class DataContext extends Backbone.Model
        deferred:
            save: true

        initialize: ->
            super

            # Node hash based on `id`
            @nodes ?= {}

            # Node has based on `cid`
            @clientNodes ?= {}

            # Define an initial bare root node
            @root ?= new DataContextNode

            # Initial publish of being synced since Backbone does
            # not consider a fetch or reset to be a _sync_ operation
            # in this version. This has been changed in Backbone
            # @ commit 1f3f4525
            @on 'sync', ->
                mediator.publish channels.DATACONTEXT_SYNCED, @, 'success'

            # If the sync fails on the server
            @on 'error', ->
                mediator.publish channels.DATACONTEXT_SYNCED, @, 'error'

            # Notify subscribers the this object has changed
            @on 'change', ->
                mediator.publish channels.DATACONTEXT_CHANGED, @

            # Pause syncing with the server
            mediator.subscribe channels.DATACONTEXT_PAUSE, (id) =>
                if @id is id or not id and @get 'session'
                    @pending()

            # Resume syncing with the server
            mediator.subscribe channels.DATACONTEXT_RESUME, (id) =>
                if @id is id or not id and @get 'session'
                    @resolve()

            # Add a node. Either an ID must be explicitly defined or
            # if no ID is defined and this is the session context
            mediator.subscribe channels.DATACONTEXT_ADD, (node, id) =>
                # Shift arguments for session
                if _.isBoolean id
                    sync = id
                    id = null
                if @id is id or not id and @get 'session'
                    @add node

            # Remove a node. Either an ID must be explicitly defined or
            # if no ID is defined and this is the session context
            mediator.subscribe channels.DATACONTEXT_REMOVE, (node, id) =>
                # Shift arguments for session
                if _.isBoolean id
                    sync = id
                    id = null
                if @id is id or not id and @get 'session'
                    @remove node

            @resolve()

        url: ->
            if @isNew() then return super
            return @get('_links').self.href

        parse: (resp) =>
            if resp
                if not @root
                    @nodes = {}
                    @clientNodes = {}
                    @root = DataContextNode.parseAttrs resp.json, null, @_cacheNode
                else
                    DataContextNode.updateAttrs @root, resp.json
            return resp

        save: ->
            mediator.publish channels.DATACONTEXT_SYNCING, @
            super

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

        # Each condition or composite node has a reference stored in
        # a array grouped by `id` to enable manipulating nodes in flat
        # means.
        _cacheNode: (node) =>
            if node.id
                if not (cache = @nodes[node.id])
                    cache = @nodes[node.id] = []
                # Don't add redundant cache
                if cache.indexOf(node) is -1
                    cache.push node
                # This is to keep track of references for all node objects
                @clientNodes[node.cid] = node

        _deferenceNode: (node) =>
            if (cache = @nodes[node.id]) and (idx = cache.indexOf(node)) >= 0
                cache.splice(idx, 1)
            delete @clientNodes[node.cid]

        isSession: ->
            @get 'session'

        # Returns an array of nodes for the provided `id`.
        getNodes: (id) ->
            @nodes[id] or []

        # Add a node to the data context. If no root is defined, this node
        # becomes the root. Otherwise, a new branch node is created and the
        # current root changed to a child node
        add: (node) ->
            if not @clientNodes[node.cid]
                @_cacheNode node
                if @root.isEmpty()
                    @root = node
                # If the root is already a branch and simply a container,
                # add it as a child
                else if @root.isBranch() and not @root.id
                    @root.get('children').push node
                else
                    branch = new DataContextNode
                        type: 'and'
                        children: [@root, node]
                    @root = branch
            @save()

        remove: (node) ->
            if @clientNodes[node.cid]
                if node is @root
                    @root = new DataContextNode
                else if @root.isBranch()
                    children = @root.get('children')
                    if (idx = children.indexOf(node)) >= 0
                        children.splice(idx, 1)[0]
                    if children.length is 1
                        @root = children[0]
                @_deferenceNode node
            @save()


    class DataContexts extends Backbone.Collection
        model: DataContext

        initialize: ->
            super

            # Mimic the initial sync for each model
            @on 'reset', (collection) ->
                @resolve()
                for model in collection.models
                    model.trigger 'sync'
            return

        hasSession: ->
            !!(@filter (model) -> model.get 'session')[0]


    App.DataContextNode = DataContextNode

    { DataContextNode, DataContext, DataContexts }
