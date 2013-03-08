define [
    '../core'
    '../controls'
    'inputio'
    'tpl!templates/views/field-control.html'
], (c, controls, InputIO, templates...) ->

    templates = c._.object ['control'], templates

    FORM_ELEMENTS = 'input,select,textarea'


    class FieldControl extends controls.Control
        className: 'field-control'

        template: templates.control

        options:
            # A flag denoting whether or not this FieldControl is managed
            # by a ConceptControlView. Managed views have their validation errors
            # caught by the parent view. Default to false
            managed: true

        events:
            'keyup input': 'change'
            'change select': 'change'
            'click input[type=radio],input[type=checkbox]': 'change'

        ui:
            add: '.actions .add'
            remove: '.actions .remove'
            update: '.actions .update'

        constructor: ->
            super

            # Cache context nodes by cid
            @_nodeCache = {}

            # Various ways to define the UI elements
            @ui = _.extend {}, @constructor.defaultUI, @ui, @options.ui
            @attrs = _.extend {}, @constructor.defaultAttrs, @attrs, @options.attrs

        # Given a client id, deference the node
        _deferenceNode: (cid) ->
            if (node = @_nodeCache[cid])?
                delete @_nodeCache[cid]
                # Delete reference here
                if @node.cid is id then delete @node
                return node

        # Gets the value corresonding to the property.
        _getProp: (prop) ->
            if not ($el = @ui[prop])? then return
            if $el.is(FORM_ELEMENTS)
                InputIO.get($el)
            else
                $el.attr(@options.attrs[prop])

        _setProp: (prop, value) ->
            if not ($el = @ui[prop])? then return
            if $el.is(FORM_ELEMENTS)
                InputIO.set($el, value)
            else
                $el.attr(@options.attrs[prop], value)
            return

        getId: -> @model.id or @_getProp('id')
        getOperator: -> @_getProp('operator')
        getValue: -> @_getProp('value')
        getNulls: -> @_getProp('nulls')

        setId: (value) -> not @model.id and @_setProp('id', value)
        setOperator: (value) -> @_setProp('operator', value)
        setValue: (value) -> @_setProp('value', value)
        setNulls: (value) -> @_setProp('nulls', Boolean(value))

        reset: -> @set()

        # Triggered any time the control contents have changed
        change: (event) ->
            @trigger 'change', @, @get()

        # Creates a new node with the control contents
        add: ->
            @node = node = new c.models.ContextNode @get()
            @_nodeCache[node.cid] = node
            if @options.managed
                @ui.add.hide()
                @ui.update.show()
            @trigger 'add', @, node

        # Updates the current node with the control contents
        update: ->
            @node.set @get()
            @trigger 'update', @, @node

        # Removes a node, but leaves the control contents alone.
        remove: (cid) ->
            node = @_deferenceNode cid
            @trigger 'remove', @, node
            if @managed and not @node
                @ui.update.hide()
                @ui.add.show()


    # Selectors of elements that pertain to the data attribute
    # for the node. The `nulls` selector is used to flag whether
    # or not to include empty and/or NULL values.
    FieldControl.defaultUI =
        id: '[name=id],[data-id]'
        value: '[name=value],[data-value]'
        operator: '[name=operator],[data-operator]'
        nulls: '[name=nulls],[data-nulls]'


    # Attribute-based properties representing a constant value
    FieldControl.defaultAttrs =
        id: 'data-id'
        value: 'data-value'
        operator: 'data-operator'
        nulls: 'data-nulls'


    { FieldControl }
