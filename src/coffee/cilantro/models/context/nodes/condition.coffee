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
            if _.isArray(attrs.value) and attrs.operator is 'range'
                if attrs.value.length != 2
                    return 'Exactly 2 values must be supplied to define a range'
                if attrs.value[0] > attrs.value[1]
                    return 'Lower bound value must be less than upper bound value'

        toJSON: (options) ->
            attrs = super(options)
            # No references...
            if attrs.value? and typeof attrs.value is 'object'
                attrs.value = _.clone(attrs.value)
            return attrs


    { ConditionNodeModel }
