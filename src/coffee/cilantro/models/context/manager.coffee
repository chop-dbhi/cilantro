define [
    '../../core'
    './nodes'
], (c, nodes) ->

    class Events

    c._.extend Events::, c.Backbone.Events


    # Light wrapper for fixing attrs for the top-level branch node. If `attrs`
    # has ID fields, it is added as a child to the branch. This is primarily
    # to fix legacy data that did not conform to this structure.
    _fix = (node, attrs={}, options) ->
        if attrs.concept? or attrs.field?
            node.children.add(attrs, options)
        else
            node.set(attrs, options)


    class ContextTreeManager extends Events
        options:
            identKeys: ['concept', 'field']

        nodeEventPrefix: 'node'

        nodeEvents:
            'apply': 'save'
            'remove': 'save'
            'change:enabled': 'save'

        constructor: (@model, options) ->
            @options = c._.extend({}, @options, options)

            # Define the working and upstream trees
            @working = new nodes.BranchNodeModel null,
                manager: @

            @upstream = new nodes.BranchNodeModel null,
                manager: @

            # Initialize trees and any time a successful sync occurs
            @update(@model.get('json'))

            @model.on 'sync', (model, resp, options) =>
                @update(resp.json)

        _listenToNode: (node) ->
            # Proxy events from nodes
            @listenTo node, 'all', (event, args...) =>
                @trigger("#{ @nodeEventPrefix }:#{ event }", args...)

            # Bind node events
            for event, method of @nodeEvents
                @listenTo node, event, @[method], @

            return

        # Traverses the working tree and extracts all applied nodes and
        # falls back to the upstream contents.
        _toJSON: (node, options) ->

            # Node marked for removal, return nothing to be skipped
            if node.removed then return

            # Node in working tree is not upstream, find the corresponding node
            # in the active tree
            if node.dirty
                ident = node.identity()

                # Find the node in the upstream tree and serialize
                if not (node = @upstream.find(ident)) then return

                # Note, this assumes the traversal path to the child
                # is the same as the working tree. Currently this is
                # always the case, but _could_ be the source of issues
                # later if more complex tree layouts are used.
                return @_toJSON(node, options)

            attrs = c._.clone(node.attributes)

            if node.type is 'branch'
                children = []

                for child in node.children.models
                    if (data = @_toJSON(child, options))
                        children.push(data)

                # Skip empty branches
                if not children.length
                    return

                attrs.children = children

            return attrs

        # Serialize all clean nodes in the working tree and fallback to the
        # *active* tree.
        toJSON: (options) ->
            @_toJSON(@working, options)

        # Update the active and working trees. Nodes may not be removed from
        # the working tree since this would remove local state that controls
        # may be relying on.
        update: (attrs) ->
            # Update `upstream` tree with server response
            _fix @upstream, attrs,
                manager: @
                identKeys: @options.identKeys
                validate: false

            # Augment the `working` tree with the server's response. Prevent
            # nodes from being removed
            _fix @working, attrs,
                manager: @
                identKeys: @options.identKeys
                validate: false
                remove: false

        # Attempts to find a node. The `ident` is a set of attributes the
        # target node must match in order to be returned.
        find: (ident, options) ->
            if (node = @working.find(ident, options))
                # First time access, start listening to the node for events
                if not @_listeners?[node._listenerId]?
                    @_listenToNode(node)
            return node

        # Define a node in the tree. Takes an option `type` which specifies
        # the node type to create.
        define: (attrs, path, options) ->
            if not c._.isArray(path)
                options = path
                path = []

            options = c._.extend
                identKeys: @options.identKeys
            , options

            # Set the manager
            options.manager = @

            # Start with the top-level node
            parent = @working

            # Find the parent for the new node will be define in
            for ident in path
                # Ensure only nodes are being defined in branch nodes
                if (parent = parent.find(ident)).type isnt 'branch'
                    throw new Error 'Cannot define a node in a non-branch'

            # Get the identity of this node and add it to the parent
            parent.children.add(attrs, options)
            return @find(c._.pick(attrs, options.identKeys))

        # Save the model on behalf of a node.
        # TODO this assumes only a single node has been changed. If multiple
        # nodes are changed, only the node that triggers causes the save will
        # have it's events triggered.
        save: (node, options) ->
            # Trigger 'request' on node
            options = c._.extend {}, options,
                beforeSend: (xhr) =>
                    node.trigger('request', node, xhr, options)

            # Attach deferred handlers for the node once the request
            # is complete
            @model.save(null, options)
                .done (data, status, xhr) =>
                    # Just the updated data just for the node
                    node.trigger('sync', node, node.toJSON(), options)
                .fail (xhr, status, error) =>
                    node.trigger('error', node, xhr, options)

        # Marks the entire working tree as removed
        remove: (options) ->
            @working.remove()
            @save(@working)
            return @


    { ContextTreeManager }
