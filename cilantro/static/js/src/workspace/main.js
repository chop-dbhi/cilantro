var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/models/polling', 'common/views/collection', 'vendor/synapse'], function(polling, collectionview) {
  var App, PerspectiveView, ReportList, ReportListItem, ReportView, Reports, ScopeView, SessionReport;
  App = window.App;
  if (!App) {
    window.App = App = {};
  }
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
      return Synapse(this.model).notify(this.name).notify(this.modified);
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
  SessionReport = (function() {
    __extends(SessionReport, polling.Model);
    function SessionReport() {
      SessionReport.__super__.constructor.apply(this, arguments);
    }
    SessionReport.prototype.url = App.urls.session.report;
    return SessionReport;
  })();
  ReportView = (function() {
    __extends(ReportView, Backbone.View);
    function ReportView() {
      this.render = __bind(this.render, this);
      ReportView.__super__.constructor.apply(this, arguments);
    }
    ReportView.prototype.el = '#session-report';
    ReportView.prototype.elements = {
      '[role=modified]': 'modified',
      '[role=timesince]': 'timesince'
    };
    ReportView.prototype.events = {
      'click .timestamp': 'toggleTime'
    };
    ReportView.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };
    ReportView.prototype.render = function() {
      this.modified.text(this.model.get('modified'));
      return this.timesince.text(this.model.get('timesince'));
    };
    ReportView.prototype.toggleTime = function() {
      this.modified.toggle();
      return this.timesince.toggle();
    };
    return ReportView;
  })();
  ScopeView = (function() {
    __extends(ScopeView, Backbone.View);
    function ScopeView() {
      this.render = __bind(this.render, this);
      ScopeView.__super__.constructor.apply(this, arguments);
    }
    ScopeView.prototype.el = '#session-scope';
    ScopeView.prototype.initialize = function() {
      return this.model.bind('change:scope', this.render);
    };
    ScopeView.prototype.render = function() {
      return this.el.html(this.model.get('scope').text || '<li class="info">No conditions have been defined</li>');
    };
    return ScopeView;
  })();
  PerspectiveView = (function() {
    __extends(PerspectiveView, Backbone.View);
    function PerspectiveView() {
      this.render = __bind(this.render, this);
      PerspectiveView.__super__.constructor.apply(this, arguments);
    }
    PerspectiveView.prototype.el = '#session-perspective';
    PerspectiveView.prototype.initialize = function() {
      return this.model.bind('change:perspective', this.render);
    };
    PerspectiveView.prototype.render = function() {
      var col, _i, _len, _ref, _results;
      this.el.empty();
      _ref = this.model.get('perspective').header;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        _results.push(this.el.append("<li>" + col.name + " <span class=\"info\">(" + col.direction + ")</span></li>"));
      }
      return _results;
    };
    return PerspectiveView;
  })();
  return $(function() {
    App.reports = new Reports;
    App.ReportList = new ReportList({
      collection: App.reports
    });
    App.reports.fetch();
    App.session = {
      report: new SessionReport
    };
    App.SessionScope = new ScopeView({
      model: App.session.report
    });
    App.SessionPerspective = new PerspectiveView({
      model: App.session.report
    });
    App.SessionReport = new ReportView({
      model: App.session.report
    });
    return App.session.report.fetch();
  });
});