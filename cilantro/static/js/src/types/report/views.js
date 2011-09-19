var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/utils', 'common/views/collection'], function(utils, CollectionViews) {
  var ReportItem, ReportList, ReportName;
  ReportItem = (function() {
    __extends(ReportItem, Backbone.View);
    function ReportItem() {
      ReportItem.__super__.constructor.apply(this, arguments);
    }
    ReportItem.prototype.el = '<div>\
                    <strong role="name"></strong>\
                    <span class="info">- <span role="unique-count"></span> unique patients</span>\
                    <span class="info time" style="float: right">modified <span role="modified"></span><span role="timesince"></span></span>\
                    <div role="description">\
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque bibendum luctus tempus. Maecenas nec felis sed lectus rhoncus porta vel non ligula.\
                    </div>\
                    <div class="controls"><button>Cancel</button> <button>Save</button></div>\
                </div>';
    ReportItem.prototype.events = {
      'click': 'toggleDescription',
      'click .time': 'toggleTime'
    };
    ReportItem.prototype.elements = {
      '[role=name]': 'name',
      '[role=unique-count]': 'uniqueCount',
      '[role=modified]': 'modified',
      '[role=timesince]': 'timesince',
      '[role=description]': 'description'
    };
    ReportItem.prototype.render = function() {
      this.name.text(this.model.get('name'));
      this.modified.text(this.model.get('modified'));
      this.timesince.text(this.model.get('timesince'));
      this.uniqueCount.text(this.model.get('unique_count'));
      return this;
    };
    ReportItem.prototype.toggleTime = function() {
      this.modified.toggle();
      this.timesince.toggle();
      return false;
    };
    ReportItem.prototype.toggleDescription = function() {
      this.description.toggle();
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