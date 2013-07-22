define [
    '../../../core'
    './base'
], (c, base) ->


    class ContextNodeError extends Error


    class ContextNodeModel extends c.Backbone.Model

        constructor: (attrs, options={}) ->
            options = c._.extend
                identKeys: ['concept', 'field']
            , options

            @manager = options.manager
            @identKeys = options.identKeys

            super(attrs, options)

            # Validate on construction and marked as dirty
            if attrs? and @_isDirty()
                @dirty = true

            # Any time the node changes, check if it is dirty
            @on 'change', =>
                delete @dirty
                if @_isDirty()
                    @dirty = true

        # Convenience methods for accessing the
        _working: (options) ->
            @manager?.find(@identity(), options)

        _upstream: (options) ->
            @manager?.upstream.find(@identity(), options)

        # Returns the identity object that represents this node.
        identity: ->
            @pick(@identKeys...)

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

        # Attempts to fetch a node relative to this one. The `ident` is a set
        # of attributes the target node must match in order to be returned.
        # Takes an option `create` which specifies a valid node type.
        find: (ident, options={}) ->
            if c._.isEmpty(ident)
                return false

            # Check against each key in the ident for a match on attrs
            for key, value of ident
                if @get(key) isnt value
                    match = false
                    break

            # Match successful, return this node
            if match isnt false
                return @

        # Attempts to apply a node in the working tree. If the node is not
        # valid, false is returned. Otherwise the node is
        apply: (options) ->
            if not @isValid(options)
                return false

            # Remove state flags
            delete @dirty
            delete @removed

            # Apply all descendents
            if @type is 'branch'
                for child in @children.models
                    child.apply(silent: true)

            @trigger('apply', @, options)

            return @

        # Mark the node as removed
        remove: (options) ->
            if (node = @_working())
                node.removed = true
                node.trigger('remove', node, options)
            if node isnt @
                @removed = true
                @trigger('remove', @, options)
            return @

        revert: (options) ->
            if (node = @_upstream()) and node isnt @
                @set(node.toJSON())

        # Enable the node
        enable: (options) ->
            if (node = @_working())
                node.set('enabled', true, options)
            if node isnt @
                @set('enabled', true, options)
            return @

        # Disable the node
        disable: (options) ->
            if (node = @_working())
                node.set('enabled', false, options)
            if node isnt @
                @set('enabled', false, options)
            return @

        # Toggle the enabled state of the node
        toggleEnabled: (options) ->
            if @isEnabled()
                 @disable(options)
            else
                 @enable(options)
            return @isEnabled()

        # Check if this node is defined in the upstream tree
        isNew: (options) ->
            not @_upstream(options)

        _isDirty: (options) ->
            if not (node = @_upstream(options))
                return true
            return not c._.isEqual(node.toJSON(), @toJSON())

        # Check if this node is dirty
        isDirty: (options) ->
            @dirty is true

        # Check if the node for a given ident is active and enabled
        isEnabled: (options) ->
            @get('enabled') isnt false

        # Return true if marked for removal
        isRemoved: (options) ->
            @removed is true


    { ContextNodeError, ContextNodeModel }
