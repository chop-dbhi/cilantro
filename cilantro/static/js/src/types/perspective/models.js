var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/models/polling'], function(polling) {
  var SessionPerspective;
  SessionPerspective = (function() {
    __extends(SessionPerspective, polling.Model);
    function SessionPerspective() {
      SessionPerspective.__super__.constructor.apply(this, arguments);
    }
    SessionPerspective.prototype.url = App.urls.session.perspective;
    return SessionPerspective;
  })();
  return {
    Session: SessionPerspective
  };
});