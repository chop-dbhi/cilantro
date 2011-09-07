var Report, ReportView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Report = (function() {
  __extends(Report, Backbone.Model);
  function Report() {
    Report.__super__.constructor.apply(this, arguments);
  }
  Report.prototype.url = App.urls.session.report;
  Report.prototype.defaults = {
    description: 'Add a description...'
  };
  Report.prototype.initialize = function() {
    this.defaults.name = this.generateReportName();
    if (!this.get('name')) {
      return this.set('name', this.defaults.name);
    }
  };
  Report.prototype.generateReportName = function() {
    var now;
    now = new Date();
    return "" + (now.toLocaleDateString()) + " @ " + (now.toLocaleTimeString());
  };
  return Report;
})();
ReportView = (function() {
  __extends(ReportView, Backbone.View);
  function ReportView() {
    this.showDescription = __bind(this.showDescription, this);
    this.editDescription = __bind(this.editDescription, this);
    this.showName = __bind(this.showName, this);
    this.editName = __bind(this.editName, this);
    ReportView.__super__.constructor.apply(this, arguments);
  }
  ReportView.prototype.el = '#report-info';
  ReportView.prototype.events = {
    'dblclick h2': 'editName',
    'blur [name=name]': 'showName',
    'dblclick em': 'editDescription',
    'blur [name=description]': 'showDescription'
  };
  ReportView.prototype.elements = {
    'h2': 'name',
    '[name=name]': 'nameField',
    'em': 'description',
    '[name=description]': 'descriptionField'
  };
  ReportView.prototype.initialize = function() {
    Synapse(this.nameField).sync(this.model).notify(this.name);
    return Synapse(this.descriptionField).sync(this.model).notify(this.description);
  };
  ReportView.prototype.editName = function() {
    this.name.hide();
    return this.nameField.show().select();
  };
  ReportView.prototype.showName = function() {
    this.name.show();
    this.nameField.hide();
    if (!this.model.get('name')) {
      return this.model.set({
        name: this.model.defaults.name
      });
    }
  };
  ReportView.prototype.editDescription = function() {
    this.description.hide();
    return this.descriptionField.show().select();
  };
  ReportView.prototype.showDescription = function() {
    this.description.show();
    this.descriptionField.hide();
    if (!this.model.get('description')) {
      return this.model.set({
        description: this.model.defaults.description
      });
    }
  };
  return ReportView;
})();