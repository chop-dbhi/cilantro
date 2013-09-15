define [
    'underscore'
    'backbone'
    './base'
], (_, Backbone, base) ->


    class ContextNodeError extends Error


    class ContextNodeModel extends Backbone.Model

        constructor: (attrs, options={}) ->
            options = _.extend
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
                @dirty = @_isDirty()

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
            if _.isEmpty(ident)
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
        apply: (options={}) ->
            # Only unmanaged or working nodes can be applied
            if (node = @_working())? and @ isnt node
                return @

            if not options.silent
                @trigger('before:apply', @, options)

            if not @isValid(options)
                return false

            # Apply all descendents
            if @type is 'branch'
                passed = true
                for child in @children.models
                    if child.apply(_.extend({}, options, silent: true)) is false
                        passed = false

                # If the branch contains a single child that does not pass
                # fail the apply
                if @children.length is 1 and not passed
                    return false

            # Remove state flags
            delete @dirty
            delete @removed

            if not options.silent
                @trigger('apply', @, options)
            return @

        # Mark the node as removed
        remove: (options={}) ->
            if not options.silent
                @trigger('before:remove', @, options)
            @removed = true
            if not options.silent
                @trigger('remove', @, options)
            if (node = @_working()) and node isnt @
                node.remove(options)
            return @

        revert: (options={}) ->
            if not options.silent
                @trigger('before:revert', @, options)
            if (node = @_upstream()) and node isnt @
                @set(node.toJSON(), options)
                if not options.silent
                    @trigger('revert', @, options)

        # Enable the node
        enable: (options) ->
            @set('enabled', true, options)
            if (node = @_working()) and node isnt @
                node.enable(options)
            return @

        # Disable the node
        disable: (options) ->
            @set('enabled', false, options)
            if (node = @_working()) and node isnt @
                node.disable(options)
            return @

        # Toggle the enabled state of the node
        toggleEnabled: (options) ->
            if @isEnabled(options)
                 @disable(options)
            else
                 @enable(options)
            return @isEnabled(options)

        # Check if this node is defined in the upstream tree
        isNew: (options) ->
            not @_upstream(options)

        # Checks if this node is new or is different from upstream
        _isDirty: (options) ->
            if not (node = @_upstream(options))
                return true
            return not _.isEqual(node.toJSON(), @toJSON())

        # Check if this node is dirty
        isDirty: (options) ->
            @dirty is true

        # Check if the node for a given ident is active and enabled. If
        # `enabled` is not defined, it is assumed to be true hence the
        # condition `isnt false`.
        isEnabled: (options) ->
            @get('enabled') isnt false

        # Return true if marked for removal
        isRemoved: (options) ->
            @removed is true


    { ContextNodeError, ContextNodeModel }
