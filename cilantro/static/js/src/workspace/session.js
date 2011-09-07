var PerspectiveView, ScopeView, SessionPerspective, SessionScope;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
SessionScope = (function() {
  __extends(SessionScope, polling.Model);
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
  __extends(SessionPerspective, polling.Model);
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