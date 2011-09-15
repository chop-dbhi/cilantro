var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/models/polling'], function(polling) {
  var Report, ReportCollection, SessionReport;
  Report = (function() {
    __extends(Report, Backbone.Model);
    function Report() {
      Report.__super__.constructor.apply(this, arguments);
    }
    return Report;
  })();
  ReportCollection = (function() {
    __extends(ReportCollection, polling.Collection);
    function ReportCollection() {
      ReportCollection.__super__.constructor.apply(this, arguments);
    }
    ReportCollection.prototype.url = App.urls.reports;
    ReportCollection.prototype.model = Report;
    return ReportCollection;
  })();
  SessionReport = (function() {
    __extends(SessionReport, polling.Model);
    function SessionReport() {
      SessionReport.__super__.constructor.apply(this, arguments);
    }
    SessionReport.prototype.url = App.urls.session.report;
    SessionReport.prototype.defaults = {
      name: 'click to add a name...',
      description: 'click to add a description...'
    };
    SessionReport.prototype.initialize = function() {
      this.bind('change', function() {
        this.unbind('change');
        return this.bind('change', this.save);
      });
      return SessionReport.__super__.initialize.apply(this, arguments);
    };
    return SessionReport;
  })();
  return {
    Model: Report,
    Collection: ReportCollection,
    Session: SessionReport
  };
});