define [
    'underscore'
    'marionette'
    '../core'
    './search'
    './index'
    'tpl!templates/concept/columns.html'
    'tpl!templates/concept/columns-available.html'
    'tpl!templates/concept/columns-available-section.html'
    'tpl!templates/concept/columns-available-group.html'
    'tpl!templates/concept/columns-selected.html'
], (_, Marionette, c, search, index, templates...) ->

    templates = _.object ['columns', 'available', 'section', 'group', 'selected'], templates


    class AvailableItem extends index.ConceptItem
        template: templates.available

        events:
            'click .column-item-button': 'triggerAdd'

        triggerAdd: (event) ->
            event.preventDefault()
            @model.trigger 'columns:add', @model

        enable: ->
            @$el.removeClass 'disabled'

        disable: ->
            @$el.addClass 'disabled'


    class AvailableSection extends index.ConceptSection
        template: templates.section

        itemView: AvailableItem

        options:
            enableAddAll: true

        events:
            'click .column-section-button': 'triggerAdd'

        triggerAdd: (event) ->
            for itemModel in @model.items.models
                itemModel.trigger 'columns:add', itemModel

        onRender: ->
            if not @options.enableAddAll
                @$('.column-section-button').hide()


    class AvailableGroup extends index.ConceptGroup
        template: templates.group

        itemView: AvailableSection

        options:
            enableAddAll: false

        events:
            'click .column-group-button': 'triggerAdd'

        triggerAdd: (event) ->
            for sectionModel in @model.sections.models
                for itemModel in sectionModel.items.models
                    itemModel.trigger 'columns:add', itemModel

        onRender: ->
            super
            if not @options.enableAddAll
                @$('.column-group-button').hide()


    class AvailableColumns extends index.ConceptIndex
        itemView: AvailableGroup

        className: 'available-columns accordian'


    class SelectedItem extends Marionette.ItemView
        tagName: 'li'

        template: templates.selected

        initialize: ->
            @data = {}
            if not (@data.concepts = @options.concepts)
                throw new Error 'concepts collection required'

        serializeData: ->
            concept = @data.concepts.get(@model.get('concept'))
            return name: concept.get('name')

        events:
            'click button': 'triggerRemove'
            'sortupdate': 'updateIndex'

        triggerRemove: (event) ->
            event.preventDefault()
            @model.trigger 'columns:remove', @model

        # Updates the index of the model within the collection relative
        # DOM index
        updateIndex: (event, index) ->
            event.stopPropagation()
            collection = @model.collection
            # Silently move the model to a new index
            collection.remove(@model, silent: true)
            collection.add(@model, at: index, silent: true)


    class SelectedColumns extends Marionette.CollectionView
        tagName: 'ul'

        className: 'selected-columns'

        itemView: SelectedItem

        events:
            'sortupdate': 'triggerItemSort'

        initialize: ->
            @data = {}
            if not (@data.concepts = @options.concepts)
                throw new Error 'concepts collection required'

            @$el.sortable
                cursor: 'move'
                forcePlaceholderSize: true
                placeholder: 'placeholder'

        itemViewOptions: (model, index) ->
            model: model
            index: index
            concepts: @data.concepts

        # 'Sortable' events are not triggered on the item being sorted
        # so this handles proxying the event to the item itself.
        # See the SelectedItem handler for the event above.
        triggerItemSort: (event, ui) ->
            ui.item.trigger(event, [ui.item.index()])


    # Two-column layout representing the available columns on
    # the left side and the selected columns on the right.
    # The data this view expects includes:
    # - collection: a collection of concepts that are deemed viewable
    # - facets: the facets collection of a view to be rendered
    #   in this view as selectable and orderable columns
    # - facets: the collection of Facets derived from the view that
    #   represent the concepts being chosen.
    class ConceptColumns extends Marionette.Layout
        className: 'concept-columns'

        template: templates.columns

        events:
            'click .columns-remove-all-button': 'triggerRemoveAll'

        regions:
            search: '.search-region'
            available: '.available-region'
            selected: '.selected-region'

        regionViews:
            search: search.ConceptSearch
            available: AvailableColumns
            selected: SelectedColumns

        initialize: ->
            @data = {}
            if not (@data.view = @options.view)
                throw new Error 'view required'
            if not (@data.concepts = @options.concepts)
                throw new Error 'concepts collection required'

            @data.facets = @options.view.facets.clone()
            @$el.modal(show: false)

        updateView: (view) ->
            @data.facets = view.facets.clone()
            @render()

        onRender: ->
            # Sync and map between available columns and selected
            # columns (represented as facets)
            @listenTo(@data.concepts, 'columns:add', @addColumn, @)
            @listenTo(@data.facets, 'columns:remove', @removeColumn, @)

            @available.show new @regionViews.available
                collection: @data.concepts
                collapsable: false

            @search.show new @regionViews.search
                collection: @data.concepts
                handler: (query, resp) =>
                    @available.currentView.filter(query, resp)

            @selected.show new @regionViews.selected
                collection: @data.facets
                concepts: @data.concepts

            for facet in @data.facets.models
                if (concept = @data.concepts.get(facet.get('concept')))
                    @addColumn(concept, false)

        isConceptUnselected: (concept) ->
            for facet in @data.facets.models
                if facet.get('concept') is concept.id
                    return false
            return true

        triggerRemoveAll: ->
            facets = @data.facets.clone()
            for facet in facets.models
                @removeColumn(facet)

        addColumn: (concept, add=true) ->
            @available.currentView.find(concept)?.disable()

            if add and @isConceptUnselected(concept)
                facet = new @data.facets.model
                    concept: concept.id
                @data.facets.add(facet)

        removeColumn: (facet) ->
            @data.facets.remove(facet)
            concept = @data.concepts.get(facet.get('concept'))
            @available.currentView.find(concept)?.enable()


    { ConceptColumns }
