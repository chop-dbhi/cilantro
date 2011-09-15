var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
define(['common/models/state'], function(statemodel) {
  /*
          Concepts are the data-driven entry points for constructing their
          self-contained interfaces. Every concept must be "contained" within
          a domain, thus when a concept becomes active, the associated domain
          (or sub-domain) will become active as well.
          */
  var Concept, ConceptCollection;
  Concept = (function() {
    __extends(Concept, statemodel.Model);
    function Concept() {
      Concept.__super__.constructor.apply(this, arguments);
    }
    Concept.prototype.url = function() {
      return Concept.__super__.url.apply(this, arguments) + '/';
    };
    return Concept;
  })();
  /*
          The ConceptCollection encapsulates cross-instance logic.
          */
  ConceptCollection = (function() {
    __extends(ConceptCollection, Backbone.Collection);
    function ConceptCollection() {
      this.toggleEnableByDomain = __bind(this.toggleEnableByDomain, this);
      ConceptCollection.__super__.constructor.apply(this, arguments);
    }
    ConceptCollection.prototype.model = Concept;
    ConceptCollection.prototype.url = App.urls.criteria;
    ConceptCollection.prototype.initialize = function() {
      App.hub.subscribe('domain/active', this.toggleEnableByDomain);
      App.hub.subscribe('subdomain/active', this.toggleEnableByDomain);
      this.bind('reset', this.groupByDomain);
      this.bind('active', this.activate);
      this.bind('inactive', this.inactivate);
      App.hub.subscribe('concept/request', __bind(function(id) {
        var concept;
        concept = this.get(id);
        if (concept) {
          App.hub.publish('domain/request', concept.get('domain').id);
          return concept.activate();
        }
      }, this));
      this._activeByDomain = {};
      return this._activeDomain = null;
    };
    ConceptCollection.prototype.groupByDomain = function() {
      this._byDomain = {};
      this._bySubdomain = {};
      return this.each(__bind(function(model) {
        var domain, _base, _base2, _base3, _name, _name2, _name3, _ref, _ref2, _ref3;
        domain = model.get('domain');
        if (domain.parent) {
          ((_ref = (_base = this._bySubdomain)[_name = domain.id]) != null ? _ref : _base[_name] = []).push(model);
          return ((_ref2 = (_base2 = this._byDomain)[_name2 = domain.parent.id]) != null ? _ref2 : _base2[_name2] = []).push(model);
        } else {
          return ((_ref3 = (_base3 = this._byDomain)[_name3 = domain.id]) != null ? _ref3 : _base3[_name3] = []).push(model);
        }
      }, this));
    };
    ConceptCollection.prototype.toggleEnableByDomain = function(id) {
      var concepts, model;
      this._activeDomain = id;
      concepts = this._bySubdomain[id] || this._byDomain[id];
      this.map(function(model) {
        if (__indexOf.call(concepts, model) >= 0) {
          model.enable();
          return model.inactivate();
        } else {
          return model.disable();
        }
      });
      if ((model = this._activeByDomain[id])) {
        return model.activate();
      }
    };
    ConceptCollection.prototype.activate = function(model) {
      var concepts;
      this._activeByDomain[this._activeDomain] = model;
      concepts = this._bySubdomain[this._activeDomain] || this._byDomain[this._activeDomain];
      return _(concepts).without(model).map(function(model) {
        return model.inactivate();
      });
    };
    ConceptCollection.prototype.inactivate = function(model) {};
    return ConceptCollection;
  })();
  return {
    Model: Concept,
    Collection: ConceptCollection
  };
});