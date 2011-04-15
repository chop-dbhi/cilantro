define 'define/main', ['lib/underscore', 'lib/backbone'], ->
    ###
    The application namespace.
    ###

    window.App = App = {}
    App.Domains = Domains = null
    App.Concepts = Concepts = null



    ###
    The storage area for shared state between models and collections. KVO
    can be setup to watch for changes to this object. Each observer should
    force their "onstatechange" behaviors on initialization to ensure they
    "catch up" reflecting the correct application state.
    ###

    State = new Backbone.Model
        # objects that define a domain should set this property. this will only
        # ever be observed by the DomainCollection. the ``domain`` and
        # ``subdomain`` properties will be updated accordingly which all other
        # dependent objects should bind to.
        _domain: null

        # represents the currently active domain. from an application viewpoint
        # there is no distinction between domains and sub-domains. this logic is
        # handled within the DomainCollection
        domain: null

        # represents the current sub-domain that is active
        subdomain: null

        # represents the currently active concept. this will not be set onload
        # unless a session is being refreshed.
        concept: null



    ###
    A Domain is a high-level organization for concepts. Only a single domain
    can be active at any given time. A domain is considered a sub-domain if and
    only if it has a parent domain defined. If this is the case, then a
    sub-domain implies the parent domain is active.
    ###

    class Domain extends Backbone.Model

        initialize: ->
            State.bind 'change:concept', @conceptBinding

            # defines whether this instance is a domain or subdomain based on the
            # existence of a parent reference
            @type = if @get 'parent' then 'subdomain' else 'domain'

            # a reference to a parent domain if one exists
            @parent = null

            # internal state for this domain since these change during usage
            @state =
                # top-level domains must keep track of their last active sub-domain 
                # in order to correctly refresh the previous state.
                subdomain: null

                # similar to the reasoning above, if this domain becomes inactive and
                # then active (explicitly) it must refresh the interface relative to
                # it's previous state
                concept: null
            
            # make this object listen for the change based on type
            if @type is 'domain'
                State.bind 'change:domain', @domainBinding
            else
                State.bind 'change:subdomain', @subdomainBinding

        # when a concept is set, if this domain is currently active, set this
        # domain's local reference to the concept
        conceptBinding: (model, concept) =>
            # see if this domain (or subdomain) is the currently referenced
            # one. for both types, this domain's concept must be set, but if
            # this is a subdomain, we must update the parent's reference as
            # well
            if @ is State.get @type
                @state.concept = concept
                if @type is 'subdomain'
                    @parent.state.concept = concept
                
        # when a domain gets invoked, it refreshes the state where it was last
        # left by updating the global state with the last subdomain and concept
        # references
        domainBinding: (model, domain) =>
            if @ is domain
                State.set subdomain: @state.subdomain, concept: @state.concept

        # same as the domainBinding above, except it sets it's parent which is
        # not variable
        subdomainBinding: (model, subdomain) =>
            if @ is subdomain
                State.set concept: @state.concept, domain: @parent



    ###
    The DomainCollection encapsulates cross-instance logic.
    ###

    class DomainCollection extends Backbone.Collection
        model: Domain

        url: '/audgendb/api/categories/'

        initialize: ->
            @bind 'refresh', @refreshBinding
            # add observer to the shared state object. only this collection
            # should observe this state property since it acts as a proxy for
            # determining the domain and subdomain models
            State.bind 'change:_domain', @_domainBinding

        # when the full collection gets refreshed, the cross-domain parent
        # references can be setup
        refreshBinding: ->
            @each (model) ->
                if model.type is 'subdomain'
                    model.parent = @get model.get('parent')



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
        url: '/audgendb/api/criteria/'



    ###
    The DomainView handles setting up DOM event handlers for each Domain
    instance that exists.
    ###

    class DomainView extends Backbone.View
        tagName: 'span'
        template: _.template '<div class="icon"></div><span><%= name %></span>'
        events:
            'click': 'clickBinding'

        initialize: ->
            State.bind 'change:domain', @domainBinding
            @render()

        render: ->
            name = @model.get 'name'

            # create jquery object
            @jq = $(@el)

            @jq.attr 'id': "tab-#{ name.toLowerCase() }"
            @jq.html @.template name: name

        domainBinding: (model, domain) =>
            if @model is domain
                @jq.addClass 'active'
            else
                @jq.removeClass 'active'

        clickBinding: (event) ->
            State.set domain: @model
            return false



    class SubDomainView extends DomainView
        tagName: 'span'
        className: 'subdomain'

        initialize: ->
            State.bind 'change:subdomain', @subdomainBinding
            @render()

        render: ->
            @el.innerHTML = @model.get 'name'

        subdomainBinding: (model, subdomain) =>
            if @model is subdomain
                @jq.addClass 'active'
            else
                @jq.removeClass 'active'

        clickBinding: (event) ->
            State.set subdomain: @model
            return false



    class ConceptView extends Backbone.View
        template: _.template '<span class="name"><%= name %></span>
            <span class="description"><%= description %></span>'
        events:
            'click': 'clickBinding'

        initialize: ->
            State.bind 'change:concept', @conceptBinding
            # this concept is either part of a top-level domain or a subdomain,
            # but not both
            if @model.domain.type is 'domain'
                State.bind 'change:domain', @domainBinding
            else
                State.bind 'change:subdomain', @subdomainBinding

            @render()

        render: ->
            @jq = $(@el).html @template(@model.toJSON())

        # when the concept becomes active, reflect this in the UI
        conceptBinding: =>
            if @model is State.get 'concept'
                @jq.addClass 'active'
            else
                @jq.removeClass 'active'
    
        # when the concept's domain becomes active (or not) reflect this
        # in the UI by showing/hiding
        domainBinding: =>
            # TODO need to update to new terms
            # this model belongs to this domain directly
            if @model.domain is State.get 'domain'
                @jq.show()
            else
                @jq.hide()

        # same as above except at the subdomain level. if a concept is
        # associated with a subdomain, and no subdomain is currently active,
        # the parent domain must be checked against
        subdomainBinding: =>
            domain = State.get 'domain'
            subdomain = State.get 'subdomain'

            if subdomain
                if subdomain is @model.domain
                    @jq.show()
                else
                    @jq.hide()
            else
                if domain is @model.domain.parent
                    @jq.show()
                else
                    @jq.hide()

        clickBinding: (event) ->
            if @model.domain.type is 'domain'
                State.set concept: @model, domain: @model.domain
            else
                State.set concept: @model, subdomain: @model.domain

            return false



    ###
    The ApplicationView itself. This drives the bootstrapping of the whole
    application.
    ###

    class AppView extends Backbone.View

        initialize: ->
            domains = $('#categories')
            subdomains = $('#sub-categories')
            concepts = $('#criteria')

            # initialize and fetch the domains
            Domains = new DomainCollection

            Domains.fetch
                success: ->
                    Domains.each (model) ->
                        if model.type is 'domain'
                            view = new DomainView model: model
                            domains.append view.el
                        else
                             view = new SubDomainView model: model
                             subdomains.append view.el

            Concepts = new ConceptCollection

            Concepts.fetch
                success: ->
                    Concepts.each (model) ->
                        # bind the domain instance for this concept
                        model.domain = Domains.get model.get('category').id

                        view = new ConceptView model: model
                        concepts.append view.el

                    State.set domain: Domains.at(0)


    # On document ready, initialize the AppView
    $ -> new AppView
