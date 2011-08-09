    ###
    A Domain is a high-level organization for concepts. Only a single domain
    can be active at any given time.

    A domain can have subdomains associated with it. If this is the case, it
    will act as a delegate to those subdomains.
    ###

    class Domain extends Backbone.Model

        initialize: ->
            @bind 'activate', @activate

            # internal state for this domain's dependents since these change
            # during the session
            @state =
                # top-level domains must keep track of their last active
                # subdomain in order to correctly refresh the previous state.
                subdomain: null

                # similar to the reasoning above, if this domain becomes
                # inactive and then active (explicitly) it must refresh the
                # interface relative to it's previous state.
                concept: null

            # if this domain has a parent, then this is technically a
            # subdomain. thus we must check whether the top domain has the
            # catch-all proxy add the necessary references
            if (parent = @get 'parent')
                # get instance
                parent = @collection.get parent.id

                if not parent.hasSubdomains
                    # acts as a reference to the parent domain. note: the
                    # corresponding view will never be targeted programmatically,
                    # but only via the UI.
                    parent.state.subdomain = proxy = new App.Models.Subdomain
                        id: parent.id
                        name: 'All'

                    proxy.parent = parent
                    App.subdomains.add proxy

                parent.hasSubdomains = true

                # make a clone of this domain as a subdomain
                App.subdomains.add (subdomain = new App.Models.Subdomain @attributes)
                # create the parent references..
                @parent = subdomain.parent = parent

                
        activate: ->
            App.State.set 'concept', @state.concept


    ###
    The DomainCollection encapsulates cross-instance logic.
    ###
    class DomainCollection extends Backbone.Collection
        model: Domain
        url: App.urls.domains

        initialize: ->
            App.State.bind 'change:_domain', @changeDomain
            App.State.bind 'change:_subdomain', @changeSubdomain
            App.State.bind 'change:domain', @proxyDomain

        # acts as a proxy for the 'domain' attribute. related models are not
        # aware of whether the domain is a subdomain or not, thus this acts as
        # a catch-all for setting domains that aren't in the "know". this takes
        # a domain ID or a instance and differentiates the type of domain
        proxyDomain: (state, model, options) =>
            # passed by ID
            if typeof model is 'number'
                model = @get model
            type = if model.parent then '_subdomain' else '_domain'
            state.set type, model

        changeDomain: (state, model, options) =>
            # deactivate the previous domain
            if (previous = state.previous '_domain')
                previous.trigger 'deactivate'

            model.trigger 'activate'
            state.set 'domain', model
            state.set '_subdomain', model.state.subdomain

        changeSubdomain: (state, model, options) =>
            if model then model.parent.state.subdomain = model


    ###
    The DomainView handles setting up DOM event handlers for each Domain
    instance that exists.

    DOM Events:
        click - sets ``App.State.[sub]domain`` to this view's model
    ###

    class DomainView extends App.Views.State
        el: '<span role="domain">
                <div class="icon"></div><span role="name"></span>
            </span>'

        elements:
            'span': 'name'

        events:
            'click': 'click'

        render: ->
            name = @model.get 'name'
            @el.attr('id': "tab-#{name.toLowerCase()}")
            Synapse(@name).observe(@model, 'name')
            @

        # primary handler that interfaces with the global App.State. the
        # visual changes will be invoked via this view's collection view
        click: (event) =>
            App.State.set 'domain', @model


    # view
    class DomainCollectionView extends App.Views.Collection
        el: '#categories'
        viewClass: DomainView

        add: (model) =>
            if model.parent then return
            super


    # references
    App.Models.Domain = Domain
    App.Collections.Domain = DomainCollection
    App.Views.Domain = DomainView
    App.Views.DomainCollection = DomainCollectionView

    # create collection
    App.domains = new App.Collections.Domain
