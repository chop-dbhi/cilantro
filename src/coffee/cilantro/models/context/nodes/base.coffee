define [
    'underscore'
    'backbone'
    '../../base'
], (_, Backbone, base) ->


    class ContextNodeError extends Error


    ###
    Base context node model containing basic validation, identity functions,
    and setting common elements. This is a _syncless_ model since it itself
    does not sync with the server, but is a component of an upstream structure.
    ###
    class ContextNodeModel extends base.SynclessModel
        constructor: (attrs, options={}) ->
            options = _.extend
                identKeys: ['concept', 'field']
            , options

            @manager = options.manager
            @identKeys = options.identKeys
            super(attrs, options)

        # Returns the identity object that represents this node.
        identity: ->
            @pick(@identKeys...)

        # Traverses up the tree and builds the path to this node
        path: ->
            path = []
            node = @
            while true
                if (node = node.collection?.parent) and not _.isEmpty (ident = node.identity())
                    path.unshift(ident)
                else
                    break
            return path

        # Checks if the attributes are valid for the node type. The node type
        # is determined dynamically by iterating over an validating against
        # each known type.
        validate: (attrs, options) ->
            try
                model = ContextNodeModel.create(attrs, options)
                if not model.isValid(options)
                    return model.validationError
            catch error
                return error.message
            return

        # Clears the contents of the node without except for ID-based fields
        clear: ->
            attrs = @identity()
            super
            @set(attrs, silent: true)

        # Removes the node from the collection, no syncing
        destroy: (options) ->
            @trigger('destroy', @, @collection, options)

        # Attempts to fetch a node relative to this one. The `ident` is a set
        # of attributes the target node must match in order to be returned.
        # Takes an option `create` which specifies a valid node type.
        find: (ident, options={}) ->
            if _.isEmpty(ident)
                return false

            # Check against each key in the ident for a match on attrs
            for key, value of ident
                if not _.isEqual(@get(key), value)
                    match = false
                    break

            # Match successful, return this node
            if match isnt false
                return @

        # Applies the node to the upstream tree via the manager
        apply: (options) ->
            if not @isValid(options)
                return false
            @manager.apply(@, options)

        remove: (options) ->
            @manager.remove(@, options)

        revert: (options) ->
            @manager.revert(@, options)

        enable: (options) ->
            @manager.enable(@, options)

        disable: (options) ->
            @manager.disable(@, options)

        toggleEnabled: (options) ->
            if (enabled = @isEnabled(options))
                @disable(options)
            else
                @enable(options)
            return not enabled

        isNew: (options) ->
            @manager.isNew(@, options)

        isDirty: (options) ->
            @manager.isDirty(@, options)

        # Proxy to manager to check if the node is enabled. Note, this seems
        # like it could be checked locally, however the upstream node is the
        # source of truth and thus the manager must perform the check in case
        # this is a working node.
        isEnabled: (options) ->
            @manager.isEnabled(@, options)


    { ContextNodeError, ContextNodeModel }
