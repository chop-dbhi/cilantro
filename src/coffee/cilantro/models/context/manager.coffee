define [
    'underscore'
    'backbone'
    '../../evented'
    './nodes'
], (_, Backbone, Evented, nodes) ->

    ###
    The context tree manager maintains two trees, `working` and `upstream`.
    The working tree contains the current state of all context nodes
    that have been interacted with during the session. The upstream tree
    contains nodes that were applied while in a valid state. When synced
    with the server, the upstream tree is serialized for use as the `json`
    property on the context model.

    All nodes defined by the manager contain a referecne to manager for
    proxying operations that rely on the working or upstream trees.

    Other notes:

    - On a successful sync with the server, the response is merged into both
    the working and upstream trees.
    - The manager never returns nodes from upstream for manipulation. Views
    that bind to the `upstream` node or descendents should use the exposed
    methods on upstream nodes.
    - `ident = ident.identity?() or ident` gets the identity of a node if passed

    ###
    class ContextTreeManager extends Evented
        options:
            identKeys: ['concept', 'field']

        constructor: (@model, options) ->
            @options = _.extend({}, @options, options)

            # Define the working and upstream trees
            @working = new nodes.BranchNodeModel null,
                manager: @

            @upstream = new nodes.BranchNodeModel null,
                manager: @

            # Set trees with  and any time a successful sync occurs
            @set(@model.get('json'))

            @model.on 'sync', (model, resp, options) =>
                @set(resp.json)

        # Serializes the upstream tree which represents a clean and valid
        # representation of the tree.
        toJSON: (options) ->
            @upstream.toJSON()

        # Light wrapper for fixing attrs for the top-level branch node. If `attrs`
        # has ID fields, it is added as a child to the branch. This is primarily
        # to fix legacy data that did not conform to this structure.
        # [DEPRECATE 2.2]
        _set: (node, attrs, options) ->
            if attrs.concept? or attrs.field?
                node.children.add(attrs, options)
            else
                node.set(attrs, options)

        # Updates the working and upstream trees with the server's response
        set: (attrs) ->
            if not attrs?
                @upstream.clear(reset: true)
                return

            # Update `upstream` tree with server response. Other than
            # annotations on nodes themselves, nothing should change. The
            # upstream tree may have not synced nodes so nodes should not be
            # removed from the tree.
            @_set @upstream, attrs,
                manager: @
                identKeys: @options.identKeys
                validate: false
                remove: false

            # Augment the `working` tree with the server's response. Prevent
            # nodes from being removed since this reprsents all nodes that
            # have been accessed
            @_set @working, attrs,
                manager: @
                identKeys: @options.identKeys
                validate: false
                remove: false

        # Find a node in the working tree. The `ident` is a set of attributes
        # the target node must match in order to be returned.
        find: (ident, options) ->
            ident = ident.identity?() or ident
            return @working.find(ident, options)

        # Define a node in the working tree.
        define: (attrs, options) ->
            @working.define(attrs, options)

        # Save the model on behalf of a node. Defaults to the upstream node.
        save: (node, options) ->
            node ?= @upstream

            # Trigger 'request' on node
            options = _.extend {}, options,
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

        # Removes a node from the upstream tree. Since the working tree
        # acts as a local storage and synchronization between controls of
        # the node, nodes in the working tree are never removed.
        remove: (ident, options) ->
            ident = ident.identity?() or ident
            if (node = @upstream.find(ident))
                node.destroy()
                @save(node)

        # Applies a node in the working tree to upstream. This triggers a
        # validation and only gets applied if deemed valid. On success, this
        # triggers a sync with a server.
        apply: (ident, options) ->
            ident = ident.identity?() or ident
            attrs = @working.find(ident).toJSON()
            node = @upstream.define(ident)
            node.set(attrs, options)
            @save(node)

        # Reverts a working tree node to it's upstream state if one exists.
        revert: (ident, options) ->
            ident = ident.identity?() or ident
            if not (wn = @working.find(ident))
                return
            if (un = @upstream.find(ident))
                wn.set(un.toJSON())
            else
                wn.clear()

        # Enables a node in the upstream tree that was previously disabled.
        # Triggers a sync.
        enable: (ident) ->
            ident = ident.identity?() or ident
            if (node = @upstream.find(ident))
                node.set(enabled: true)
                @save(node)

        # Disables a node in the upstream tree. Triggers a sync.
        disable: (ident) ->
            ident = ident.identity?() or ident
            if (node = @upstream.find(ident))
                node.set(enabled: false)
                @save(node)

        clear: ->
            @upstream.clear(reset: true)
            @save()
            return @

        # Returns true if the node is not found upstream.
        isNew: (ident) ->
            ident = ident.identity?() or ident
            return not @upstream.find(ident)

        # Checks if this node is different from upstream. If it does not exist
        # upstream, it is never considered dirty.
        isDirty: (ident) ->
            ident = ident.identity?() or ident
            if not (u = @upstream.find(ident))
                return false
             return not _.isEqual(u.toJSON(), @working.find(ident).toJSON())

        # Check if the node for a given ident is active and enabled. If
        # `enabled` is not defined, it is assumed to be true hence the
        # condition `isnt false`.
        isEnabled: (ident) ->
            ident = ident.identity?() or ident
            if (node = @upstream.find(ident))
                return node.get('enabled') isnt false
            return false


    { ContextTreeManager }
