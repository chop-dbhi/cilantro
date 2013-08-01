define [
    '../../../core'
    './base'
], (c, base) ->


    class ContextNodeCollection extends c.Backbone.Collection
        constructor: (models, options) ->
            super(models, options)
            @parent = options?.parent

        model: (attrs, options) ->
            args = [attrs, options]
            if options.create?
                args.splice(0, 0, options.create)
            base.ContextNodeModel.create(args...)

        get: (attrs) ->
            if attrs.id? then return super(attrs)
            if attrs instanceof c.Backbone.Model
                attrs = attrs.pick 'concept', 'field'
            @find(attrs)

        set: (models, options) ->
            if not models?
                return super(null, options)

            models = if c._.isArray(models) then models else [models]
            cleaned = []

            for model in models
                if model is @parent
                    throw new base.ContextNodeError 'Cannot add self as child'
                else if model instanceof base.ContextNodeModel and model.get('removed')
                    continue
                else if model.removed
                    continue
                else
                    cleaned.push model

            super(cleaned, options)

        find: (query, options={}) ->
            create = options.create
            options.create = false

            for child in @models
                if (node = child.find(query, options))
                    return node

            # No nodes matched, create a node of the specified type with the
            # query as the default attributes.
            if create
                options.create = create
                @add(query, options)
                return @get(query)

        # Alias for backwards compatibility
        fetch: (args...) ->
            @find(args...)


    # Branch-type node that acts as a container for other nodes. The `type`
    # determines the conditional relationship between the child nodes.
    class BranchNodeModel extends base.ContextNodeModel
        type: 'branch'

        defaults: ->
            type: 'and'
            children: []

        constructor: ->
            @children = new ContextNodeCollection null,
                parent: @

            # Proxy change events from children
            @children.on 'change', (model, collection, options) =>
                @trigger('change', @, options)

            # Update chidren collection when the children attributes change.
            # This should only ever occur after a sync with the server. All
            # local changes should use the `children` collection directly.
            @on 'change:children', (model, value, options) ->
                @children.set(value, options)

            super

        toJSON: ->
            # Clone attributes, remove reference to children. The stable
            # node has no reason to carry about the reference
            (attrs = super).children = []
            for child in @children.models
                if not child.get('removed')
                    attrs.children.push child.toJSON()
            return attrs

        # Override to ensure the attributes are set
        isValid: (options={}) ->
            options.validate = true
            @_validate(@toJSON(), options)

        # Returns true is no children nodes are present
        isEmpty: ->
            @children.length is 0

        # If `deep` is true, children are also validated (and recursed). If
        # any fail to validate, the branch is considered invalid.
        validate: (attrs, options) ->
            options = c._.extend
                deep: true
                empty: true
            , options

            if not (attrs.type is 'and' or attrs.type is 'or')
                return 'Not a valid branch type'

            if not attrs.children?
                return 'No branch children'

            if not options.empty and @isEmpty()
                return 'Children are empty'

            if options.deep
                for child in attrs.children
                    if child instanceof base.ContextNodeModel
                        if not child.isValid(options)
                            return child.validationError
                    else if (message = base.ContextNodeModel::validate.call(child, child, options))
                        return message
            return

        # Attempts to find this node or one of the children based on the
        # query attributes. To prevent pre-maturely creating a new node, the
        # `create` option is explicity set to false during the recursion.
        # One thing to note, is that a find does not uniformly increase it's
        # depth of search per iteration. It will recurse as deep as it can go
        # per child.
        find: (query, options) ->
            options = c._.extend
                deep: true
                create: false
            , options

            create = options.create
            options.create = false

            # Initially check if this node matches
            if (node = super(query, options))
                return node

            if options.deep
                options.create = create
                if (node = @children.find(query, options))
                    return node

        destroy: (options={}) ->
            @set('removed', true)
            @stableAttributes = null
            return

        # Check if the branch itself is valid and saves all child. A deep
        # saves children recursively.
        save: (options) ->
            options = c._.extend
                deep: false
                strict: false
            , options

            if not @isValid(deep: false, empty: false)
                return false

            attrs = c._.clone @attributes

            delete attrs.children
            children = []

            for child in @children.models
                # Ignore removed children
                if child.get('removed')
                    continue

                if (options.deep and not child.save(null, deep: true)) or not child.isValid()
                    if options.strict then return false
                else
                    if child.stableAttributes?
                        children.push(child.stableAttributes)

            attrs.children = children
            @stableAttributes = attrs
            @unset('removed')
            return true

        # Clears recursively clears all children
        clear: (options={})->
            @children.each (model) ->
                model.clear(options)
            if options.reset
                @children.reset()
            return


    { BranchNodeModel }
