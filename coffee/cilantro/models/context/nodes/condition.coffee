define [
    '../../../core'
    './base'
], (c, base) ->


    class ConditionNodeModel extends base.ContextNodeModel
        nodeType: 'condition'

        validate: (attrs) ->
            if not (attrs.operator? and attrs.field? and attrs.value?)
                return 'Not a valid condition node'

        toJSON: (options) ->
            attrs = super(options)
            # No references...
            if attrs.value? and typeof attrs.value is 'object'
                attrs.value = c._.clone(attrs.value)
            return attrs


    { ConditionNodeModel }
