define [
    'underscore'
    'backbone'
    '../../evented'
    './nodes'
], (_, Backbone, Evented, nodes) ->

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

        # Marks the entire working tree as removed
        remove: (options) ->
            @working.remove()
            @save(@working)
            return @


    { ContextTreeManager }
