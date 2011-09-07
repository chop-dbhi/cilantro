var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(function() {
  var StateModel;
  StateModel = (function() {
    __extends(StateModel, Backbone.Model);
    function StateModel() {
      StateModel.__super__.constructor.apply(this, arguments);
    }
    StateModel.prototype.defaults = {
      _active: false,
      _enabled: true
    };
    StateModel.prototype.initialize = function() {
      this.bind('change:_active', this._changeActive);
      return this.bind('change:_enabled', this._changeEnabled);
    };
    StateModel.prototype.toJSON = function() {
      var attrs;
      attrs = StateModel.__super__.toJSON.apply(this, arguments);
      delete attrs['_active'];
      delete attrs['_enabled'];
      return attrs;
    };
    StateModel.prototype._changeActive = function(model, active, options) {
      var event;
      event = active ? 'active' : 'inactive';
      return this.trigger(event, this, options);
    };
    StateModel.prototype._changeEnabled = function(model, enabled, options) {
      var event;
      event = enabled ? 'enabled' : 'disabled';
      return this.trigger(event, this, options);
    };
    StateModel.prototype.enable = function(options) {
      var wasDisabled;
      if (options == null) {
        options = {};
      }
      wasDisabled = !this.get('_enabled');
      this.set('_enabled', true, options);
      if (options.reactivate && wasDisabled && this.isActive()) {
        return this._changeActive(this, true);
      }
    };
    StateModel.prototype.disable = function(options) {
      return this.set('_enabled', false, options);
    };
    StateModel.prototype.activate = function(options) {
      if (this.get('_enabled')) {
        return this.set('_active', true, options);
      }
    };
    StateModel.prototype.inactivate = function(options) {
      if (this.get('_enabled')) {
        return this.set('_active', false, options);
      }
    };
    StateModel.prototype.isEnabled = function() {
      return this.get('_enabled');
    };
    StateModel.prototype.isActive = function() {
      return this.get('_enabled') && this.get('_active');
    };
    return StateModel;
  })();
  return {
    Model: StateModel
  };
});