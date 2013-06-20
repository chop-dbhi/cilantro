define [
    '../../../core'
    './base'
], (c, base) ->


    class ContextNodeError extends Error


    class ContextNodeModel extends c.Backbone.Model
        initialize: ->
            super
            # Save the last stable revision state
            @save()

        enable: ->
            @set('enabled', true, save: true)

        disable: ->
            @set('enabled', false, save: true)

        isEnabled: ->
            @get('enabled') isnt false

        # Returns true if the stable attributes are different from the
        # current state
        isDirty: ->
            not c._.isEqual(@toJSON(), @stableAttributes)

        # Returns true if the node _has_ been synced with the server, but
        # not necessarily up-to-date.
        isSynced: ->
            @stableAttributes? and not @validate(@stableAttributes)? and not @get('removed')

        destroy: ->
            @set('removed', true)
            @stableAttributes = null

        save: (options) ->
            @unset('removed')
            if (isValid = @isValid(options))
                @stableAttributes = @toJSON()
            return isValid

        set: (key, value, options) ->
            if typeof key is 'object'
                attrs = key
                options = value
            else
                (attrs = {})[key] = value
            options ?= {}
            super(attrs, options)
            if options.save then @save(options)
            return @

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

        # Attempts to fetch a node relative to this one. The `query` is a set
        # of attributes the target node must match in order to be returned.
        # Takes an option `create` which specifies a valid node type.
        find: (query, options={}) ->
            if c._.isEmpty(query)
                return false

            # Check against each key in the query for a match on attrs
            for key, value of query
                if @get(key) isnt value
                    match = false
                    break

            # Match successful, return this node
            if match isnt false
                return @

            if (type = options.create)
                return ContextNodeModel.create(type, query, options)

        # Alias for backwards compatibility
        fetch: (args...) ->
            @find(args...)


    { ContextNodeError, ContextNodeModel }
