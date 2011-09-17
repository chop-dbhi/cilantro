define(['cilantro/types/report/main', 'cilantro/types/scope/main', 'cilantro/types/perspective/main', 'cilantro/pages/workspace/session', 'cilantro/types/report/help'], function(Report, Scope, Perspective, Views, ReportHelp) {
  var reports, sessionPerspective, sessionReport, sessionScope;
  reports = new Report.Models.Collection;
  sessionReport = new Report.Models.Session;
  sessionScope = new Scope.Models.Session;
  sessionPerspective = new Perspective.Models.Session;
  return $(function() {
    var ReportList, SessionPerspective, SessionReport, SessionScope;
    ReportList = new Report.Views.List({
      collection: reports
    });
    SessionScope = new Views.Scope({
      model: sessionScope
    });
    SessionPerspective = new Views.Perspective({
      model: sessionPerspective
    });
    SessionReport = new Views.Report({
      model: sessionReport
    });
    App.ReportHelp = new ReportHelp.Modal({
      trigger: '#open-report-help'
    });
    reports.fetch();
    sessionReport.fetch();
    sessionScope.fetch();
    return sessionPerspective.fetch();
  });
});