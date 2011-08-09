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
define('cilantro/workspace/main', ['cilantro/main'], function() {
  var ActivityStream, App, CollectionView, PerspectiveView, PollingCollection, PollingModel, ReportList, ReportListItem, Reports, ScopeView, SessionPerspective, SessionScope, SystemStatusStream;
  App = window.App;
  if (!App) {
    window.App = App = {};
  }
  App.hub = new PubSub;
  CollectionView = (function() {
    __extends(CollectionView, Backbone.View);
    function CollectionView() {
      this.destroy = __bind(this.destroy, this);
      this.remove = __bind(this.remove, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }
    CollectionView.prototype.initialize = function() {
      this.childViews = {};
      this.collection.bind('add', this.add);
      this.collection.bind('reset', this.reset);
      this.collection.bind('remove', this.remove);
      return this.collection.bind('destroy', this.destroy);
    };
    CollectionView.prototype.add = function(model) {
      var view, _ref;
      if (_ref = model.cid, __indexOf.call(this.childViews, _ref) >= 0) {
        view = this.childViews[model.cid];
        clearTimeout(view.dtimer);
      } else {
        view = this.childViews[model.cid] = (new this.viewClass({
          model: model
        })).render();
      }
      return this.el.append(view.el);
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
      return view.dtimer = _.delay(this.destroy, 1000 * 10);
    };
    CollectionView.prototype.destroy = function(model) {
      return this.childViews[model.cid].el.remove();
    };
    return CollectionView;
  })();
  PollingCollection = (function() {
    __extends(PollingCollection, Backbone.Collection);
    function PollingCollection() {
      PollingCollection.__super__.constructor.apply(this, arguments);
    }
    PollingCollection.prototype.interval = 1000 * 10;
    PollingCollection.prototype.initialize = function() {
      return this.poll();
    };
    PollingCollection.prototype.poll = function() {
      return setInterval(__bind(function() {
        return this.fetch();
      }, this), this.interval);
    };
    return PollingCollection;
  })();
  PollingModel = (function() {
    __extends(PollingModel, Backbone.Model);
    function PollingModel() {
      PollingModel.__super__.constructor.apply(this, arguments);
    }
    PollingModel.prototype.interval = 1000 * 10;
    PollingModel.prototype.initialize = function() {
      return this.poll();
    };
    PollingModel.prototype.poll = function() {
      return setInterval(__bind(function() {
        return this.fetch();
      }, this), this.interval);
    };
    return PollingModel;
  })();
  SessionScope = (function() {
    __extends(SessionScope, PollingModel);
    function SessionScope() {
      SessionScope.__super__.constructor.apply(this, arguments);
    }
    SessionScope.prototype.url = App.urls.session.scope;
    return SessionScope;
  })();
  ScopeView = (function() {
    __extends(ScopeView, Backbone.View);
    function ScopeView() {
      this.render = __bind(this.render, this);
      ScopeView.__super__.constructor.apply(this, arguments);
    }
    ScopeView.prototype.el = '#session-scope';
    ScopeView.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };
    ScopeView.prototype.render = function() {
      return this.el.html(this.model.get('text') || '');
    };
    return ScopeView;
  })();
  SessionPerspective = (function() {
    __extends(SessionPerspective, PollingModel);
    function SessionPerspective() {
      SessionPerspective.__super__.constructor.apply(this, arguments);
    }
    SessionPerspective.prototype.url = App.urls.session.perspective;
    return SessionPerspective;
  })();
  PerspectiveView = (function() {
    __extends(PerspectiveView, Backbone.View);
    function PerspectiveView() {
      this.render = __bind(this.render, this);
      PerspectiveView.__super__.constructor.apply(this, arguments);
    }
    PerspectiveView.prototype.el = '#session-perspective';
    PerspectiveView.prototype.initialize = function() {
      return this.model.bind('change', this.render);
    };
    PerspectiveView.prototype.render = function() {
      var col, _i, _len, _ref, _results;
      this.el.empty();
      _ref = this.model.get('header');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        col = _ref[_i];
        _results.push(this.el.append("<li>" + col.name + " <span class=\"info\">(" + col.direction + ")</span></li>"));
      }
      return _results;
    };
    return PerspectiveView;
  })();
  ActivityStream = (function() {
    __extends(ActivityStream, Backbone.Collection);
    function ActivityStream() {
      ActivityStream.__super__.constructor.apply(this, arguments);
    }
    return ActivityStream;
  })();
  SystemStatusStream = (function() {
    __extends(SystemStatusStream, Backbone.Collection);
    function SystemStatusStream() {
      SystemStatusStream.__super__.constructor.apply(this, arguments);
    }
    return SystemStatusStream;
  })();
  Reports = (function() {
    __extends(Reports, PollingCollection);
    function Reports() {
      Reports.__super__.constructor.apply(this, arguments);
    }
    Reports.prototype.url = App.urls.reports;
    return Reports;
  })();
  ReportListItem = (function() {
    __extends(ReportListItem, Backbone.View);
    function ReportListItem() {
      ReportListItem.__super__.constructor.apply(this, arguments);
    }
    ReportListItem.prototype.el = '<li><strong role="name"></strong> - modified <span role="modified"></span></li>';
    ReportListItem.prototype.elements = {
      '[role=name]': 'name',
      '[role=modified]': 'modified'
    };
    ReportListItem.prototype.render = function() {
      return Synapse(this.model).notify(this.name).notify(this.modified);
    };
    return ReportListItem;
  })();
  ReportList = (function() {
    __extends(ReportList, CollectionView);
    function ReportList() {
      ReportList.__super__.constructor.apply(this, arguments);
    }
    ReportList.prototype.el = '#reports ul';
    ReportList.prototype.viewClass = ReportListItem;
    return ReportList;
  })();
  return $(function() {
    App.reports = new Reports;
    App.ReportList = new ReportList({
      collection: App.reports
    });
    App.reports.fetch();
    App.session = {
      scope: new SessionScope,
      perspective: new SessionPerspective
    };
    App.SessionScope = new ScopeView({
      model: App.session.scope
    });
    App.SessionPerspective = new PerspectiveView({
      model: App.session.perspective
    });
    App.session.scope.fetch();
    return App.session.perspective.fetch();
  });
});
