define [
        'common/models/state'
    ],
        
    (statemodel) ->
        ###
        Concepts are the data-driven entry points for constructing their
        self-contained interfaces. Every concept must be "contained" within
        a domain, thus when a concept becomes active, the associated domain
        (or sub-domain) will become active as well.
        ###

        class Concept extends statemodel.Model
            url: -> super + '/'

        ###
        The ConceptCollection encapsulates cross-instance logic.
        ###

        class ConceptCollection extends Backbone.Collection
            model: Concept
            url: App.endpoints.criteria

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

        return {
            Model: Concept
            Collection: ConceptCollection
        }
