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
                @collection.search query, (resp) =>
                    @options.handler(query, resp)
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


    class AvailableGroup extends index.ConceptGroup
        itemView: AvailableSection

        filter: (query, models) ->
            show = false
            @children.each (view) ->
                if not query or models[view.model.cid]?
                    view.$el.show()
                    show = true
                else
                    view.$el.hide()
            @$el.toggle(show)
            return

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

        triggerRemove: (event) ->
            event.preventDefault()
            @model.trigger 'columns:remove', @model


    class SelectedColumns extends c.Marionette.CollectionView
        tagName: 'ul'

        className: 'selected-columns'

        itemView: SelectedItem

        initialize: ->
            @$el.sortable
                cursor: 'move'
                forcePlaceholderSize: true
                placeholder: 'placeholder'


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