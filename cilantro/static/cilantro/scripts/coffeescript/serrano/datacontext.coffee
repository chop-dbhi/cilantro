define [
    'underscore'
    'backbone'
], (_, Backbone) ->

    isBranch = (attrs) ->
        (attrs.type is 'and' or attrs.type is 'or') and attrs.children?.length >= 2

    isCondition = (attrs) ->
        attrs.operator and attrs.id and attrs.value isnt undefined

    isComposite = (attrs) ->
        attrs.composite is true and attrs.id


    class DataContextNode extends Backbone.Model
        validate: (attrs) ->
            # Some kind of node
            if isBranch(attrs) or isCondition(attrs) or isComposite attrs
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
                    children: _.map(@get('children'), (model) -> model.toJSON())
            else
                json = super
            return json

        # Retrieve this node's siblings
        siblings: ->
            if @root then false else _.without @parent.get('children'), @

        # Proxy methods
        isEmpty: ->
            _.isEmpty @attributes

        isBranch: ->
            isBranch @attributes

        isCondition: ->
            isCondition @attributes

        isComposite: ->
            isComposite @attributes

        # Creates a new branch and adds this node along with one or more other
        # nodes to the branch
        promote: (nodes...) ->
            if _.isString nodes[0]
                type = nodes[0]
                if type isnt 'and' and type isnt 'or'
                    throw new Error 'Type must be "and" or "or"'
                nodes.splice 0, 1
            else
                type = 'and'

            if nodes.length is 0
                throw new Error 'At least one other node must be supplied'

            children = _.map [@toJSON(), nodes...], (attrs) =>
                DataContextNode.parseAttrs attrs, @

            @clear slient: true
            @set type: type, children: children
            return @

        # Takes a node and removes it from the current branch and adds it
        # to the branch's parent.
        demote: ->
            # If this is the root node or it's parent is, this node cannot
            # be promoted
            if @root then return false

            # If the parent is root and this is the only child node, can
            # it be demoted.
            if @parent.root
                if @siblings().length is 0
                    @parent.clear silent: true
                    @parent.set @attributes
                    return @parent
                return false

            # Check the state of the siblings. If only one sibling is left,
            # promote the parent instead
            node = @parent.remove @
            grand = @parent.parent
            grand.attributes.children.push node
            return @

        add: (nodes...) ->
            if not @isBranch()
                throw new Error 'Node is not a branch. Use "promote" to convert it into one'
            @attributes.children.push.apply @attributes.children, _.map nodes, (attrs) =>
                DataContextNode.parseAttrs attrs, @
            return @

        # Removes itself from it's parent. If a `node` is passed, this
        # implies this node is a branch. When only one sibling remains in the
        # respective branch, the sibling gets demoted.
        remove: ->
            if @root then return false
            children = @parent.attributes.children

            # Ensure the node exists, then splice it directly out of
            # the attributes. This bypasses validation since this operation
            # is recursive.
            if (idx = children.indexOf @) >= 0
                children.splice(idx, 1)[0]
                if children.length is 1
                    children[0].demote()
            return @


    DataContextNode.parseAttrs = (attrs, parent, callback) ->
        if not attrs
            node = new DataContextNode
        # Existing node
        else if attrs instanceof DataContextNode
            node = attrs
        # Branch
        else if isBranch attrs
            node = new DataContextNode type: attrs.type
            children = _.map attrs.children, (_attrs) -> DataContextNode.parseAttrs _attrs, node, callback
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
            delete node.root
        else
            node.root = true

        callback?(node)
        return node


    class DataContext extends Backbone.Model
        initialize: ->
            @nodes ?= {}

        url: ->
            if @isNew() then super else @get 'url'

        parse: (response) =>
            if response
                @nodes = {}
                @node = DataContextNode.parseAttrs response.json, null, @cacheNode

            return response

        toJSON: ->
            attrs = super
            if @node
                attrs.json = @node.toJSON()
            return attrs

        # Proxy methods
        isEmpty: ->
            @node.isEmpty()

        isBranch: ->
            @node.isBranch()

        isCondition: ->
            @node.isCondition()

        isComposite: ->
            @node.isComposite()

        cacheNode: (node) =>
            if node.id
                if not (cache = @nodes[node.id])
                    cache = @nodes[node.id] = []
                # Don't add redundant cache
                if cache.indexOf(node) is -1
                    cache.push node

        promote: (node, nodes...) ->
            if node is null
                @node.promote nodes...
            else
                node.promote nodes...
            @set 'json', @node.toJSON()

        demote: (node) ->
            node.demote()
            @set 'json', @node.toJSON()

        add: (node, nodes...) ->
            if node is null
                node = @node

            if node.isEmpty()
                node.set nodes[0].attributes or nodes[0]
            else
                node.add(nodes...)
                @cacheNode node for node in node.get 'children'
            @set 'json', @node.toJSON()

        remove: (node) ->
            node.remove()
            # Dereference it
            if (cache = @nodes[node.id]) and (idx = cache.indexOf(node)) >= 0
                cache.splice(idx, 1)
            @set 'json', @node.toJSON()


    class DataContexts extends Backbone.Collection
        model: DataContext

        getSession: ->
            (@filter (model) -> model.get 'session')[0]



    { DataContextNode, DataContext, DataContexts }
