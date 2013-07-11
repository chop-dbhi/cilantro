define [
    './core'
    './base'
    '../models'
    'tpl!templates/values/list.html'
    'tpl!templates/values/item.html'
], (c, base, models, templates...) ->

    templates = c._.object ['list', 'item'], templates


    class EmptyItem extends base.EmptyView
        icon: false

        message: 'Search or browse values on the left or click "Edit List" above to paste in a list of values. (Hint: you can copy and paste in a column from Excel)'


    class ValueItem extends c.Marionette.ItemView
        template: templates.item

        className: 'value-item'

        ui:
            status: '.status'
            remove: 'button'

        events:
            'click button': 'destroy'

        modelEvents:
            'change:valid': 'toggleValid'
            'change:pending': 'togglePending'

        # This will trigger the collection event which will remove
        # this item.
        destroy: ->
            @model.destroy()

        toggleValid: (model, valid, options) ->
            @ui.status.show()
            if valid
                @ui.status
                    .html('<i class="icon-ok text-success"></i>')
                    .fadeOut 2000, =>
                        @ui.status.html('')
            else
                @ui.status
                    .html('<i class="icon-exclamation text-warning"></i>')

        togglePending: (model, pending, options) ->
            if not pending then return
            @ui.status.html('<i class="icon-spinner icon-spin"></i>').show()


    # Interface for representing a user-defined/selected list of values.
    # There is a list view as well as a textarea for editing the raw text or
    # for pasting in a list of values.
    #
    # This expects a collection such as cilantro/models/value#Values
    class ValueList extends c.Marionette.CompositeView
        className: 'value-list'

        template: templates.list

        itemView: ValueItem

        emptyView: EmptyItem

        itemViewContainer: '.items-list'

        collectionEvents:
            'reset': 'clearText'
            'sort': 'sortItems'

        ui:
            toggle: '.toggle'
            list: '.items-list'
            textarea: '.items-text'

        events:
            'click .toggle': 'toggle'
            'click .clear': 'clear'

        clear: (event) ->
            event?.preventDefault()
            @collection.reset()

        toggle: (event) ->
            event?.preventDefault()

            if @ui.list.is(':visible')
                @loadText()
                @ui.list.hide()
                @ui.textarea.show()
                @ui.toggle.html('<i class=icon-list></i> Show List')
            else
                @parseText()
                @ui.list.show()
                @ui.textarea.hide()
                @ui.toggle.html('<i class=icon-edit></i> Edit List')

        # Sort the children based on the models
        sortItems: (collection, options) ->
            @collection.each (model) =>
                view = @children.findByModel(model)
                @$(@itemViewContainer).append(view.el)

        # Clear the text
        clearText: ->
            @ui.textarea.val('')

        # Load values in textarea
        loadText: ->
            @ui.textarea.val(@collection.pluck('value').join('\n'))

        # Split by line, create a new set of models and update the collection
        # based on the value
        parseText: ->
            models = []
            values = c.$.trim(@ui.textarea.val()).split('\n')
            # We can only make use of the value as label at this point
            # since resolving the label may require an server lookups.
            # This is harmless since _this_ is what the user entered.
            # Also, the only cases where the value and label would
            # differ is either pretty formating (capitalization) or the
            # value is the primary key and the label is some other
            # string (e.g. foreign key, lexicon, object set)
            for value, i in values
                # Ignore empty lines
                if not (value = $.trim(value))
                    continue

                # If the model already exists, use it so it does not
                # reset (and thus revalidate) the attributes.
                if (model = @collection.get(value))
                    model.set('index', i)
                    models.push model
                else
                    models.push
                        value: value
                        label: value
                        index: i

            @collection.set(models)


    { ValueList }
