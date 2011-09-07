$(function() {
  App.report = new Report;
  return App.report.fetch({
    success: function(model) {
      return App.ReportName = new ReportName({
        model: model
      });
    }
  });
});