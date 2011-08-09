    $ ->
        # intialize the primary views
        App.DomainTabs = new App.Views.DomainCollection
            collection: App.domains

        App.SubdomainTabs = new App.Views.SubdomainCollection
            collection: App.subdomains

        App.ConceptList = new App.Views.ConceptCollection
            collection: App.concepts
        
        # initial fetch, the ``initial`` option is passed to trigger the
        # animation
        App.domains.fetch initial: true
        App.concepts.fetch initial: true
        App.report = new Report
        App.report.fetch
            success: (model) ->
                App.ReportForm = new ReportView
                    model: model
