var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/utils'], function(utils) {
  var CollectionView, ExpandableListMixin, ExpandableListView;
  CollectionView = (function() {
    __extends(CollectionView, Backbone.View);
    function CollectionView() {
      this.destroy = __bind(this.destroy, this);
      this.remove = __bind(this.remove, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      this.all = __bind(this.all, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }
    CollectionView.prototype.viewClass = Backbone.View;
    CollectionView.prototype.defaultContent = null;
    CollectionView.prototype.initialize = function() {
      this.childViews = {};
      this.collection.bind('add', this.add);
      this.collection.bind('reset', this.reset);
      this.collection.bind('remove', this.remove);
      this.collection.bind('destroy', this.destroy);
      if (this.defaultContent) {
        this.collection.bind('all', this.all);
        this.defaultContent = this.$(this.defaultContent).detach();
        return this.el.append(this.defaultContent);
      }
    };
    CollectionView.prototype.insertChild = function(view) {
      return this.el.append(view.el);
    };
    CollectionView.prototype.all = function() {
      if (this.collection.length) {
        return this.defaultContent.hide();
      } else {
        return this.defaultContent.show();
      }
    };
    CollectionView.prototype.add = function(model) {
      var view;
      if (this.childViews[model.id || model.cid]) {
        view = this.childViews[model.id || model.cid];
        return clearTimeout(view._destroyTimer);
      } else {
        view = this.childViews[model.id || model.cid] = (new this.viewClass({
          model: model
        })).render();
        return this.insertChild(view);
      }
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
      view = this.childViews[model.id || model.cid];
      view.el.detach();
      return view._destroyTimer = setTimeout(__bind(function() {
        return this.destroy(model);
      }, this), 1000 * 10);
    };
    CollectionView.prototype.destroy = function(model) {
      return this.childViews[model.id || model.cid].el.remove();
    };
    return CollectionView;
  })();
  ExpandableListMixin = {
    collapsedLength: 5,
    getItems: function() {
      return this.el.children();
    },
    getHiddenItems: function() {
      return this.getItems().filter(":gt(" + (this.collapsedLength - 1) + ")");
    },
    getExpanderText: function() {
      return "Show " + (this.getHiddenItems().length) + " more..";
    },
    renderExpander: function() {
      this.expander = $('<a class="expand" href="#">' + this.getExpanderText() + '</a>').bind('click', __bind(function() {
        this.expand();
        return false;
      }, this));
      return this.el.after(this.expander);
    },
    expand: function() {
      this.getHiddenItems().show();
      return this.expander.remove();
    },
    collapse: function() {
      if (this.expander) {
        this.expander.remove();
      }
      if (this.getItems().length > this.collapsedLength) {
        this.getHiddenItems().hide();
        return this.renderExpander();
      }
    }
  };
  ExpandableListView = (function() {
    __extends(ExpandableListView, Backbone.View);
    function ExpandableListView() {
      ExpandableListView.__super__.constructor.apply(this, arguments);
    }
    return ExpandableListView;
  })();
  utils.include(ExpandableListView, ExpandableListMixin);
  return {
    View: CollectionView,
    ExpandableListMixin: ExpandableListMixin,
    ExpandableList: ExpandableListView
  };
});