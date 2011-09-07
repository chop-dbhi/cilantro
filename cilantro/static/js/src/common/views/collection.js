var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
define(function() {
  var CollectionView;
  CollectionView = (function() {
    __extends(CollectionView, Backbone.View);
    function CollectionView() {
      this.destroy = __bind(this.destroy, this);
      this.remove = __bind(this.remove, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }
    CollectionView.prototype.viewClass = Backbone.View;
    CollectionView.prototype.initialize = function() {
      this.childViews = {};
      this.collection.bind('add', this.add);
      this.collection.bind('reset', this.reset);
      this.collection.bind('remove', this.remove);
      return this.collection.bind('destroy', this.destroy);
    };
    CollectionView.prototype.insertChild = function(view) {
      return this.el.append(view.el);
    };
    CollectionView.prototype.add = function(model) {
      var view, _ref;
      if (_ref = model.cid, __indexOf.call(this.childViews, _ref) >= 0) {
        view = this.childViews[model.cid];
        clearTimeout(view._removeTimer);
      } else {
        view = this.childViews[model.cid] = (new this.viewClass({
          model: model
        })).render();
      }
      return this.insertChild(view);
    };
    CollectionView.prototype.reset = function(collection, options) {
      collection.each(this.add);
      if (options.initial) {
        return this.el.animate({
          opacity: 100
        }, 500);
      }
    };
    CollectionView.prototype.remove = function(model) {
      var view;
      view = this.childViews[model.cid];
      view.el.detach();
      return view._removeTimer = setTimeout((__bind(function() {
        return this.destroy;
      }, this)), 1000 * 10);
    };
    CollectionView.prototype.destroy = function(model) {
      return this.childViews[model.cid].el.remove();
    };
    return CollectionView;
  })();
  return {
    View: CollectionView
  };
});