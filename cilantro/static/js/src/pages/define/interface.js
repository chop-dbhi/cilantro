var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['cilantro/define/criteriamanager', 'cilantro/define/conceptmanager'], function(CriteriaManager, ConceptManager) {
  var ConceptInterfaceView;
  ConceptInterfaceView = (function() {
    __extends(ConceptInterfaceView, Backbone.View);
    function ConceptInterfaceView() {
      this.activate = __bind(this.activate, this);
      ConceptInterfaceView.__super__.constructor.apply(this, arguments);
    }
    ConceptInterfaceView.prototype.el = '#plugin-panel';
    ConceptInterfaceView.prototype.initialize = function() {
      return App.hub.subscribe('concept/active', this.activate);
    };
    ConceptInterfaceView.prototype.activate = function(model) {
      var condition;
      condition = CriteriaManager.retrieveCriteriaDS(model.id);
      if (ConceptManager.isConceptLoaded(model.id)) {
        return ConceptManager.show({
          id: model.id
        }, condition);
      } else {
        return model.fetch({
          beforeSend: __bind(function() {
            return this.el.block();
          }, this),
          complete: __bind(function() {
            return this.el.unblock();
          }, this),
          success: function() {
            return ConceptManager.show(model.get('viewset'), condition);
          }
        });
      }
    };
    return ConceptInterfaceView;
  })();
  return {
    ConceptInterfaceView: ConceptInterfaceView
  };
});