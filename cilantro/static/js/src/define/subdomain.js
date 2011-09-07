var Subdomain, SubdomainCollection, SubdomainCollectionView, SubdomainView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Subdomain = (function() {
  __extends(Subdomain, App.Models.Domain);
  function Subdomain() {
    Subdomain.__super__.constructor.apply(this, arguments);
  }
  Subdomain.prototype.initialize = function() {
    this.state = {
      concept: null
    };
    return this.bind('activate', this.activate);
  };
  Subdomain.prototype.activate = function() {
    return App.State.set('concept', this.state.concept);
  };
  return Subdomain;
})();
SubdomainCollection = (function() {
  __extends(SubdomainCollection, App.Collections.Domain);
  function SubdomainCollection() {
    this.changeSubdomain = __bind(this.changeSubdomain, this);
    this.changeDomain = __bind(this.changeDomain, this);
    SubdomainCollection.__super__.constructor.apply(this, arguments);
  }
  SubdomainCollection.prototype.model = Subdomain;
  SubdomainCollection.prototype.initialize = function() {
    App.State.bind('change:_domain', this.changeDomain);
    return App.State.bind('change:_subdomain', this.changeSubdomain);
  };
  SubdomainCollection.prototype.changeDomain = function(state, model, options) {
    return this.each(function(obj) {
      if (model === obj.parent) {
        return obj.trigger('show');
      } else {
        return obj.trigger('hide');
      }
    });
  };
  SubdomainCollection.prototype.changeSubdomain = function(state, model, options) {
    var previous;
    if ((previous = state.previous('_subdomain'))) {
      previous.trigger('deactivate');
    }
    if (model) {
      state.set('domain', model);
      state.set('_domain', model.parent);
      return model.trigger('activate');
    }
  };
  return SubdomainCollection;
})();
SubdomainView = (function() {
  __extends(SubdomainView, App.Views.Domain);
  function SubdomainView() {
    SubdomainView.__super__.constructor.apply(this, arguments);
  }
  SubdomainView.prototype.el = '<span role="name"></span>';
  SubdomainView.prototype.render = function() {
    Synapse(this.el).observe(this.model, 'name');
    return this;
  };
  return SubdomainView;
})();
SubdomainCollectionView = (function() {
  __extends(SubdomainCollectionView, App.Views.Collection);
  function SubdomainCollectionView() {
    SubdomainCollectionView.__super__.constructor.apply(this, arguments);
  }
  SubdomainCollectionView.prototype.el = '#subdomains';
  SubdomainCollectionView.prototype.viewClass = SubdomainView;
  return SubdomainCollectionView;
})();
App.Models.Subdomain = Subdomain;
App.Collections.Subdomain = SubdomainCollection;
App.Views.Subdomain = SubdomainView;
App.Views.SubdomainCollection = SubdomainCollectionView;
App.subdomains = new SubdomainCollection;