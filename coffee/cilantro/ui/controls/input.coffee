define [
    '../core'
    'tpl!templates/views/text-input.html'
    'tpl!templates/views/static-input.html'
    'tpl!templates/views/boolean-input.html'
    'tpl!templates/views/select-input.html'
    'tpl!templates/views/typeahead-input.html'
    'tpl!templates/views/range-input.html'
    'tpl!templates/views/operator-input.html'
], (c, templates...) ->

    templates = c._.object ['text', 'static', 'boolean', 'select', 'typeahead', 'range', 'operator'], templates


    class Input extends c.Marionette.ItemView
        template: templates.text

        className: 'control-input'

        options:
            inputAttrs: {}

        ui:
            input: '.input'
            units: '.units'

        onRender: ->
            @ui.input.attr(@options.inputAttrs)


    class StaticInput extends Input
        template: templates.static


    class BooleanInput extends Input
        template: templates.boolean


    class TextInput extends Input


    class SelectInput extends Input
        template: templates.select

        initialize: ->
            @on 'render', =>
                @model?.values(@renderOptions)

        parseOption: (option) -> [option.value, option.label]

        renderOptions: (options={}) =>
            @ui.input.empty()
            if @options.allowEmpty isnt false
                @ui.input.append('<option value=>---</option>')
            for option in options
                [value, label] = @parseOption(option)
                @ui.input.append("<option value=\"#{ value }\">#{ label }</option>")
            return


    class TypeaheadInput extends Input
        template: templates.typeahead


    class RangeInput extends Input
        template: ->

        options:
            inputView: TextInput

        onRender: ->
            # Replace inputs with derived from inputView
            @input1 = new @options.inputView(@options)
            @input2 = new @options.inputView(@options)

            @input1.render()
            @input1.ui.units.hide()
            @input2.render()

            # Append to the input div
            @$el.append(@input1.el, @input2.el)
            @ui.input = @$el.children()


    # Specialized input for the operator
    class OperatorInput extends SelectInput
        template: templates.operator

        initialize: ->
            @on 'render', =>
                options = allowEmpty: @options.allowEmpty
                if @model? then @renderOptions(@model.get('operators'), options)

        parseOption: (option) -> option




    { TextInput, StaticInput, BooleanInput, SelectInput, TypeaheadInput, RangeInput, OperatorInput }
