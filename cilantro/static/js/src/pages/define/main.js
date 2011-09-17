require(['cilantro/types/report/main', 'cilantro/types/scope/main', 'cilantro/types/domain/main', 'cilantro/types/concept/main', 'cilantro/pages/define/search', 'cilantro/pages/define/condition', 'cilantro/pages/define/interface'], function(Report, Scope, Domain, Concept, Search, Condition, Interface) {
  var conceptResults, concepts, conditions, domains, sessionReport;
  domains = new Domain.Models.Collection;
  concepts = new Concept.Models.Collection;
  sessionReport = new Report.Models.Session;
  conditions = new Condition.Collection;
  conceptResults = new Search.ResultCollection;
  App.pending = 2;
  App.session = {};
  App.ready(function() {
    return domains.at(0).activate();
  });
  return $(function() {
    var conceptInterface, conceptList, conceptResultList, conditionList, conditionListPane, domainTabs, reportName;
    conceptInterface = new Interface.ConceptInterfaceView;
    domainTabs = new Domain.Views.DomainCollectionView({
      collection: domains
    });
    conceptList = new Concept.Views.CollectionView({
      collection: concepts
    });
    conceptResultList = new Search.ResultListView({
      collection: conceptResults
    });
    conditionList = new Condition.ListView({
      collection: conditions
    });
    conditionListPane = new Condition.ListPane({
      list: conditionList
    });
    reportName = new Report.Views.Name({
      model: sessionReport
    });
    domains.fetch({
      initial: true,
      success: function() {
        return App.pending--;
      }
    });
    concepts.fetch({
      initial: true,
      success: function() {
        return App.pending--;
      }
    });
    conceptResults.fetch();
    conditions.fetch();
    return sessionReport.fetch();
  });
});