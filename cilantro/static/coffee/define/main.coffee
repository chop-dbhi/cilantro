require [
        'cilantro/modules/report'
        'cilantro/define/domain'
        'cilantro/define/concept'
        'cilantro/define/search'
        'cilantro/define/criteriamanager'
    ], (report, domain, concept, search) ->

        # create collections..
        domains = new domain.Collection
        concepts = new concept.Collection

        App.pending = 2
        App.ready -> domains.at(0).activate()

        $ ->


            App.DomainTabs = new domain.CollectionView
                collection: domains

            App.ConceptList = new concept.CollectionView
                collection: concepts

            domains.fetch
                initial: true
                success: -> App.pending--

            concepts.fetch
                initial: true
                success: -> App.pending--

            App.report = new report.Model

            App.ReportName = new report.NameView
                model: App.report

            App.report.fetch()
