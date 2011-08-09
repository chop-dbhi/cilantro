    # models
    class Subdomain extends App.Models.Domain
        initialize: ->
            # internal state for this domain's dependents since these change
            # during the session
            @state =
                # similar to the reasoning above, if this domain becomes inactive and
                # then active (explicitly) it must refresh the interface relative to
                # it's previous state
                concept: null

            @bind 'activate', @activate
                
        activate: ->
            App.State.set 'concept', @state.concept


    class SubdomainCollection extends App.Collections.Domain
        model: Subdomain

        initialize: ->
            App.State.bind 'change:_domain', @changeDomain
            App.State.bind 'change:_subdomain', @changeSubdomain

        changeDomain: (state, model, options) =>
            # iterate over each subdomain for the parent domain and 'show' them
            @each (obj) ->
                if model is obj.parent
                    obj.trigger 'show'
                else
                    obj.trigger 'hide'

        changeSubdomain: (state, model, options) =>
            # deactivate the previous domain
            if (previous = state.previous '_subdomain')
                previous.trigger 'deactivate'

            if model
                state.set 'domain', model
                state.set '_domain', model.parent
                model.trigger 'activate'



    # views
    class SubdomainView extends App.Views.Domain
        el: '<span role="name"></span>'
        render: ->
            Synapse(@el).observe(@model, 'name')
            @


    class SubdomainCollectionView extends App.Views.Collection
        el: '#subdomains'
        viewClass: SubdomainView


    # references
    App.Models.Subdomain = Subdomain
    App.Collections.Subdomain = SubdomainCollection
    App.Views.Subdomain = SubdomainView
    App.Views.SubdomainCollection = SubdomainCollectionView

    # initialize collection so other objects can setup event listeners
    App.subdomains = new SubdomainCollection

