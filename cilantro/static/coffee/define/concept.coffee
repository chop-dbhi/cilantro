define ['common/models/state', 'common/views/state', 'common/views/collection', 'cilantro/modules/views/popover'], (statemodel, stateview, collectionview, popover) ->
    ###
    Concepts are the data-driven entry points for constructing their
    self-contained interfaces. Every concept must be "contained" within
    a domain, thus when a concept becomes active, the associated domain
    (or sub-domain) will become active as well.
    ###

    class Concept extends statemodel.Model

    ###
    The ConceptCollection encapsulates cross-instance logic.
    ###

    class ConceptCollection extends Backbone.Collection
        model: Concept
        url: App.urls.criteria

        initialize: ->
            # when a domain is activated, only the concepts under that
            # domain are made visible
            App.hub.subscribe 'domain/active', @toggleEnableByDomain
            App.hub.subscribe 'subdomain/active', @toggleEnableByDomain

            # on every reset, regroup all concepts by their respective domain
            @bind 'reset', @groupByDomain

            @bind 'active', @activate
            @bind 'inactive', @inactivate

            App.hub.subscribe 'concept/request', (id) =>
                concept = @get id
                if concept
                    # send a request to make known
                    App.hub.publish 'domain/request', concept.get('domain').id
                    # finally make the requested concept active
                    concept.activate()


            # the last active concept relative to each domain. in this context,
            # the subdomains are treated independent of their parent domain
            @_activeByDomain = {}
            @_activeDomain = null

        # which concepts can be active and deactivated depend on the domain
        # they are associated with. only concepts within the domain need
        # to be deactivated since the other domains are not visible
        groupByDomain: ->
            @_byDomain = {}
            @_bySubdomain = {}

            @each (model) =>
                domain = model.get('domain')
                if domain.parent
                    (@_bySubdomain[domain.id] ?= []).push model
                    (@_byDomain[domain.parent.id] ?= []).push model
                else
                    (@_byDomain[domain.id] ?= []).push model

        # enables/disables concepts given their domain. the last concept that was
        # active from the newly visible concepts is re-activated. a concept can be
        # enabled if their domain or domain parent is activated.
        toggleEnableByDomain: (id) =>
            @_activeDomain = id
            concepts = @_bySubdomain[id] or @_byDomain[id]

            @map (model) ->
                if model in concepts
                    model.enable()
                    # we need to inactivate the model here since it is
                    # potentially being re-used with the "All" subdomain
                    model.inactivate()
                else
                    model.disable()

            # finally activate the last active concept for this domain if one
            # exists
            if (model = @_activeByDomain[id]) then model.activate()

        # performs some collection-level handling for the newly active model.
        # all concepts within the same domain as the current model are
        # deactivated
        activate: (model) ->
            @_activeByDomain[@_activeDomain] = model
            concepts = @_bySubdomain[@_activeDomain] or @_byDomain[@_activeDomain]
            _(concepts).without(model).map (model) -> model.inactivate()

        inactivate: (model) ->



    class ConceptView extends stateview.View
        template: _.template '<span class="name"><%= name %></span>
            <span class="description"><%= description %></span>'

        events:
            'click': 'click'

        render: ->
            @el.html @template @model.toJSON()
            @el.data cid: @model.cid
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
            'click div': 'click'

        initialize: ->
            super
            @collection.bind 'active', @activate
            @description = new ConceptDescriptionPopover

        # convenience method for auto-scrolling to a particular concept within
        # this collection view.
        scrollToConcept: (model) =>
            view = @childViews[model.cid]
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

        # do not show the description unless the hover is sustained for some
        # time.
        mouseenter: (event) ->
            cid = $(event.currentTarget).data 'cid'
            view = @childViews[cid]

            @description.show view, 'right'

        mouseleave: ->
            @description.hide()

        # on click, immediately hide the description, so description does not
        # disturb lateral movement
        click: -> @description.hide(true)


    return {
        Model: Concept
        Collection: ConceptCollection
        View: ConceptView
        CollectionView: ConceptCollectionView
    }
