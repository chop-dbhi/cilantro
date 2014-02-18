define [
    'underscore'
    'backbone'
    'marionette'
    './base'
], (_, Backbone, Marionette, base) ->

    class SelectionCollection extends Backbone.Collection
        model: Backbone.Model

        parse: (response) ->
            return response.values

    class SelectionListItem extends Marionette.ItemView
        template: ->

        tagName: 'option'

        modelEvents: ->
            'change:selected': 'render'

        onRender: ->
            @$el.text(@model.get('label'))
            @$el.attr('value', @model.get('value'))
            @$el.attr('selected', @model.get('selected'))

    # Renders a dropdown of items allowing for selection of a single item
    # from the list.
    class SingleSelectionList extends Marionette.CompositeView
        options:
            emptyValueLabel: '---'

        className: 'selection-list'

        itemView: SelectionListItem

        itemViewOptions: (model, index) ->
            model: model

        itemViewContainer: '.items'

        template: 'controls/select/list'

        ui:
            items: '.items'

        events:
            'change .items': 'onSelectionChange'

        collectionEvents:
            'sync': 'onCollectionSync'

        constructor: (options={}) ->
            @bindContext(options.context)
            super(options)

        initialize: (options) ->
            if not @collection
                @collection = new SelectionCollection
                @collection.url = => @model.links.values

            @collection.fetch()

        onCollectionSync: ->
            @collection.add(
                {label: @options.emptyValueLabel, value: ''},
                {at: 0})

            @render()

        onSelectionChange: (event) ->
            @ui.items.children().each (i, el) =>
                if i > 0
                    @collection.models[i].set('selected', el.selected)

            @change()

        onRender: ->
            @set(@context)

        getField: ->
            return @model.id

        getOperator: ->
            return "exact"

        getValue: ->
            selection = @collection.findWhere(selected: true)

            if selection?
                return selection.get('value')

            return null

        setValue: (value) ->
            @collection.each (model) ->
                model.set('selected', model.get('value') == value)

    _.defaults(SingleSelectionList::, base.ControlViewMixin)

    class MultiSelectionList extends SingleSelectionList
        onCollectionSync: ->
            @render()

        onSelectionChange: (event) ->
            @ui.items.children().each (i, el) =>
                @collection.models[i].set('selected', el.selected)

            @change()

        onRender: ->
            @ui.items.attr('multiple', true)
            @set(@context)

        getOperator: ->
            return "in"

        getValue: ->
            _.map @collection.where(selected: true), (model) ->
                model.get('value')

        setValue: (values=[]) ->
            @collection.each (model) ->
                model.set('selected', model.get('value') in values)

    { SingleSelectionList, MultiSelectionList }
