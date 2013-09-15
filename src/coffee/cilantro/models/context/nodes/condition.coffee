define [
    'underscore'
    './base'
], (_, base) ->


    class ConditionNodeModel extends base.ContextNodeModel
        type: 'condition'

        validate: (attrs) ->
            if not (attrs.operator? and attrs.field? and attrs.value?)
                return 'Not a valid condition node'
            if _.isArray(attrs.value) and not attrs.value.length
                return 'Empty condition value'

        toJSON: (options) ->
            attrs = super(options)
            # No references...
            if attrs.value? and typeof attrs.value is 'object'
                attrs.value = _.clone(attrs.value)
            return attrs


    { ConditionNodeModel }
