var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/models/polling'], function(polling) {
  var PerspectiveView, Report, ReportView, ScopeView;
  Report = (function() {
    __extends(Report, polling.Model);
    function Report() {
      Report.__super__.constructor.apply(this, arguments);
    }
    Report.prototype.url = App.urls.session.report;
    return Report;
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
    PerspectiveView.prototype.template = _.template('<li><%= name %><% if (direction) { %> <span class=\"info\">(direction)</span><% } %></li>');
    PerspectiveView.prototype.render = function() {
      var col, _i, _len, _ref, _results;
      this.el.empty();
      _ref = this.model.get('perspective').header;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        _results.push(this.el.append(this.template(col)));
      }
      return _results;
    };
    return PerspectiveView;
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
  return {
    Report: Report,
    ReportView: ReportView,
    ScopeView: ScopeView,
    PerspectiveView: PerspectiveView
  };
});