require [
        'cilantro/types/report/models'
        'cilantro/types/report/views'

        'cilantro/types/scope/models'

        'cilantro/types/domain/models'
        'cilantro/types/domain/views'

        'cilantro/types/concept/models'
        'cilantro/types/concept/views'

        'cilantro/pages/define/search'
        'cilantro/pages/define/condition'
        'cilantro/pages/define/interface'
    ],
        
    (Report, ReportViews, Scope, Domain, DomainViews, Concept, ConceptViews, Search, Condition, Interface) ->

        # create collections..
        domains = new Domain.Collection
        concepts = new Concept.Collection
        conditions = new Condition.Collection
        sessionReport = new Report.Session

        conceptResults = new Search.ResultCollection

        App.pending = 2
        App.session = {}
        App.ready -> domains.at(0).activate()

        $ ->

            conceptInterface = new Interface.ConceptInterfaceView

            domainTabs = new DomainViews.DomainCollectionView
                collection: domains

            conceptList = new ConceptViews.CollectionView
                collection: concepts

            conceptResultList = new Search.ResultListView
                collection: conceptResults

            conditionList = new Condition.ListView
                collection: conditions

            conditionListPane = new Condition.ListPane
                list: conditionList

            reportName = new ReportViews.Name
                model: sessionReport

            domains.fetch
                initial: true
                success: -> App.pending--

            concepts.fetch
                initial: true
                success: -> App.pending--

            conceptResults.fetch()

            conditions.fetch()
            sessionReport.fetch()
