define [
    './core'
    './base'
    'tpl!templates/accordian/group.html'
    'tpl!templates/accordian/section.html'
    'tpl!templates/accordian/item.html'
], (c, base, templates...) ->

    templates = c._.object ['group', 'section', 'item'], templates


    class Item extends c.Marionette.ItemView
        tagName: 'li'

        template: templates.item


    class Section extends c.Marionette.CompositeView
        className: 'section'

        itemView: Item

        template: templates.section

        itemViewContainer: '.items'

        ui:
            heading: '.heading'

        # Returns true if this group is *empty*
        isEmpty: ->
            not @collection.length

        onCompositeCollectionRendered: ->
            @$el.toggle(not @isEmpty())


    class Group extends c.Marionette.CompositeView
        className: 'group'

        template: templates.group

        itemView: Section

        itemViewContainer: '.sections'

        itemSectionItems: 'items'

        options:
            collapsable: true

        itemViewOptions: (model, index) ->
            model: model
            index: index
            collection: model[@itemSectionItems]

        ui:
            heading: '.heading'
            icon: '.heading span'
            inner: '.inner'

        events:
            'click > .heading': 'toggleCollapse'
            'shown > .inner': 'showCollapse'
            'hidden > .inner': 'hideCollapse'

        onRender: ->
            if not @options.collapsable
                @$('.inner').removeClass('collapse')
                @ui.icon.hide()

        # Returns true if this group is *empty* which includes having no
        # sections or having sections without any items.
        isEmpty: ->
            if @collection.length
                return false
            for model in @collection.models
                if model.items.length
                    return false
            return true

        onCompositeCollectionRendered: ->
            @$el.toggle(not @isEmpty())

            # Hide the first heading i
            if (length = @collection.length)
                # Get the first model and view for toggle conditions
                view = @children.findByModel(model = @collection.at(0))

                # If only a single child is present, hide the heading unless it
                # is using an explicit heading
                view.ui.heading.toggle(length > 1 or model.id >= 0)

        toggleCollapse: ->
            if @options.collapsable
                @ui.inner.collapse('toggle')

        showCollapse: ->
            @ui.icon.text('-')

        hideCollapse: ->
            @ui.icon.text('+')


    class Accordian extends c.Marionette.CollectionView
        className: 'accordian'

        itemView: Group

        emptyView: base.EmptyView

        itemGroupSections: 'sections'

        options:
            collapsable: true

        itemViewOptions: (model, index) ->
            model: model
            index: index
            collection: model[@itemGroupSections]
            collapsable: @options.collapsable


    { Accordian, Group, Section, Item }
