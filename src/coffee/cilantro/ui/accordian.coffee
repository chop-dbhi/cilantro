define [
    'underscore'
    'marionette'
    './base'
    'tpl!templates/accordian/group.html'
    'tpl!templates/accordian/section.html'
    'tpl!templates/accordian/item.html'
], (_, Marionette, base, templates...) ->

    templates = _.object ['group', 'section', 'item'], templates


    class Item extends Marionette.ItemView
        tagName: 'li'

        template: templates.item


    class Section extends Marionette.CompositeView
        className: 'section'

        itemView: Item

        template: templates.section

        itemViewContainer: '.items'

        option:
            collapsable: true

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

        # Returns true if this group is *empty*
        isEmpty: ->
            not @collection.length

        onCompositeCollectionRendered: ->
            @$el.toggle(not @isEmpty())

        toggleCollapse: ->
            if @options.collapsable
                @ui.inner.collapse('toggle')

        showCollapse: ->
            @ui.icon.text('-')

        hideCollapse: ->
            @ui.icon.text('+')

        expand: =>
            if @options.collapsable
                @ui.inner.collapse('show')
                @showCollapse()

        collapse: =>
            if @options.collapsable
                @ui.inner.collapse('hide')
                @hideCollapse()


    class Group extends Marionette.CompositeView
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
            collapsable: @options.collapsable

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

                isMultiChild = length > 1 or model.id >= 0

                # If it is a sinlge child then we turn off the collapsable
                # flag on the view since it cannot be expanded/collapsed
                # without a visible header. We need to re-render because
                # chaning the options doesn't automatically trigger a render
                # call so we do it manually here.
                if not isMultiChild
                    view.options.collapsable = false
                    view.render()

                # If only a single child is present, hide the heading unless it
                # is using an explicit heading
                view.ui.heading.toggle(isMultiChild)

        toggleCollapse: ->
            if @options.collapsable
                @ui.inner.collapse('toggle')

        showCollapse: ->
            @ui.icon.text('-')

        hideCollapse: ->
            @ui.icon.text('+')

        expand: =>
            if @options.collapsable
                @ui.inner.collapse('show')
                @showCollapse()

                @children.each((view) ->
                    view.expand()
                )

        collapse: =>
            if @options.collapsable
                @ui.inner.collapse('hide')
                @hideCollapse()

                @children.each((view) ->
                    view.collapse()
                )


    class Accordian extends Marionette.CollectionView
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

        expand: ->
            if @options.collapsable
                @children.each((view) ->
                    view.expand()
                )

        collapse: ->
            if @options.collapsable
                @children.each((view) ->
                    view.collapse()
                )


    { Accordian, Group, Section, Item }
