/*
    Usage:

    $ ->
        App.report = new Report

        App.report.fetch
            success: (model) ->
                App.ReportName = new ReportName
                    model: model

                App.ReportInfo = new ReportInfo
                    model: model
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/models/polling'], function(polling) {
  var Report;
  Report = (function() {
    __extends(Report, polling.Model);
    function Report() {
      Report.__super__.constructor.apply(this, arguments);
    }
    Report.prototype.url = App.urls.session.report;
    Report.prototype.defaults = {
      name: 'click to add a name...',
      description: 'click to add a description...'
    };
    Report.prototype.initialize = function() {
      return this.bind('change:name', this.save);
    };
    return Report;
  })();
  return {
    Model: Report
  };
});