var ReportList, ReportListItem, Reports;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Reports = (function() {
  __extends(Reports, polling.Collection);
  function Reports() {
    Reports.__super__.constructor.apply(this, arguments);
  }
  Reports.prototype.url = App.urls.reports;
  return Reports;
})();
ReportListItem = (function() {
  __extends(ReportListItem, Backbone.View);
  function ReportListItem() {
    ReportListItem.__super__.constructor.apply(this, arguments);
  }
  ReportListItem.prototype.el = '<li><strong role="name"></strong> - modified ';
  '<span role="modified"></span><span role="timesince"></span></li>';
  ReportListItem.prototype.elements = {
    '[role=name]': 'name',
    '[role=modified]': 'modified',
    '[role=timesince]': 'timesince'
  };
  ReportListItem.prototype.render = function() {
    return Synapse(this.model).notify(this.name).notify(this.timesince).notify(this.modified);
  };
  return ReportListItem;
})();
ReportList = (function() {
  __extends(ReportList, collectionview.View);
  function ReportList() {
    ReportList.__super__.constructor.apply(this, arguments);
  }
  ReportList.prototype.el = '#reports ul';
  ReportList.prototype.viewClass = ReportListItem;
  return ReportList;
})();