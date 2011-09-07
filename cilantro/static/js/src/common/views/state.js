var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function() {
  var StateView;
  StateView = (function() {
    __extends(StateView, Backbone.View);
    function StateView() {
      this.disable = __bind(this.disable, this);
      this.enable = __bind(this.enable, this);
      this.inactivate = __bind(this.inactivate, this);
      this.activate = __bind(this.activate, this);
      StateView.__super__.constructor.apply(this, arguments);
    }
    StateView.prototype.initialize = function() {
      this.model.bind('active', this.activate);
      this.model.bind('inactive', this.inactivate);
      this.model.bind('enabled', this.enable);
      return this.model.bind('disabled', this.disable);
    };
    StateView.prototype.activate = function() {
      return this.el.addClass('active');
    };
    StateView.prototype.inactivate = function() {
      return this.el.removeClass('active');
    };
    StateView.prototype.enable = function() {
      return this.el.show();
    };
    StateView.prototype.disable = function() {
      return this.el.hide();
    };
    return StateView;
  })();
  return {
    View: StateView
  };
});