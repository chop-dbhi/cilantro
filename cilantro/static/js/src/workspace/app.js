$(function() {
  App.reports = new Reports;
  App.ReportList = new ReportList({
    collection: App.reports
  });
  App.reports.fetch();
  App.session = {
    scope: new SessionScope,
    perspective: new SessionPerspective
  };
  App.SessionScope = new ScopeView({
    model: App.session.scope
  });
  App.SessionPerspective = new PerspectiveView({
    model: App.session.perspective
  });
  App.session.scope.fetch();
  return App.session.perspective.fetch();
});