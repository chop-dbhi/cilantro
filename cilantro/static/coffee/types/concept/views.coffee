define [
        'common/views/state'
        'common/views/collection'
        'common/views/popover'
    ],

    (stateview, collectionview, popover) ->

        class ConceptView extends stateview.View
            template: _.template '<span class="name"><%= name %></span>
                <span class="description"><%= description %></span>'

            events:
                'click': 'click'

            render: ->
                @el.html @template @model.toJSON()
                @el.data id: @model.id
                @

            click: ->
                @model.activate local: true


        class ConceptDescriptionPopover extends popover.Popover
            el: '#concept-description'

            defaultContent: '<span class="info">No description available</span>'

            update: (view) ->
                # update the popover's title and content
                @title.text view.model.get('name')
                @content.html view.model.get('description') or @defaultContent


        class ConceptCollectionView extends collectionview.View
            el: '#criteria'
            viewClass: ConceptView

            events:
                'mouseenter div': 'mouseenter'
                'mouseleave div': 'mouseleave'
                'click': 'click'

            initialize: ->
                super
                @collection.bind 'active', @activate
                @description = new ConceptDescriptionPopover

            # convenience method for auto-scrolling to a particular concept within
            # this collection view.
            scrollToConcept: (model) =>
                view = @childViews[model.id]
                @el.scrollTo view.el,
                    duration: 800
                    axis: 'y'
                    offset:
                        top: @el.outerHeight() / -2
                    easing: 'easeOutQuint'

            # if this model has been activated not from a local context,
            # scroll to the concept in case it may be out of view in the UI
            activate: (model, options) =>
                if not options?.local then _.defer @scrollToConcept, model
                App.hub.publish 'concept/active', model

            # do not show the description unless the hover is sustained for some
            # time.
            mouseenter: (event) ->
                id = $(event.currentTarget).data 'id'
                view = @childViews[id]
                @description.show view, 'right'

            mouseleave: (event) ->
                @description.hide()

            # on click, immediately hide the description, so description does not
            # disturb lateral movement
            click: ->
                @description.hide true


        return {
            View: ConceptView
            CollectionView: ConceptCollectionView
        }
