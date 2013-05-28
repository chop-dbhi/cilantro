define [
    '../core'
    '../base'
    '../accordian'
], (c, base, accordian) ->


    class ConceptItem extends accordian.Item
        events:
            'click a': 'click'

        initialize: ->
            @subscribe c.CONCEPT_FOCUS, @toggleFocus

        click: (event) ->
            event.preventDefault()
            c.publish c.CONCEPT_FOCUS, @model.id

        toggleFocus: (id) =>
            @$el.toggleClass('active', (id is @model.id))


    class ConceptSection extends accordian.Section
        itemView: ConceptItem


    class ConceptGroup extends accordian.Group
        itemView: ConceptSection


    class ConceptIndex extends accordian.Accordian
        className: 'concept-index accordian'

        itemView: ConceptGroup

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
                @groups = new c.Backbone.Collection null,
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
                group = new c.Backbone.Model groupAttrs
                group.sections = new c.Backbone.Collection null,
                    comparator: 'order'
                @groups.add(group)

            # Get the section (sub-group) for the model
            if not (section = group.sections.get(sectionAttrs.id))
                section = new c.Backbone.Model sectionAttrs
                section.items = new c.Backbone.Collection null,
                    comparator: 'order'
                group.sections.add(section)

            section.items.add(model)

            return


    { ConceptIndex, ConceptGroup, ConceptSection, ConceptItem }
