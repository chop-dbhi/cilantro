define [
    '../core'
    '../search'
    './index'
    'tpl!templates/views/concept-columns.html'
    'tpl!templates/views/concept-columns-available.html'
    'tpl!templates/views/concept-columns-selected.html'
], (c, search, index, templates...) ->

    templates = c._.object ['columns', 'available', 'selected'], templates


    # Custom search that filters the available items
    class ColumnsSearch extends search.Search
        onRender: ->
            @ui.input.on 'keyup', c._.debounce =>
                query = @ui.input.val()
                if query
                    @collection.search query, (resp) =>
                        @options.handler(query, resp)
                else
                    @options.handler(null, [])
            , 300


    class AvailableItem extends index.ConceptItem
        template: templates.available

        events:
            'click button': 'triggerAdd'

        triggerAdd: (event) ->
            event.preventDefault()
            @model.trigger 'columns:add', @model

        enable: ->
            @$el.removeClass 'disabled'

        disable: ->
            @$el.addClass 'disabled'


    class AvailableSection extends index.ConceptSection
        itemView: AvailableItem

        filter: (query, models) ->
            # If any children are visible, show this group, otherwise hide it
            show = false
            @children.each (view) ->
                if not query or models[view.model.cid]?
                    view.$el.show()
                    show = true
                else
                    view.$el.hide()
            @$el.toggle(show)
            return show


    class AvailableGroup extends index.ConceptGroup
        itemView: AvailableSection

        filter: (query, models) ->
            # If any children are visible, show this group, otherwise hide it
            show = false
            @children.each (view) ->
                if view.filter(query, models)
                    show = true
            @$el.toggle(show)
            return show

        find: (model) ->
            for cid, view of @children._views
                if (child = view.children?.findByModel(model))
                    return child
            return


    class AvailableColumns extends index.ConceptIndex
        itemView: AvailableGroup

        className: 'available-columns accordian'

        filter: (query, resp) ->
            models = {}
            if query
                for datum in resp
                    if (model = @collection.get datum.id)
                        models[model.cid] = model

            @children.each (view) ->
                view.filter(query, models)

        find: (model) ->
            for cid, view of @children._views
                if (child = view.find?(model))
                    return child
            return


    class SelectedItem extends c.Marionette.ItemView
        tagName: 'li'

        template: templates.selected

        serializeData: ->
            concept = c.data.concepts.get(@model.get('concept'))
            return {
                name: concept.get('name')
            }

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


    class SelectedColumns extends c.Marionette.CollectionView
        tagName: 'ul'

        className: 'selected-columns'

        itemView: SelectedItem

        events:
            'sortupdate': 'triggerItemSort'

        initialize: ->
            @$el.sortable
                cursor: 'move'
                forcePlaceholderSize: true
                placeholder: 'placeholder'

        # 'Sortable' events are not triggered on the item being sorted
        # so this handles proxying the event to the item itself.
        # See the SelectedItem handler for the event above.
        triggerItemSort: (event, ui) ->
            ui.item.trigger(event, ui.item.index())


    class ConceptColumns extends c.Marionette.Layout
        className: 'concept-columns'

        template: templates.columns

        regions:
            search: '.search-region'
            available: '.available-region'
            selected: '.selected-region'

        constructor: (options) ->
            if not options.view?
                throw new Error 'ViewModel instance required'
            @view = options.view
            delete options.view
            super(options)

        initialize: ->
            @$el.modal show: false

        onRender: ->
            # Listen for remove event from selected columns
            @listenTo @collection, 'columns:add', @addColumn, @
            @listenTo @view.facets, 'columns:remove', @removeColumn, @

            @available.show new AvailableColumns
                collection: @collection
                collapsable: false

            @search.show new ColumnsSearch
                collection: @collection
                handler: (query, resp) =>
                    @available.currentView.filter(query, resp)

            @selected.show new SelectedColumns
                collection: @view.facets

            for facet in @view.facets.models
                if (concept = @collection.get(facet.get('concept')))
                    @addColumn(concept, false)

        addColumn: (concept, add=true) ->
            @available.currentView.find(concept)?.disable()

            if add
                facet = new @view.facets.model
                    concept: concept.id
                @view.facets.add(facet)

        removeColumn: (facet) ->
            @view.facets.remove(facet)
            concept = @collection.get(facet.get('concept'))
            @available.currentView.find(concept)?.enable()



    { ConceptColumns }
