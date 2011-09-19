var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/utils', 'common/views/collection'], function(utils, CollectionViews) {
  var ReportEditor, ReportItem, ReportList, ReportName;
  ReportEditor = (function() {
    __extends(ReportEditor, Backbone.View);
    function ReportEditor() {
      ReportEditor.__super__.constructor.apply(this, arguments);
    }
    ReportEditor.prototype.el = '<div id="report-editor">\
                <input type="text" name="name" placeholder="Name...">\
                <textarea name="description" placeholder="Description..."></textarea>\
                <div class="controls">\
                    <button>Delete</button>\
                    <button>Save</button>\
                    <button>Cancel</button>\
                </div>\
            </div>';
    ReportEditor.prototype.initialize = function() {
      return this.el.appendTo('body').dialog({
        dialogClass: 'ui-dialog-simple',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: true,
        position: ['center', 150],
        width: 500
      });
    };
    return ReportEditor;
  })();
  ReportItem = (function() {
    __extends(ReportItem, Backbone.View);
    function ReportItem() {
      ReportItem.__super__.constructor.apply(this, arguments);
    }
    ReportItem.prototype.el = '<div>\
                    <strong role="name"></strong>\
                    <span class="info">- <span role="unique-count"></span> unique patients</span>\
                    <span class="info time" style="float: right">modified <span role="modified"></span><span role="timesince"></span></span>\
                    <div role="description"></div>\
                    <div class="controls"><button class="edit">Edit</button> <button class="copy">Copy</button></div>\
                </div>';
    ReportItem.prototype.events = {
      'click .time': 'toggleTime',
      'click .edit': 'edit',
      'click .copy': 'copy',
      'mouseenter': 'showControls',
      'mouseleave': 'hideControls',
      'click': 'toggleDescription'
    };
    ReportItem.prototype.elements = {
      '[role=name]': 'name',
      '[role=unique-count]': 'uniqueCount',
      '[role=modified]': 'modified',
      '[role=timesince]': 'timesince',
      '[role=description]': 'description',
      '.controls': 'controls'
    };
    ReportItem.prototype.render = function() {
      this.name.text(this.model.get('name'));
      this.modified.text(this.model.get('modified'));
      this.timesince.text(this.model.get('timesince'));
      this.description.text(this.model.get('description'));
      this.uniqueCount.text(this.model.get('unique_count'));
      return this;
    };
    ReportItem.prototype.toggleTime = function(evt) {
      this.modified.toggle();
      this.timesince.toggle();
      return evt.stopPropagation();
    };
    ReportItem.prototype.toggleDescription = function(evt) {
      if (!evt.isPropagationStopped()) {
        return this.description.toggle();
      }
    };
    ReportItem.prototype.showControls = function(evt) {
      this._controlsTimer = setTimeout(__bind(function() {
        return this.controls.slideDown(300);
      }, this), 300);
      return false;
    };
    ReportItem.prototype.hideControls = function(evt) {
      clearTimeout(this._controlsTimer);
      this.controls.slideUp(300);
      return false;
    };
    ReportItem.prototype.showEditor = function(model) {
      if (model == null) {
        model = this.model;
      }
      this.editor.el.find('[name=name]').val(model.get('name'));
      this.editor.el.find('[name=description]').val(model.get('description'));
      return this.editor.el.dialog('open');
    };
    ReportItem.prototype.edit = function(evt) {
      this.showEditor();
      return false;
    };
    ReportItem.prototype.copy = function(evt) {
      var copy;
      copy = this.model.clone();
      copy.set('name', copy.get('name') + ' (copy)');
      this.showEditor(copy);
      this.editor.el.find('[name=name]').select();
      return false;
    };
    return ReportItem;
  })();
  ReportList = (function() {
    __extends(ReportList, CollectionViews.View);
    function ReportList() {
      ReportList.__super__.constructor.apply(this, arguments);
    }
    ReportList.prototype.el = '#report-list';
    ReportList.prototype.viewClass = ReportItem;
    ReportList.prototype.defaultContent = '<div class="info">You have no saved reports.\
                <a id="open-report-help" href="#">Learn more</a>.</div>';
    ReportList.prototype.initialize = function() {
      this.editor = new ReportEditor;
      return ReportList.__super__.initialize.apply(this, arguments);
    };
    ReportList.prototype.add = function(model) {
      var view;
      view = ReportList.__super__.add.apply(this, arguments);
      view.editor = this.editor;
      return view;
    };
    return ReportList;
  })();
  utils.include(ReportList, CollectionViews.ExpandableListMixin);
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
  return {
    Name: ReportName,
    Item: ReportItem,
    List: ReportList
  };
});