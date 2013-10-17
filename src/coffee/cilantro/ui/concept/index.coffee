define [
    'backbone'
    '../core'
    '../base'
    '../accordian'
], (Backbone, c, base, accordian) ->


    class ConceptItem extends accordian.Item
        events:
            'click a': 'click'

        initialize: ->
            c.on c.CONCEPT_FOCUS, @toggleFocus

        click: (event) ->
            event.preventDefault()
            c.trigger c.CONCEPT_FOCUS, @model.id

        toggleFocus: (id) =>
            @$el.toggleClass('active', (id is @model.id))


    class ConceptSection extends accordian.Section
        itemView: ConceptItem

        filter: (query, models) ->
            # If any children are visible, show this group, otherwise hide it
            show = false
            @children.each (view) ->
                if not query or models[view.model.cid]?
                    view.$el.show()
                    show = true
                else
                    view.$el.hide()
            @$el.toggle(show and not @isEmpty())
            return show


    class ConceptGroup extends accordian.Group
        itemView: ConceptSection

        filter: (query, models) ->
            # If any children are visible, show this group, otherwise hide it
            show = false
            @children.each (view) ->
                if view.filter(query, models)
                    show = true
            @$el.toggle(show and not @isEmpty())
            return show

        find: (model) ->
            for cid, view of @children._views
                if (child = view.children?.findByModel(model))
                    return child
            return


    class ConceptIndex extends accordian.Accordian
        className: 'concept-index accordian'

        itemView: ConceptGroup

        lastQuery: null

        # Override to create the parsed collection and render it
        showCollection: ->
            @resetGroups()
            @groups.each (item, index) =>
                @addItemView item, @getItemView(item), index
            return

        getGroup: (attrs) ->
            if attrs.category?
                group = attrs.category
                while group.parent?
                    group = group.parent
                return group
            return id: -1, name: 'Other'

        getSection: (attrs) ->
            if attrs.category?.parent?
                return attrs.category
            return id: -1, name: 'Other'

        resetGroups: ->
            if not @groups?
                @groups = new Backbone.Collection null,
                    comparator: 'order'
            else
                @groups.reset()

            for model in @collection.models
                @groupModel(model)
            return

        # Group by category and sub-category
        groupModel: (model) ->
            attrs = model.attributes
            groupAttrs = @getGroup attrs
            sectionAttrs = @getSection attrs

            # Get the top-level group for the model
            if not (group = @groups.get(groupAttrs.id))
                group = new Backbone.Model groupAttrs
                group.sections = new Backbone.Collection null,
                    comparator: 'order'
                @groups.add(group)

            # Get the section (sub-group) for the model
            if not (section = group.sections.get(sectionAttrs.id))
                section = new Backbone.Model sectionAttrs
                section.items = new Backbone.Collection null,
                    comparator: 'order'
                group.sections.add(section)

            section.items.add(model)

            return

        filter: (query, resp) ->
            models = {}
            if query
                for datum in resp
                    if (model = @collection.get datum.id)
                        models[model.cid] = model

            @children.each (view) ->
                view.filter(query, models)

            # If the query has changed, then we need to check to see if the
            # accordian state needs to be manipulated.
            if query != @lastQuery
                # If this is the first query, then we need to forcefully
                # expand the accordian. We only want to do this on the first
                # query and not simply for query changes to take advantage of
                # the saved state feature of the accordian groups and sections.
                if query?
                    if not @lastQuery?
                        @expand()
                # If the query has been cleared, then restore the state of the
                # accordian as it was before the search(es) began.
                else
                    @revertToLastState()

            @lastQuery = query

        find: (model) ->
            for cid, view of @children._views
                if (child = view.find?(model))
                    return child
            return


    { ConceptIndex, ConceptGroup, ConceptSection, ConceptItem }
