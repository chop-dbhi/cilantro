var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function() {
  var ReportInfo, ReportName;
  ReportName = (function() {
    __extends(ReportName, Backbone.View);
    function ReportName() {
      this.enter = __bind(this.enter, this);
      this.show = __bind(this.show, this);
      this.edit = __bind(this.edit, this);
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
      '[name=name]': 'nameField'
    };
    ReportName.prototype.initialize = function() {
      return this.model.bind('change', this.show);
    };
    ReportName.prototype.edit = function() {
      this.model.unbind('change', this.show);
      this.name.hide();
      return this.nameField.show().select();
    };
    ReportName.prototype.show = function(event) {
      var name;
      if ((name = this.nameField.val()) && name !== this.model.defaults.name) {
        this.name.removeClass('placeholder');
        this.model.set({
          name: name
        });
      } else {
        this.name.addClass('placeholder');
        name = this.model.defaults.name;
      }
      this.name.text(name);
      this.name.show();
      this.nameField.hide();
      return this.model.bind('change', this.show);
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
      '[name=description]': 'descriptionField'
    };
    ReportInfo.prototype.initialize = function() {
      if (this.model.id && this.model.get('has_changed')) {
        return this.el.addClass('unsaved');
      }
    };
    ReportInfo.prototype.editDescription = function() {
      this.description.hide();
      return this.descriptionField.show().select();
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
      return this.descriptionField.hide();
    };
    return ReportInfo;
  })();
  return {
    ReportName: ReportName,
    ReportInfo: ReportInfo
  };
});