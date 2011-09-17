var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/views/collection', 'cilantro/utils/logging', 'cilantro/types/report/main'], function(CollectionViews, Logging, Report) {
  var PerspectiveView, ReportView, ScopeView, UnsavedReport;
  ScopeView = (function() {
    __extends(ScopeView, CollectionViews.ExpandableList);
    function ScopeView() {
      this.render = __bind(this.render, this);
      ScopeView.__super__.constructor.apply(this, arguments);
    }
    ScopeView.prototype.el = '#session-scope';
    ScopeView.prototype.defaultContent = '<li class="info">No conditions have been defined</li>';
    ScopeView.prototype.initialize = function() {
      return this.model.bind('change:conditions', this.render);
    };
    ScopeView.prototype.render = function() {
      var conditions, text;
      conditions = this.model.get('conditions');
      if (conditions) {
        text = '<li>' + conditions.conditions.join('</li><li>') + '</li>';
        this.el.html(text);
      }
      return this.collapse();
    };
    return ScopeView;
  })();
  PerspectiveView = (function() {
    __extends(PerspectiveView, CollectionViews.ExpandableList);
    function PerspectiveView() {
      this.render = __bind(this.render, this);
      PerspectiveView.__super__.constructor.apply(this, arguments);
    }
    PerspectiveView.prototype.el = '#session-perspective';
    PerspectiveView.prototype.defaultContent = '<li class="info">No data columns have been choosen</li>';
    PerspectiveView.prototype.initialize = function() {
      return this.model.bind('change:header', this.render);
    };
    PerspectiveView.prototype.template = _.template('<li><%= name %><% if (direction) { %>\
                <span class="info">(<%= direction %>)</span><% } %></li>');
    PerspectiveView.prototype.render = function() {
      var col, _i, _len, _ref;
      this.el.empty();
      _ref = this.model.get('header');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        this.el.append(this.template(col));
      }
      return this.collapse();
    };
    return PerspectiveView;
  })();
  UnsavedReport = (function() {
    __extends(UnsavedReport, Logging.MessageView);
    function UnsavedReport() {
      UnsavedReport.__super__.constructor.apply(this, arguments);
    }
    UnsavedReport.prototype.template = _.template(Report.Messages.UnsavedReportTemplate);
    return UnsavedReport;
  })();
  ReportView = (function() {
    __extends(ReportView, Backbone.View);
    function ReportView() {
      this.hasChanged = __bind(this.hasChanged, this);
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
      this.message = new UnsavedReport({
        model: this.model
      }).render();
      this.model.bind('change', this.render);
      this.model.bind('change:name', __bind(function(model, value) {
        return this.message.el.find('[role=name]').text(value);
      }, this));
      return this.model.bind('change:has_changed', this.hasChanged);
    };
    ReportView.prototype.render = function() {
      this.modified.text(this.model.get('modified'));
      return this.timesince.text(this.model.get('timesince'));
    };
    ReportView.prototype.hasChanged = function(model, value, options) {
      if (value === true) {
        return App.hub.publish('log', this.message);
      } else {
        return App.hub.publish('dismiss', this.message);
      }
    };
    ReportView.prototype.toggleTime = function() {
      this.modified.toggle();
      return this.timesince.toggle();
    };
    return ReportView;
  })();
  return {
    Report: ReportView,
    Scope: ScopeView,
    Perspective: PerspectiveView
  };
});