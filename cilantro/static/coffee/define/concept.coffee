    ###
    Concepts are the data-driven entry points for constructing their
    self-contained interfaces. Every concept must be "contained" within
    a domain, thus when a concept becomes active, the associated domain
    (or sub-domain) will become active as well.
    ###

    class Concept extends Backbone.Model

    ###
    The ConceptCollection encapsulates cross-instance logic.
    ###

    class ConceptCollection extends Backbone.Collection
        model: Concept
        url: '/apps/audgendb/api/criteria/'

        initialize: ->
            App.State.bind 'change:concept', @changeConcept
            App.State.bind 'change:domain', @changeDomain

        changeConcept: (state, model, options) =>
            # deactivate the previous concept if one exists
            if (previous = state.previous 'concept')
                previous.trigger 'deactivate'
            # set the domain of this concept on the model then activate
            # this concept
            if model 
                model.trigger 'activate'
                state.set 'domain', App.domains.get model.get('domain').id

        changeDomain: (state, model, options) =>
            # iterate over each conceptfor the parent domain and 'show' them
            @each (obj) ->
                domain = obj.get('domain')
                parent = domain.parent
                # if the concept domain is this domain or the concept's
                # domain's parent is this domain
                if domain.id is model.id or parent and parent.id is model.id
                    obj.trigger 'show'
                else
                    obj.trigger 'hide'


    class ConceptView extends App.Views.State
        template: _.template '<span class="name"><%= name %></span>
            <span class="description"><%= description %></span>'

        events:
            'click': 'click'

        render: ->
            @el.html @template @model.toJSON()
            @

        click: (event) ->
            # this trigger should not invoke the auto-scroll since it was
            # invoked via the UI i.e. it must have already been in view
            App.State.set
                concept: @model
            , noscroll: true
            # no bubbles..
            return false


    class ConceptCollectionView extends App.Views.Collection
        el: '#criteria'
        viewClass: ConceptView

        initialize: ->
            super
            @collection.bind 'activate', @activate

        # convenience method for auto-scrolling to a particular concept within
        # this collection view.
        scrollToConcept: (model) =>
            view = @childViews[model.cid]
            @el.scrollTo view.el, 250, 
                axis: 'y'
                offset:
                    top: @el.outerHeight() / -2

        # activate this concept
        activate: (collection, model, options) =>
            if model 
                # when all said and done.. this is the final UI update that
                # must happen when a concept has been switched to
                if not options.noscroll then _.defer(@scrollToConcept, model)



    # references
    App.Models.Concept = Concept
    App.Collections.Concept = ConceptCollection
    App.Views.Concept = ConceptView
    App.Views.ConceptCollection = ConceptCollectionView

    # create collection
    App.concepts = new App.Collections.Concept
