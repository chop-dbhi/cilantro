define [
    './core'
    'tpl!templates/button/select.html'
    'tpl!templates/button/select-option.html'
], (c, templates...) ->

    templates = c._.object ['select', 'option'], templates


    class ButtonSelectEmptyOption extends c.Marionette.ItemView
        className: 'disabled'

        tagName: 'li'

        template: templates.option

        events:
            'click': 'prevent'

        prevent: (event) ->
            event?.preventDefault()

        serializeData: ->
            label: 'No options are available'


    class ButtonSelectOption extends c.Marionette.ItemView
        tagName: 'li'

        template: templates.option

        events:
            'click': 'select'

        serializeData: ->
            label: @model.get('label') or @model.get('value')

        select: (event) ->
            event?.preventDefault()
            @model.set('selected', true)


    class ButtonSelect extends c.Marionette.CompositeView
        className: 'btn-group btn-select'

        template: templates.select

        itemView: ButtonSelectOption

        itemViewContainer: '.dropdown-menu'

        emptyView: ButtonSelectEmptyOption

        options:
            placeholder: '----'

        ui:
            toggle: '.dropdown-toggle'
            menu: '.dropdown-menu'
            selection: '.dropdown-selection'

        collectionEvents:
            'change:selected': 'updateSelection'

        constructor: (options={}) ->
            if not (options.collection instanceof c.Backbone.Collection)
                # Convert from flat list of values into objects
                if (choices = options.collection)? and typeof choices[0] isnt 'object'
                    choices = (value: value, label: value for value in choices)
                options.collection = new c.Backbone.Collection choices
            super(options)

        setSelection: (value) ->
            if (model = @collection.findWhere(value: value))
                model.set('selected', true)

        getSelection: (value) ->
            if (model = @collection.findWhere(selected: true))
                model.get('value')

        updateSelection: (model, selected, options) ->
            if not selected then return
            value = model.get('value')

            # Disable all other selected model
            @collection.each (_model) ->
                if _model isnt model
                    _model.set('selected', false, silent: true)

            @ui.selection.html(model.get('label') or value)

            # Trigger DOM event
            @$el.trigger('change', value)
            # Trigger view event
            @trigger('change', model, value, options)

        onRender: ->
            if /^(small|large|mini)$/.test(@options.size)
                @ui.toggle.addClass("btn-#{ @options.size }")

            @ui.toggle.dropdown()

            if (model = @collection.findWhere({selected: true}))
                @updateSelection(model, true)
            else
                @ui.selection.html(@options.placeholder)


    { ButtonSelect }
