var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/models/polling'], function(polling) {
  var Report, ReportInfo, ReportName;
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
    Report.prototype.toJSON = function() {
      var attrs, _ref, _ref2;
      attrs = Report.__super__.toJSON.apply(this, arguments);
      attrs.perspective = ((_ref = attrs.perspective) != null ? _ref.id : void 0) || null;
      attrs.scope = ((_ref2 = attrs.scope) != null ? _ref2.id : void 0) || null;
      return attrs;
    };
    Report.prototype.initialize = function() {
      return this.bind('change', function() {
        this.unbind('change');
        return this.bind('change', this.save);
      });
    };
    return Report;
  })();
  ReportName = (function() {
    __extends(ReportName, Backbone.View);
    function ReportName() {
      this.enter = __bind(this.enter, this);
      this.show = __bind(this.show, this);
      this.edit = __bind(this.edit, this);
      this.render = __bind(this.render, this);
      ReportName.__super__.constructor.apply(this, arguments);
    }
    ReportName.prototype.el = '#report-name';
    ReportName.prototype.events = {
      'click span': 'edit',
      'blur [name=name]': 'show',
      'keypress [name=name]': 'enter'
    };
    ReportName.prototype.elements = {
      'span': 'name',
      '[name=name]': 'nameInput'
    };
    ReportName.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };
    ReportName.prototype.render = function() {
      var name;
      if ((name = this.model.get('name'))) {
        this.name.removeClass('placeholder');
      } else {
        this.name.addClass('placeholder');
        name = this.model.defaults.name;
      }
      return this.name.text(name);
    };
    ReportName.prototype.edit = function() {
      this.model.stopPolling();
      this.name.hide();
      return this.nameInput.show().select();
    };
    ReportName.prototype.show = function(event) {
      var name;
      if ((name = this.nameInput.val()) && !/^\s*$/.test(name)) {
        this.model.set({
          name: name
        });
        this.render();
      }
      this.name.show();
      this.nameInput.hide();
      return this.model.startPolling();
    };
    ReportName.prototype.enter = function(event) {
      if (event.which === 13) {
        return this.show();
      }
    };
    return ReportName;
  })();
  ReportInfo = (function() {
    __extends(ReportInfo, Backbone.View);
    function ReportInfo() {
      this.showDescription = __bind(this.showDescription, this);
      this.editDescription = __bind(this.editDescription, this);
      ReportInfo.__super__.constructor.apply(this, arguments);
    }
    ReportInfo.prototype.el = '#report-info';
    ReportInfo.prototype.events = {
      'click p': 'editDescription',
      'blur [name=description]': 'showDescription'
    };
    ReportInfo.prototype.elements = {
      'p': 'description',
      '[name=description]': 'descriptionInput'
    };
    ReportInfo.prototype.initialize = function() {
      if (this.model.id && this.model.get('has_changed')) {
        return this.el.addClass('unsaved');
      }
    };
    ReportInfo.prototype.editDescription = function() {
      this.description.hide();
      return this.descriptionInput.show().select();
    };
    ReportInfo.prototype.showDescription = function() {
      if (!this.model.get('description')) {
        this.model.set({
          description: this.model.defaults.description
        });
        this.description.addClass('placeholder');
      } else {
        this.description.removeClass('placeholder');
      }
      this.description.show();
      return this.descriptionInput.hide();
    };
    return ReportInfo;
  })();
  return {
    Model: Report,
    NameView: ReportName,
    InfoView: ReportInfo
  };
});