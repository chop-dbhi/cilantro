define [
    'jquery'
    'underscore'
    'marionette'
    './base'
    '../models'
    '../constants'
    'tpl!templates/values/list.html'
], ($, _, Marionette, base, models, constants, templates...) ->

    templates = _.object ['list'], templates

    # Interface for representing a user-defined/selected list of values
    # in a textarea (one value per line).
    # This expects a collection such as cilantro/models/value#Values
    class ValueList extends Marionette.ItemView
        className: 'value-list'

        template: templates.list

        # Listen for collection events to update the textarea to match
        # the values
        collectionEvents:
            'add': 'reloadText'
            'remove': 'reloadText'
            'reset': 'clearText'

        ui:
            textarea: 'textarea'

        clear: (event) ->
            event?.preventDefault()
            @collection.reset()

        clearText: ->
            @ui.textarea.val('')

        initialize: ->
            @_parseText = _.debounce(@parseText, constants.INPUT_DELAY)

        # Load values in textarea
        reloadText: ->
            @ui.textarea.val(@collection.pluck('value').join('\n'))

        # Split by line, create a new set of models and update the collection
        # based on the value
        parseText: ->
            models = []
            values = $.trim(@ui.textarea.val()).split('\n')

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

            # We disable sorting when parsing the text because the sorting
            # can change the order of the textarea but not the cursor position.
            # For example, let's say you had 1, 3, 4, 5, 6 in the textarea and
            # you typed 2 and before you could type a 0, the 2 model is added
            # and the order changes so now the cursor is after the 6.
            # Basically, this prevents the text from changing while the user
            # is editing it. The sorting will only happen when items are
            # explicitly added to the collection.
            @collection.set(models, {sort: false})

        onRender: ->
            @ui.textarea.on 'input propertychange', =>
                @_parseText()


    { ValueList }
