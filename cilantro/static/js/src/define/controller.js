/*
    The storage area for shared state between models and collections. KVO
    can be setup to watch for changes to this object. Each observer should
    force their "onstatechange" behaviors on initialization to ensure they
    "catch up" reflecting the correct application state.
    */
/*
    class State extends Backbone.Model
        defaults:
            # represents the currently active domain. from an application viewpoint
            # there is no distinction between domains and sub-domains. this logic is
            # handled within the DomainCollection
            domain: null

            # represents the currently active concept. this will not be set onload
            # unless a session is being refreshed.
            concept: null

        initialize: ->
            # delegation for this collection's views. this ensures this event
            # is dealt with once (rather than for N items in the collection)
            @bind 'change:domain', (controller, domain, options) ->
                # this will not be set if this is the initial load
                if controller.previous('domain')
                    controller.previous('domain').view.deactivate()

                # set the new domain as active
                domain.view.activate()

                # update to the latest concept and subdomain for this domain
                controller.set
                    concept: domain.state.concept
                    subdomain: domain.state.subdomain
                , options

            # delegation for this collection's views. this ensures this event
            # is dealt with once (rather than for N items in the collection)
            @bind 'change:subdomain', (controller, subdomain) ->
                # this will not be set if this is the initial load
                if controller.previous('subdomain')
                    controller.previous('subdomain').view.dectivate()

                if subdomain
                    # set the new domain as active
                    subdomain.view.activate()

                    # update to the latest concept and subdomain for this domain
                    controller.set
                        concept: subdomain.state.concept
                        domain: subdomain.get('domain')
                    , options

            # when the concept changes, it's domain must be change on the
            # controller. the attribute that gets set is relative to the domain
            # type
            @bind 'change:concept', (controller, concept, options) ->
                if not concept
                    return

                domain = concept.get('domain')

                # update internal state of the domain
                domain.state.concept = concept

                attrs = {}
                attrs[domain.type] = domain
                controller.set attrs, options

    */App.State = new Backbone.Model;