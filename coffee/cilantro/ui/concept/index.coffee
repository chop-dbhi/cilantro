define [
    '../core'
    './item'
    '../empty'
    'tpl!templates/views/concept-accordian-group.html'
    'tpl!templates/views/concept-accordian-item.html'
], (c, items, empty, templates...) ->

    # Create an object of templates by name..
    templates = c._.object ['group', 'item'], templates


    class ConceptAccordianItem extends items.Concept
        tagName: 'li'

        className: ''

        events:
            'click a': 'click'

        template: templates.item

        initialize: ->
            @subscribe c.CONCEPT_FOCUS, @toggleFocus

        click: (event) ->
            event.preventDefault()
            c.publish c.CONCEPT_FOCUS, @model.id

        toggleFocus: (id) =>
            @$el.toggleClass('active', (id is @model.id))


    class ConceptAccordianGroup extends c.Marionette.ItemView
        className: 'accordian-group'

        itemView: ConceptAccordianItem

        ui:
            'icon': '.accordian-heading i'

        events:
            'click .accordian-heading': 'toggleIcon'

        toggleIcon: ->
            @ui.icon.toggleClass 'icon-plus icon-minus'

        template: (data) ->
            $inner = c.$(templates.group(data))
            $items = $inner.find('.accordian-items')

            sections = data.sections

            for section, i in sections
                # If there are more than one sections, add a nav header
                if sections.length > 1
                    $items.append("<li class=nav-header>#{ section.name }</li>")

                # Render each item view
                for model in section.models
                    view = new ConceptAccordianItem
                        model: model
                    view.render()
                    $items.append(view.el)

            return $inner


    class ConceptIndex extends c.Marionette.CollectionView
        className: 'accordian'

        itemView: ConceptAccordianGroup

        emptyView: empty.EmptyView

        # Temporarily override
        showCollection: ->
            collection = @collection
            @collection = new c.Backbone.Collection @groupModels(collection)
            super
            @collection = collection
            return

        getGroup: (attrs) ->
            if attrs.category?
                group = attrs.category
                while group.parent?
                    group = group.parent
                return group
            return id: null, name: 'Other'

        getSection: (attrs) ->
            if attrs.category?.parent?
                return attrs.category
            return id: null, name: 'Other'

        groupModels: (collection) ->
            groups = {}

            # Group by category and sub-category
            for model in collection.models
                attrs = model.attributes
                groupAttrs = null
                sectionAttrs = null

                # Determine the group and section for the current model.
                groupAttrs = @getGroup attrs
                sectionAttrs = @getSection attrs

                # Create the group object with an array of sections
                if not (group = groups[groupAttrs.id])
                    group = groups[groupAttrs.id] = c._.extend {},
                        groupAttrs, sections: {}

                if not (section = group.sections[sectionAttrs.id])
                    section = group.sections[sectionAttrs.id] = c._.extend {},
                        sectionAttrs, models: []

                # Models will be sorted relative to their groups later
                section.models.push model

            # Sort the sections within each group, then sort the groups
            for id, group of groups
                group.sections = _.sortBy c._.values group.sections, 'order'

            return c._.sortBy c._.values groups, 'order'


    { ConceptIndex }
