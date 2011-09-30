require [
        'cilantro/types/report/main'
        'cilantro/types/scope/main'
        'cilantro/types/domain/main'
        'cilantro/types/concept/main'

        'cilantro/pages/define/search'
        'cilantro/pages/define/condition'
        'cilantro/pages/define/interface'
    ],
        
    (Report, Scope, Domain, Concept, Search, Condition, Interface) ->

        # create collections..
        domains = new Domain.Models.Collection
        concepts = new Concept.Models.Collection
        sessionReport = new Report.Models.Session
        conditions = new Condition.Collection

        conceptResults = new Search.ResultCollection

        App.pending = 2
        App.session = {}
        App.ready -> domains.at(0).activate()

        $ ->

            ConceptInterface = new Interface.ConceptInterfaceView

            DomainTabs = new Domain.Views.DomainCollectionView
                collection: domains

            ConceptList = new Concept.Views.CollectionView
                collection: concepts

            ConceptResultList = new Search.ResultListView
                collection: conceptResults

            ConditionList = new Condition.ListView
                collection: conditions

            ConditionListPane = new Condition.ListPane
                list: ConditionList

            ReportEditor = new Report.Views.Editor

            ReportName = new Report.Views.Name
                model: sessionReport
                editor: ReportEditor

            domains.fetch
                initial: true
                success: -> App.pending--

            concepts.fetch
                initial: true
                success: -> App.pending--

            conceptResults.fetch()

            conditions.fetch()
            sessionReport.fetch()
