var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/models/polling', 'common/views/collection', 'vendor/synapse'], function(polling, collectionview) {
  var ReportCollection, ReportCollectionView, ReportView;
  ReportCollection = (function() {
    __extends(ReportCollection, polling.Collection);
    function ReportCollection() {
      ReportCollection.__super__.constructor.apply(this, arguments);
    }
    ReportCollection.prototype.url = App.urls.reports;
    return ReportCollection;
  })();
  ReportView = (function() {
    __extends(ReportView, Backbone.View);
    function ReportView() {
      ReportView.__super__.constructor.apply(this, arguments);
    }
    ReportView.prototype.el = '<li><strong role="name"></strong> - modified ';
    '<span role="modified"></span><span role="timesince"></span></li>';
    ReportView.prototype.elements = {
      '[role=name]': 'name',
      '[role=modified]': 'modified',
      '[role=timesince]': 'timesince'
    };
    ReportView.prototype.render = function() {
      return Synapse(this.model).notify(this.name).notify(this.modified);
    };
    return ReportView;
  })();
  ReportCollectionView = (function() {
    __extends(ReportCollectionView, collectionview.View);
    function ReportCollectionView() {
      ReportCollectionView.__super__.constructor.apply(this, arguments);
    }
    ReportCollectionView.prototype.el = '#reports ul';
    ReportCollectionView.prototype.viewClass = ReportView;
    return ReportCollectionView;
  })();
  return {
    Collection: ReportCollection,
    CollectionView: ReportCollectionView
  };
});