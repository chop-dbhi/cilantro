define [
    '../../core'
    '../controls'
    'inputio'
], (c, controls, InputIO) ->

    FORM_ELEMENTS = 'input,select,textarea'

    # Encapsulates a group of control elements that represents a
    # ContextNode, i.e. a single condition or branch of nodes. When
    # the data is ready to be saved, the view will utilize various
    # methods to extract and populate the ContextNode model instance.
    # ---
    # A node property can be represented as a static value via an attribute
    # (e.g. data-id="39") or as a dynamic value via a form element.

    class FieldControl extends controls.Control

        options:
            # A flag denoting whether or not this FieldControl is managed
            # by a ConceptControlView. Managed views have their validation errors
            # caught by the parent view. Default to false
            managed: false

            # Selectors of elements that pertain to the data attribute
            # for the node. The `nullSelector` is used to flag whether
            # or not to include empty and/or NULL values. The `nullsSelector`
            # must be a checkbox, unless the `nullsAttr` has a value set.
            idSelector: '[data-id]'
            valueSelector: '[data-value]'
            operatorSelector: '[data-operator]'
            nullsSelector: '[data-nulls]'

            # Attribute-based properties representing a constant value
            idAttr: 'data-id'
            valueAttr: 'data-value'
            operatorAttr: 'data-operator'
            nullsAttr: 'data-nulls'

        events:
            'keyup input': 'change'
            'change select': 'change'
            'click input[type=radio],input[type=checkbox]': 'change'

        initialize: ->
            @managed = @options.managed

            @idSelector = @options.idSelector
            @valueSelector = @options.valueSelector
            @operatorSelector = @options.operatorSelector
            @nullsSelector = @options.nullsSelector

            @idAttr = @options.idAttr
            @valueAttr = @options.valueAttr
            @operatorAttr = @options.operatorAttr
            @nullsAttr = @options.nullsAttr

            @_resetReferences()

        # This must be called if the underlying DOM elements change
        _resetReferences: ->
            @$id = if @$el.is @idSelector then @$el else @$ @idSelector
            @$operator = if @$el.is @operatorSelector then @$el else @$ @operatorSelector
            @$value = if @$el.is @valueSelector then @$el else @$ @valueSelector
            @$nulls = if @$el.is @nullsSelector then @$el else @$ @nullsSelector

        # Given a client id, deference the node
        _deferenceNode: (cid) ->
            if (node = @_nodeCache[cid])?
                delete @_nodeCache[cid]
                # Delete reference here
                if @node.cid is id then delete @node
                return node

        # Gets the DataField `id`
        getId: ->
            if @model.id
                @model.id
            else
                if @$id.is FORM_ELEMENTS
                    id = InputIO.get @$id
                else
                    id = @$id.attr @idAttr
                @cleanId id

        # Get the operator
        getOperator: ->
            if @$operator.is FORM_ELEMENTS
                operator = InputIO.get @$operator
            else
                operator = @$operator.attr @operatorAttr
            @cleanOperator operator

        getValue: ->
            if @$value.is FORM_ELEMENTS
                value = InputIO.get @$value
            else
                value = @$value.attr @valueAttr
            @cleanValue value

        getNulls: ->
            if @$nulls.is FORM_ELEMENTS
                nulls = InputIO.get @$nulls
            else
                nulls = @$nulls.attr @nullsAttr
            @cleanNulls nulls

        setId: (id) ->
            if @model.id then return
            if @$id.is FORM_ELEMENTS
                InputIO.set @$id, id
            else
                @$id.attr @idAttr, id
            return

        setOperator: (operator) ->
            if @$operator.is FORM_ELEMENTS
                InputIO.set @$operator, operator
            else
                @$operator.attr @operatorAttr, operator
            return

        setValue: (value) ->
            if @$value.is FORM_ELEMENTS
                InputIO.set @$value, value
            else
                @$value.attr @valueAttr, value
            return

        # Special case since this is purely a boolean field
        setNulls: (value) ->
            value = Boolean value
            if @$nulls.is FORM_ELEMENTS
                InputIO.set @$nulls, value
            else
                @$nulls.attr @nullsAttr, value
            return

        # Triggered any time the control contents have changed
        change: (event) ->
            @trigger 'change', @, @get()

        # Creates a new node with the control contents
        add: ->
            @node = node = new c.models.ContextNode @get()
            @_nodeCache[node.cid] = node
            if not @managed
                @$add.hide()
                @$update.show()
            @trigger 'add', @, node

        # Updates the current node with the control contents
        update: ->
            @node.set @get()
            @trigger 'update', @, @node

        # Removes a node, but leaves the control contents alone.
        remove: (cid) ->
            node = @_deferenceNode cid
            if not @managed and not @node
                @$update.hide()
                @$add.show()
            @trigger 'remove', @, node

        reset: -> @set()

    { FieldControl }
