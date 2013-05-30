define [
    '../../../core'
    './base'
], (c, base) ->


    class ContextNodeError extends Error


    class BaseNodeModel extends c.Backbone.Model
        clear: (options) ->
            attrs = @pick('concept', 'field')
            super(options)
            @set(attrs, silent: true)
            return

        # Attempts to fetch a node relative to this one. The `query` is a set
        # of attributes the target node must match in order to be returned.
        # Takes an option `create` which specifies a valid node type.
        fetch: (query, options={}) ->
            if c._.isEmpty(query)
                return false

            # Check against each key in the query for a match on attrs
            for key, value of query
                if @get(key) isnt value
                    match = false
                    break

            # Match successful, return this node
            if match isnt false then return @


    class BaseBranchNodeModel extends BaseNodeModel
        constructor: ->
            @children = new BaseNodeCollection null,
                parent: @

            # Proxy change events from children
            @children.on 'change', (model, collection, options) =>
                @trigger('change', @, options)

            super

        model: (attrs, options) ->
            if attrs.children?
                return new BaseBranchNodeModel(attrs, options)
            return new base.BaseNodeModel(attrs, options)

        toJSON: ->
            attrs = super
            attrs.children = @children.toJSON()
            return attrs

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


    class BaseNodeCollection extends c.Backbone.Collection
        model: (attrs, options) ->
            if options.create is 'branch'  or attrs.children?
                klass = BaseBranchNodeModel
            else
                klass = BaseNodeModel
            new klass(attrs, options)

        constructor: (models, options) ->
            super(models, options)
            @parent = options?.parent

        get: (attrs) ->
            if attrs instanceof c.Backbone.Model
                attrs = attrs.pick 'concept', 'field'
            @fetch(attrs)

        add: (models, options) ->
            models = if c._.isArray(models) then models[..] else [models]

            for model in models
                if model is @parent
                    throw new base.ContextNodeError 'Cannot add self as child'

            super(models, options)

        fetch: (query, options={}) ->
            create = options.create
            options.create = false

            for child in @models
                if (node = child.fetch(query, options))
                    return node

            # No nodes matched, create a node of the specified type with the
            # query as the default attributes.
            if create
                options.create = create
                @add(query, options)
                return @get(query)


    class ContextNodeModel extends BaseNodeModel
        publicModel: BaseNodeModel

        constructor: (attrs, options) ->
            @public = new @publicModel(null, options)
            @public.local = @
            super

        initialize: ->
            # Save the initial attributes to the public node.
            @save()

        enable: ->
            @set('enabled', true, save: true)

        disable: ->
            @set('enabled', false, save: true)

        isEnabled: ->
            @get('enabled') isnt false

        # Override to create a copy of the internal attributes for exposing
        # as `public` attributes.
        save: (options) ->
            if (isValid = @isValid(options))
                @public.set(@toJSON(options), options)
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

        fetch: (query, options={}) ->
            if not (node = super(query, options)) and (type = options.create)
                node = ContextNodeModel.create(type, query, options)
            return node


    {
        ContextNodeError, ContextNodeModel,
        BaseNodeModel, BaseBranchNodeModel, BaseNodeCollection
    }
