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

        events:
            'keyup input': 'change'
            'change select': 'change'
            'click input[type=radio],input[type=checkbox]': 'change'

        constructor: ->
            super

            # Various ways to define the UI elements
            @ui = _.extend {}, @constructor.defaultUI, @ui, @options.ui
            @attrs = _.extend {}, @constructor.defaultAttrs, @attrs, @options.attrs

        # Gets the value corresonding to the attribute key
        _getAttr: (prop, type) ->
            if not ($el = @ui[prop])? then return
            if $el.is(FORM_ELEMENTS)
                InputIO.get($el, type)
            else
                $el.attr(@attrs[prop])

        _setAttr: (prop, value) ->
            if not ($el = @ui[prop])? then return
            if $el.is(FORM_ELEMENTS)
                InputIO.set($el, value)
            else
                $el.attr(@attrs[prop], value)
            return

        getId: -> @model?.id or @_getAttr('id')
        getOperator: -> @_getAttr('operator', 'string')
        getValue: -> @_getAttr('value', @model?.get('simple_type'))
        getNulls: -> @_getAttr('nulls', 'boolean')

        setId: (value) -> not @model?.id and @_setAttr('id', value)
        setOperator: (value) -> @_setAttr('operator', value)
        setValue: (value) -> @_setAttr('value', value)
        setNulls: (value) -> @_setAttr('nulls', Boolean(value))

        # Triggered any time the control contents have changed. Upstream, the
        # context can be bound to this event and update itself as changes
        # occur.
        change: (event) ->
            @trigger 'change', @, @get()


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
