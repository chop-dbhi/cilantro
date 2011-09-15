var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/utils', 'common/models/polling', 'common/views/collection', 'vendor/synapse'], function(utils, polling, collectionview) {
  var ReportCollection, ReportItem, ReportList;
  ReportCollection = (function() {
    __extends(ReportCollection, Backbone.Collection);
    function ReportCollection() {
      ReportCollection.__super__.constructor.apply(this, arguments);
    }
    ReportCollection.prototype.url = App.urls.reports;
    return ReportCollection;
  })();
  ReportItem = (function() {
    __extends(ReportItem, Backbone.View);
    function ReportItem() {
      ReportItem.__super__.constructor.apply(this, arguments);
    }
    ReportItem.prototype.el = '<div><strong role="name"></strong> <span class="info">- modified\
            <span role="modified"></span><span role="timesince"></span></span></div>';
    ReportItem.prototype.events = {
      'click .info': 'toggleTime'
    };
    ReportItem.prototype.elements = {
      '[role=name]': 'name',
      '[role=modified]': 'modified',
      '[role=timesince]': 'timesince'
    };
    ReportItem.prototype.render = function() {
      this.name.text(this.model.get('name'));
      this.modified.text(this.model.get('modified'));
      this.timesince.text(this.model.get('timesince'));
      return this;
    };
    ReportItem.prototype.toggleTime = function() {
      this.modified.toggle();
      return this.timesince.toggle();
    };
    return ReportItem;
  })();
  ReportList = (function() {
    __extends(ReportList, collectionview.View);
    function ReportList() {
      ReportList.__super__.constructor.apply(this, arguments);
    }
    ReportList.prototype.el = '#report-list';
    ReportList.prototype.viewClass = ReportItem;
    ReportList.prototype.defaultContent = '<div class="info">No reports have been saved.</div>';
    return ReportList;
  })();
  utils.include(ReportList, collectionview.ExpandableListMixin);
  return {
    Collection: ReportCollection,
    CollectionView: ReportList
  };
});