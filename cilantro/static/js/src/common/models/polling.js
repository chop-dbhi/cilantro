var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/utils'], function(utils) {
  var Mixin, PollingCollection, PollingModel;
  Mixin = {
    pollInterval: 1000 * 10,
    initialize: function() {
      return this.startPolling();
    },
    startPolling: function() {
      return this._pollInterval = setInterval((__bind(function() {
        return this.poll();
      }, this)), this.pollInterval);
    },
    stopPolling: function() {
      return clearTimeout(this._pollInterval);
    },
    poll: function() {
      return this.fetch();
    }
  };
  PollingModel = (function() {
    __extends(PollingModel, Backbone.Model);
    function PollingModel() {
      PollingModel.__super__.constructor.apply(this, arguments);
    }
    return PollingModel;
  })();
  PollingCollection = (function() {
    __extends(PollingCollection, Backbone.Collection);
    function PollingCollection() {
      PollingCollection.__super__.constructor.apply(this, arguments);
    }
    return PollingCollection;
  })();
  utils.include(PollingModel, Mixin);
  utils.include(PollingCollection, Mixin);
  return {
    Model: PollingModel,
    Collection: PollingCollection
  };
});