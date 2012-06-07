define [
    'underscore'
    'backbone'
], (_, Backbone) ->

    class DataContextNode extends Backbone.Model
        validate: (attrs) ->
            delete @type

            # Branch
            if attrs.type isnt undefined
                if attrs.type isnt 'and' and attrs.type isnt 'or'
                    return 'Invalid logical operator between nodes'
                if not attrs.children or attrs.children.length < 2
                    return 'Branch nodes must contain two or more child nodes'
                @type = 'branch'

            # Condition
            else if attrs.operator isnt undefined
                if not attrs.id? or attrs.value is undefined
                    return 'Condition nodes must have id, operator and value attributes'
                @type = 'condition'

            # Composite
            else if attrs.composite is true
                if not attrs.id?
                    return 'Composite nodes must have an id attribute'
                @type = 'composite'
            else
                for key, value of attrs
                    if value isnt undefined
                        return 'Unknown node type'
            return

        toJSON: ->
            if @type is 'branch'
                json =
                    type: @get 'type'
                    children: _.map(@get('children'), (model) -> model.toJSON())
            else
                json = super
            return json

        # Retrieve this node's siblings
        siblings: ->
            if @root then false else _.without @parent.get('children'), @

        # Removes itself from it's parent. If a `node` is passed, this
        # implies this node is a branch. When only one sibling remains in the
        # respective branch, the sibling gets demoted.
        remove: (node) ->
            if @root then return false

            if node
                if @type isnt 'branch'
                    throw new Error 'Nodes can only be removed from branches'
                children = @attributes.children
            else
                node = @
                children = @parent.attributes.children

            # Ensure the node exists, then splice it directly out of
            # the attributes. This bypasses validation since this operation
            # is recursive.
            if (idx = children.indexOf node) >= 0
                children.splice(idx, 1)[0]
                if children.length is 1
                    children[0].demote()
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

        # Creates a new branch and adds this node along with one or more other
        # nodes to the branch
        promote: (type, nodes...) ->
            if type isnt 'and' and type isnt 'or'
                throw new Error 'Type must be "and" or "or"'
            if nodes.length is 0
                throw new Error 'At least one other node must be supplied'

            children = _.map [@toJSON(), nodes...], (attrs) =>
                DataContextNode.parseAttrs attrs, @
            @clear slient: true
            @set type: type, children: children
            return @

        add: (nodes...) ->
            if @type isnt 'branch'
                throw new Error 'Node is not a branch. Use "promote" to convert it into one'
            @attributes.children.push.apply @attributes.children, _.map nodes, (attrs) =>
                DataContextNode.parseAttrs attrs, @
            return @

    DataContextNode.parseAttrs = (attrs, parent) ->
        if not attrs
            node = new DataContextNode
        # Existing node. Note this assumes
        else if attrs instanceof DataContextNode
            node = attrs
        # Branch
        else if attrs.type is 'and' or attrs.type is 'or' and attrs.children?.length >= 2
            node = new DataContextNode type: attrs.type
            children = _.map attrs.children, (_attrs) -> DataContextNode.parseAttrs _attrs, node
            node.set children: children
            node.type = 'branch'
        # Condition
        else if attrs.operator and attrs.id and attrs.value isnt undefined
            node = new DataContextNode attrs
            node.type = 'condition'
        # Composite
        else if attrs.composite is true and attrs.id
            node = new DataContextNode attrs
            node.type = 'composite'
        else
            throw new Error 'Unknown node type'

        if parent
            node.parent = parent
            delete node.root
        else
            node.root = true
        return node


    class DataContext extends Backbone.Model
        url: ->
            if @isNew() then super else @get 'url'

        parse: (response) ->
            if response
                @node = DataContextNode.parseAttrs response.json
            return response

        toJSON: ->
            attrs = super
            if @node
                attrs.json = @node.toJSON()
            return attrs


    class DataContexts extends Backbone.Collection
        model: DataContext

        getSession: ->
            (@filter (model) -> model.get 'session')[0]



    { DataContextNode, DataContext, DataContexts }
