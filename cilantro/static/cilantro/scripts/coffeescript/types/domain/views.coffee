define [
        'common/views/state'
        'common/views/collection'
    ],

    (stateview, collectionview) ->

        ###
        The DomainView handles setting up DOM event handlers for each Domain
        instance that exists.
        ###

        class DomainView extends stateview.View
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
                @name.text @model.get 'name'
                @

            # primary handler that interfaces with the global App.State. the
            # visual changes will be invoked via this view's collection view
            click: (event) =>
                @model.activate()



        class DomainCollectionView extends collectionview.View
            el: '#domains'
            viewClass: DomainView

            reset: (collection, options) ->
                super
                # fade-in the tabs
                if options.initial then $('#tabs').fadeIn()



        class SubdomainView extends DomainView
            el: '<span role="name"></span>'
            render: ->
                @el.text @model.get 'name'
                @


        class SubdomainCollectionView extends collectionview.View
            el: '#subdomains'
            viewClass: SubdomainView

            initialize: ->
                super
                # when a domain is activated, only the concepts under that
                # domain are made visible
                App.hub.subscribe 'domain/active', @toggleEnableByDomain

            toggleEnableByDomain: (id) =>
                if not @collection._byDomain[id]
                    if not @el.is(':hidden') then @el.slideUp('fast')
                else if @el.is(':hidden')
                    @el.slideDown('fast')

        return {
            DomainView: DomainView
            DomainCollectionView: DomainCollectionView
            SubdomainView: SubdomainView
            SubdomainCollectionView: SubdomainCollectionView
        }
