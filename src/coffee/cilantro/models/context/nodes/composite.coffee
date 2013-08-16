define [
    './base'
], (base) ->


    class CompositeNodeModel extends base.ContextNodeModel
        type: 'composite'

        validate: (attrs) ->
            if not attrs.composite?
                return 'Not a valid composite node'


    { CompositeNodeModel }
