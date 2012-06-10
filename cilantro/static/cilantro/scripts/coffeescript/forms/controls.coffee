define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    formActionsTemplate = _.template '
        <div class=form-actions>
            <button class="btn btn-mini btn-danger" name=exclude title="Exclude the results that match">Exclude</button>
            <button class="btn btn-mini btn-success" name=include title="Include the results that match">Include</button>
        </div>
    '


    # To reduce the number of possible operators (and confusion), operators
    # that support negation are presented via a button instead of a separate
    # operator.
    NEGATION_OPERATORS = {}

    DEFAULT_EVENTS =
        'submit': 'preventDefault'

        'click [name=include]': 'submitInclude'
        'click [name=exclude]': 'submitExclude'

        'mouseenter': 'showControls'
        'mouseleave': 'hideControls'
        'change [name=operator]': 'toggleControls'

    class Control extends Backbone.View
        events: DEFAULT_EVENTS

        initialize: (options) ->
            @options = options

            # Subscribe to edits for nodes relating to this DataField
            mediator.subscribe "datafield/#{ @model.id }/edit", (node) =>
                if node is @node then return
                @set(node)

            @setup()

        setup: ->
            @$label = @$ '.control-label'
            if @options.label is false
                @$label.hide()

            @$value = @$ '[name=value]'
            @$operator = @$ '[name=operator]'
            @$controls = @$ '.form-actions'

            for [operator, text] in (operators = @model.get 'operators')
                if operator.charAt(0) is '-'
                    NEGATION_OPERATORS[operator.substr(1)] = operator
                    continue
                @$operator.append "<option value=#{ operator }>#{ text }</option>"

            # If only one operator, don't bother displaying it
            if @$operator.children().length is 1
                @$operator.hide()

            @$el.append formActionsTemplate()

            @$include = @$ '[name=include]'
            @$exclude = @$ '[name=exclude]'


        get: (options) ->
            id = @node.id
            operator = @getOperator options
            value = @getValue options

            { id, operator, value }

        set: (node) ->
            @node = node

            value = @node.get 'value'
            operator = @node.get 'operator'

            if /^-/.test operator then operator = operator.substr(1)

            @setValue value
            @setOperator operator

        preventDefault: (event) ->
            event.preventDefault()

        getValue: (options) ->
            @$value.val()

        getOperator: (options={}) ->
            operator = @$operator.val()
            if options.negated and NEGATION_OPERATORS[operator]
                operator = NEGATION_OPERATORS[operator]
            return operator

        setValue: (value) ->
            @$value.val value

        setOperator: (value) ->
            @$operator.val value
            @toggleControls()

        submitInclude: (event) ->
            event.preventDefault()
            @node.set @get()

        submitExclude: (event) ->
            event.preventDefault()
            @node.set @get negated: true

        showControls: (event) ->
            @$controls.fadeTo 200, 1

        hideControls: (event) ->
            @$controls.fadeTo 400, 0.3

        toggleControls: (event) ->
            if NEGATION_OPERATORS[@$operator.val()]
                @$exclude.prop 'disabled', false
            else
                @$exclude.prop 'disabled', true


    class StringControl extends Control
        template: _.template '
            <div class=control-group>
                <h4 class=control-label>{{ label }}</h4>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <input class=span4 type=text name=value>
                    <p class=help-block>{{ help }}</p>
                </div>
            </div>
        '

        initialize: ->
            @setElement @template
                label: @model.get('alt_name') or @model.get('name')
                help: @model.get 'description'

            super


    class NumberControl extends Control
        template: _.template '
            <div class=control-group>
                <h4 class=control-label>{{ label }} <small class=units>({{ units }})</small></h4>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <input class=span4 type=number name=value>
                    <input class=span4 type=number name=value-2>
                    <p class=help-block>{{ help }}</p>
                </div>
            </div>
        '

        events: _.extend({}, DEFAULT_EVENTS, {'change [name=operator]': 'toggleOperator'})

        initialize: ->
            @setElement @template
                label: @model.get('alt_name') or @model.get('name')
                units: (units = @model.get('data').plural_unit)
                help: @model.get 'description'

            if not units then @$('.units').hide()

            super

        setup: ->
            super
            # Hide the secondary value by default
            @$value2 = @$('[name=value-2]').hide()

        getValue: ->
            if /range/.test @getOperator()
                [@$value.val(), @$value2.val()]
            else
                @$value.val()

        setValue: ->
            value = @node.get 'value'
            if /range/.test @node.get 'operator'
                @$value.val value[0]
                @$value2.val value[1]
            else
                @$value.val value

        toggleOperator: ->
            if /range/.test @getOperator()
                @$value2.show()
            else
                @$value2.hide()


    class EnumerableControl extends Control
        template: _.template '
            <div class=control-group>
                <h4 class=control-label>{{ label }}</h4>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <select class=span8 name=value multiple></select>
                    <p class=help-block>{{ help }}</p>
                </div>
            </div>
        '

        initialize: ->
            @setElement @template
                label: @model.get('alt_name') or @model.get('name')
                help: @model.get 'description'

            super

        setup: ->
            super
            @loadValues()


        loadValues: ->
            @$el.addClass 'loading'

            Backbone.ajax
                url: environ.absolutePath @model.get('links').values.href
                success: (resp) =>
                    for obj in resp
                        @$value.append "<option value=#{obj.value}>#{obj.name} (#{obj.count})</option>"
                    #@$value.select2()
                    @$el.removeClass 'loading'



    App.StringControl = StringControl
    App.NumberControl = NumberControl
    App.EnumerableControl = EnumerableControl


    { StringControl, NumberControl, EnumerableControl }
