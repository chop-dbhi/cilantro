define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
    'templates'
], (environ, $, _, Backbone, Templates) ->

    class ControlGroup extends Backbone.View
        template: Templates.controlGroup

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


    class FilterForm extends Backbone.View
        tagName: 'form'
        className: 'form-inline'

        events:
            'submit': 'preventDefault'
            'click [name=filter]': 'applyFilter'
            'click [name=exclude]': 'applyExclude'

        initialize: ->
            @fieldsets = {}
            for model in @collection.models
                if model.get('data').enumerable
                    view = new MultiEnumControlGroup
                        model: model
                else
                    view = new FilterControlGroup
                        model: model

                group = new ControlGroup
                group.addField view.$el
                @$el.append group.$el
                @fieldsets[model.id] = view

            @$controls = $ '
                <div class=form-controls>
                    <button class="btn success" name=filter>Filter</button>
                    <button class="btn danger" name=exclude>Exclude</button>
                </div>
            '
            @$el.append @$controls



        preventDefault: (event) ->
            event.preventDefault()

        applyFilter: ->

        applyExclude: ->


    class FilterControlGroup extends Backbone.View
        template: _.template '
            <div class=control-group>
                <label class=control-label>{{ label }}</label>
                <div class=controls>
                    <select class=span4 name=operator></select>
                    <input class=span4 type={{ type }} name=value>
                    <span class=units>{{ units }}</span>
                    <p class=help-block>{{ help }}</p>
                </div>
            </div>
        '

        typeMap:
            'boolean': 'checkbox'
            'number': 'number'
            'string': 'text'

        initialize: (options) ->
            attrs = @model.toJSON()
            @setElement @template
                label: attrs.name
                help: attrs.description
                type: @typeMap[attrs.data.type]
                units: attrs.data.units

            @operator = @$el.find '[name=operator]'
            @value = @$el.find '[name=value]'

            $.each @model.get('operators'), (i, choice) =>
                option = $ "<option value=\"#{ choice[0] }\">#{ choice[1] }</option>"
                @operator.append option

        render: (filter) ->
            if filter
                @filter = filter
                @setOperator()
                @setValue()

        getOperator: ->
            @operator.val()

        getValue: ->
            @value.val()

        setOperator: ->
            @operator.val @filter.get 'operator'

        setValue: ->
            @value.val filter.get 'value'

        applyFilter: ->
            @filter.set
                value: @getValue()
                operator: @getOperator()
                negate: false

        applyExclude: ->
            @filter.set
                value: @getValue()
                operator: @getOperator()
                negate: true


    class NumberControlGroup extends FilterControlGroup
        events:
            'change [name=operator]': 'toggleOperator'

        initialize: ->
            super
            # Hide by default
            @value2 = @$el.find('[name=value2]').hide()

        getValue: ->
            if /range/.test @getOperator()
                [@value.val(), @value2.val()]
            else
                @value.val()

        setValue: ->
            value = @filter.get 'value'
            if /range/.test @filter.get 'operator'
                @value.val value[0]
                @value2.val value[1]
            else
                @value.val value

        toggleOperator: ->
            if /range/.test @getOperator()
                @value2.show()
            else
                @value2.hide()


    class SingleEnumControlGroup extends FilterControlGroup
        initialize: (options) ->
            super
            # Populate the values
            $.each @model.get('data').choices, (i, choice) =>
                option = $ "<option value=\"#{ choice[0] }\">#{ choice[1] }</option>"
                @value.append option


        getOperator: -> 'in'


    class MultiEnumControlGroup extends SingleEnumControlGroup
        template: _.template '
            <select name=value multiple></select>
        '

    { FilterForm, FilterControlGroup, NumberControlGroup, SingleEnumControlGroup, MultiEnumControlGroup }
