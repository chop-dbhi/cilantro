define [
    'underscore'
    'backbone'
    'marionette'
    # cilantro.core to prevent circular import in cilantro.ui.core
    '../../core'
    './base'
], (_, Backbone, Marionette, c, base) ->


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
    class SingleSelectionList extends base.ControlCompositeView
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
            'reset': 'onCollectionSync'

        initialize: (options) ->
            @wait()

            if not @collection
                @collection = new Backbone.Collection

                # This is a hack to prevent a 500 error that occurs in
                # Serrano prior to 2.3.1 if limit is set to 0. The assumption
                # here is that if this type of control is being used for
                # selecting a value, it is unlikely to be rendering a large
                # number of values due to it's poor usability. The field search
                # control is more appropriate for a large number of values.
                if c.isSupported('2.3.1')
                    limit = 0
                else
                    limit = 1000

                @model.values(limit: limit).done (resp) =>
                    @collection.reset(resp.values)
                    @ready()

        onCollectionSync: ->
            @collection.add
                label: @options.emptyValueLabel
                value: ''
            , at: 0

            @render()

        onSelectionChange: (event) ->
            @ui.items.children().each (i, el) =>
                if i > 0
                    @collection.models[i].set('selected', el.selected)

            @change()

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


    class MultiSelectionList extends SingleSelectionList
        onCollectionSync: ->
            @render()

        onSelectionChange: (event) ->
            @ui.items.children().each (i, el) =>
                @collection.models[i].set('selected', el.selected)

            @change()

        onRender: ->
            @ui.items.attr('multiple', true)

        getOperator: ->
            return "in"

        getValue: ->
            _.map @collection.where(selected: true), (model) ->
                model.get('value')

        setValue: (values=[]) ->
            @collection.each (model) ->
                model.set('selected', model.get('value') in values)


    { SingleSelectionList, MultiSelectionList }
