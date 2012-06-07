define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    # To reduce the number of possible operators (and confusion), operators
    # that support negation are presented via a button instead of a separate
    # operator.
    NEGATION_OPERATORS = {}

    class Control extends Backbone.View
        events:
            'submit': 'preventDefault'

            'click [name=include]': 'submitInclude'
            'click [name=exclude]': 'submitExclude'

            'mouseenter': 'showControls'
            'mouseleave': 'hideControls'
            'change [name=operator]': 'toggleControls'

        initialize: ->
            # Subscribe to edits for nodes relating to this DataField
            mediator.subscribe "datafield/#{ @model.id }/edit", (node) =>
                if node is @node then return
                @node = node
                @set()

        setup: ->
            for [operator, text] in @model.get 'operators'
                if operator.charAt(0) is '-'
                    NEGATION_OPERATORS[operator.substr(1)] = operator
                    continue
                @$operator.append "<option value=#{ operator }>#{ text }</option>"

        get: (options) ->
            id = @node.id
            operator = @getOperator options
            value = @getValue options

            { id, operator, value }

        set: ->
            value = @node.get 'value'
            operator = @node.get 'operator'

            if /^-/.test operator then operator = operator.substr(1)

            @setValue value
            @setOperator operator

        getValue: (options) ->
            @value.val()

        getOperator: (options) ->
            if options.negated and NEGATION_OPERATORS[(operator = @operator.val())]
                operator = NEGATION_OPERATORS[operator]
            return operator

        setValue: (value) ->
            @value.val value

        setOperator: (value) ->
            @operator.val value
            @toggleControls()

        preventDefault: (event) ->
            event.preventDefault()

        submitInclude: (event) ->
            event.preventDefault()
            @node.set @get()

        submitExclude: (event) ->
            event.preventDefault()
            @node.set @get negated: true

        showControls: (event) ->
            @$controls.fadeIn 300

        hideControls: (event) ->
            @$controls.fadeOut 300

        toggleControls: (event) ->
            if NEGATION_OPERATORS[@$operator.val()]
                @$exclude.prop 'disabled', false
            else
                @$exclude.prop 'disabled', true


    class StringControl extends Control
        template: _.template '
            <div class=control-group>
                <label class=control-label>{{ label }}</label>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <input class=span4 type=text name=value>
                    <p class=help-block>{{ help }}</p>
                </div>
                <div class=form-actions>
                    <button class="btn btn-mini btn-danger" name=exclude>Exclude</button>
                    <button class="btn btn-mini btn-success" name=include>Include</button>
                </div>
            </div>
        '
           
        initialize: ->
            super

            @setElement @template
                label: @model.get 'name'
                help: @model.get 'description'

            @$value = @$ '[name=value]'
            @$operator = @$ '[name=operator]'
            @$controls = @$ '.form-actions'

            @setup()
 

    class NumberControl extends Control
        template: _.template '
            <div class=control-group>
                <label class=control-label>{{ label }}</label>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <input class=span4 type=number name=value>
                    <input class=span4 type=number name=value-2>
                    <span class=units>{{ units }}</span>
                    <p class=help-block>{{ help }}</p>
                </div>
                <div class=form-actions>
                    <button class="btn btn-mini btn-danger" name=exclude>Exclude</button>
                    <button class="btn btn-mini btn-success" name=include>Include</button>
                </div>
            </div>
        '
            
        initialize: ->
            super

            @setElement @template
                label: @model.get 'name'
                units: @model.get 'units'
                help: @model.get 'description'

            @$value = @$ '[name=value]'
            @$value2 = @$ '[name=value-2]'
            @$operator = @$ '[name=operator]'
            @$controls = @$ '.form-actions'

            @setup()
 

    ###
    class ControlGroup extends Backbone.View
        template: _.template '
            <div class=control-group>
                <label class=control-label>{{ label }}</label>
                <div class=controls></div>
            </div>
        '

        initialize: (options) ->
            @setElement @template()
            @$label = @$el.find '.control-label'
            @$controls = @$el.find '.controls'
            @$helpBlock = @$el.find '.help-block'
            @hasField = false

        addField: (el) ->
            if @hasField
                @$controls.find('input,select').after el
            else
                @$controls.prepend el
                @hasField = true

    ###
    
    App.StringControl = StringControl
    App.NumberControl = NumberControl

    { StringControl, NumberControl }
