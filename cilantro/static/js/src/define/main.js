require(['cilantro/modules/report', 'cilantro/define/domain', 'cilantro/define/concept', 'cilantro/define/search', 'cilantro/define/criteriamanager'], function(report, domain, concept, search) {
  var concepts, domains;
  domains = new domain.Collection;
  concepts = new concept.Collection;
  App.pending = 2;
  App.ready(function() {
    return domains.at(0).activate();
  });
  return $(function() {
    App.DomainTabs = new domain.CollectionView({
      collection: domains
    });
    App.ConceptList = new concept.CollectionView({
      collection: concepts
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
    App.report = new report.Model;
    App.ReportName = new report.NameView({
      model: App.report
    });
    return App.report.fetch();
  });
});