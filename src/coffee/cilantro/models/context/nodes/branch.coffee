define [
    'underscore'
    'backbone'
    './base'
], (_, Backbone, base) ->


    # Collection for representing a branch's child nodes
    class ContextNodeCollection extends Backbone.Collection
        # The 'parent' option is used to prevent circular references when
        # adding nodes to the collection.
        constructor: (models, options) ->
            super(models, options)
            @parent = options?.parent

        # Construct the appropriate model instance based on the `create`
        # option prior to adding it to the collection.
        model: (attrs, options) ->
            base.ContextNodeModel.create(attrs, options)

        # Find the node in the collection by using the primary lookup
        # attributes, 'concept' and 'field'.
        get: (attrs) ->
            if typeof attrs is 'number' or attrs.id? then return super(attrs)
            if attrs instanceof base.ContextNodeModel
                attrs = attrs.identity()
            else
                attrs = _.pick(attrs, @parent.identKeys)
            @find(attrs)

        # Perform the normal set operation, but ensuring the parent node is
        # not contained in the models being set.
        set: (models, options) ->
            if not models?
                return super(null, options)

            if not _.isArray(models)
                models = [models]

            for model in models
                if model is @parent
                    throw new base.ContextNodeError 'Cannot add self as child'

            super(models, options)

        # Attempt to find the node within the collection
        find: (ident, options) ->
            for child in @models
                if (node = child.find(ident, options))
                    return node


    # Branch-type node that acts as a container for other nodes. The `type`
    # determines the conditional relationship between the child nodes.
    class BranchNodeModel extends base.ContextNodeModel
        type: 'branch'

        childEventPrefix: 'child'

        # Default to an 'and' type with no children
        defaults: ->
            type: 'and'
            children: []

        constructor: ->
            @children = new ContextNodeCollection null,
                parent: @

            # Update chidren collection when the children attributes change.
            # This should only ever occur after a sync with the server. All
            # local changes should use the `children` collection directly.
            @on 'change:children', (model, value, options) ->
                @children.set(value, options)

            @listenTo @children, 'all', (event, args...) =>
                if not RegExp("^#{ @childEventPrefix }:").test(event)
                    event = "#{ @childEventPrefix }:#{ event }"
                @trigger(event, args...)

            super

        # Serializes the node to JSON including child nodes
        toJSON: ->
            (attrs = super).children = []
            for child in @children.models
                attrs.children.push child.toJSON()
            return attrs

        _recurse: (method, flag=true, options) ->
            options = _.extend
                deep: false
            , options

            if options.deep
                for child in @children.models
                    if child[method](options) is flag
                        return flag
            return not flag

        _isDirty: (options) ->
            not @isValid()

        isValid: (options={}) ->
            # Override to ensure the attributes are set
            options.validate = true
            if not @_validate(@toJSON(), options) then return false
            return @_recurse('isValid', false, options)

        isNew: (options) ->
            if super then return true
            return @_recurse('isNew', false, options)

        isEnabled: (options) ->
            if super then return true
            return @_recurse('isEnabled', true, options)

        isRemoved: (options) ->
            if super then return true
            return @_recurse('isRemoved', true, options)

        isDirty: (options) ->
            if super then return true
            return @_recurse('isDirty', true, options)

        # Branch nodes must of the type 'and' or 'or'
        validate: (attrs, options) ->
            if not (attrs.type is 'and' or attrs.type is 'or')
                return 'Not a valid branch type'

        # Define a node within this branch via the manager
        define: (attrs, options) ->
            options = _.extend
                manager: @manager
                identKeys: @identKeys
            , options

            @children.add(attrs, options)
            return @find(_.pick(attrs, options.identKeys))

        # Find itself or recurse into the children
        find: (ident, options) ->
            # Initially check if this node matches
            if (node = super(ident, options))
                return node
            return @children.find(ident, options)

        # Recursively clears all children, optionally resetting the children
        # collection.
        clear: (options={})->
            @children.each (model) ->
                model.clear(options)
            if options.reset
                @children.reset()
            return

        revert: (options) ->
            # Update internal `children` attributes prior to reverting to
            # since the state for children is stored in the `children`
            # collection.
            @set('children', @children.toJSON(), silent: true)
            super(options)


    { BranchNodeModel }
