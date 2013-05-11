define [
    '../../../core'
    './base'
], (c, base) ->


    class ContextNodeCollection extends base.BaseNodeCollection
        model: (attrs, options) ->
            base.ContextNodeModel.create(attrs, options)


    # Branch-type node that acts as a container for other nodes. The `type`
    # determines the conditional relationship between the child nodes.
    class BranchNodeModel extends base.ContextNodeModel
        nodeType: 'branch'

        publicModel: base.BaseBranchNodeModel

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
                @children.set value, options

            super

        toJSON: ->
            attrs = super
            attrs.children = @children.toJSON()
            return attrs

        # Override to ensure the attributes are set
        isValid: (options={}) ->
            options.validate = true
            @_validate(@toJSON(), options)

        # If `deep` is true, children are also validated (and recursed). If
        # any fail to validate, the branch is considered invalid. If `strict`
        # is true, the branch must have at least one child to be valid
        validate: (attrs, options) ->
            options = c._.extend
                deep: true
                strict: false
            , options

            if not (attrs.type is 'and' or attrs.type is 'or')
                return 'Not a valid branch type'

            if not attrs.children?
                return 'No branch children'

            if options.strict and not attrs.children.length
                return 'No children in branch'

            if options.deep
                for child in attrs.children
                    if child instanceof base.ContextNodeModel
                        if not child.isValid(options)
                            return child.validationError
                    else if (message = base.ContextNodeModel::validate.call(child, child, options))
                        return message
            return

        # Attempts to fetch this node or one of the children based on the
        # query attributes. To prevent pre-maturely creating a new node, the
        # `create` option is explicity set to false during the recursion.
        # One thing to note, is that a fetch does not uniformly increase it's
        # depth of search per iteration. It will recurse as deep as it can go
        # per child.
        fetch: (query, options) ->
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
                if (node = @children.fetch(query, options))
                    return node

        # If strict is `true` all child must be valid to perform the save.
        # The default is `false` and will simply ignore invalid children.
        save: (options) ->
            options = c._.extend
                strict: false
            , options

            # Confirm the branch itself is valid
            if not @isValid(deep: false)
                return false

            attrs = c._.clone @attributes
            children = []

            for child in @children.models
                if child.isValid(options)
                    child.save(options)
                else if options.strict
                    return false
                else
                    continue
                child = child.public.toJSON()
                children.push(child)

            # Update pending public attributes with validated children
            attrs.children = children
            if @field? then attrs.field = @field
            if @concept? then attrs.concept = @concept
            @public.set(attrs)
            return true

        clear: (options) ->
            if not @children.length then return
            @children.each (model) -> model.clear(options)
            return


    { BranchNodeModel }
