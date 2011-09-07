$(function() {
  App.DomainTabs = new App.Views.DomainCollection({
    collection: App.domains
  });
  App.SubdomainTabs = new App.Views.SubdomainCollection({
    collection: App.subdomains
  });
  App.ConceptList = new App.Views.ConceptCollection({
    collection: App.concepts
  });
  App.domains.fetch({
    initial: true
  });
  App.concepts.fetch({
    initial: true
  });
  App.report = new Report;
  return App.report.fetch({
    success: function(model) {
      return App.ReportForm = new ReportView({
        model: model
      });
    }
  });
});