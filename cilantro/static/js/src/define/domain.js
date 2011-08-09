/*
    A Domain is a high-level organization for concepts. Only a single domain
    can be active at any given time. A domain is considered a sub-domain if and
    only if it has a parent domain defined. If this is the case, then a
    sub-domain implies the parent domain is active.
    */var Domain, DomainCollection, DomainView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Domain = (function() {
  __extends(Domain, Backbone.Model);
  function Domain() {
    this.subdomainBinding = __bind(this.subdomainBinding, this);
    this.domainBinding = __bind(this.domainBinding, this);
    this.conceptBinding = __bind(this.conceptBinding, this);
    Domain.__super__.constructor.apply(this, arguments);
  }
  Domain.prototype.initialize = function() {
    controller.bind('change:concept', this.conceptBinding);
    this.type = this.get('parent') ? 'subdomain' : 'domain';
    this.parent = null;
    this.state = {
      subdomain: null,
      concept: null
    };
    if (this.type === 'domain') {
      return controller.bind('change:domain', this.domainBinding);
    } else {
      return controller.bind('change:subdomain', this.subdomainBinding);
    }
  };
  Domain.prototype.conceptBinding = function(model, concept) {
    if (this === controller.get(this.type)) {
      this.state.concept = concept;
      if (this.type === 'subdomain') {
        return this.parent.state.concept = concept;
      }
    }
  };
  Domain.prototype.domainBinding = function(model, domain) {
    if (this === domain) {
      return controller.set({
        subdomain: this.state.subdomain,
        concept: this.state.concept
      });
    }
  };
  Domain.prototype.subdomainBinding = function(model, subdomain) {
    if (this === subdomain) {
      return controller.set({
        concept: this.state.concept,
        domain: this.parent
      });
    }
  };
  return Domain;
})();
/*
    The DomainCollection encapsulates cross-instance logic.
    */
DomainCollection = (function() {
  __extends(DomainCollection, Backbone.Collection);
  function DomainCollection() {
    DomainCollection.__super__.constructor.apply(this, arguments);
  }
  DomainCollection.prototype.model = Domain;
  DomainCollection.prototype.url = '/apps/audgendb/api/categories/';
  DomainCollection.prototype.initialize = function() {
    this.bind('refresh', this.refreshBinding);
    return controller.bind('change:_domain', this._domainBinding);
  };
  DomainCollection.prototype.refreshBinding = function() {
    return this.each(function(model) {
      if (model.type === 'subdomain') {
        return model.parent = this.get(model.get('parent'));
      }
    });
  };
  return DomainCollection;
})();
/*
    The DomainView handles setting up DOM event handlers for each Domain
    instance that exists.

    DOM Events:
        click - sets ``controller.domain`` to this view's model

    Observed Events:
        controller[change:domain] - add/remove CSS class based on value
    */
DomainView = (function() {
  __extends(DomainView, Backbone.View);
  function DomainView() {
    this.toggleActiveStyle = __bind(this.toggleActiveStyle, this);
    DomainView.__super__.constructor.apply(this, arguments);
  }
  DomainView.prototype.tagName = 'span';
  DomainView.prototype.template = _.template('<div class="icon"></div><span><%= name %></span>');
  DomainView.prototype.events = {
    'click': 'setAppStateDomain'
  };
  DomainView.prototype.initialize = function() {
    controller.bind('change:domain', this.toggleActiveStyle);
    return this.render();
  };
  DomainView.prototype.render = function() {
    var name;
    name = this.model.get('name');
    this.jq = $(this.el).attr({
      'id': "tab-" + (name.toLowerCase())
    }).html(this.template({
      name: name
    }));
    return this.jq;
  };
  DomainView.prototype.setAppStateDomain = function(event) {
    controller.set({
      domain: this.model
    });
    return false;
  };
  DomainView.prototype.toggleActiveStyle = function(model, domain) {
    if (this.model === domain) {
      return this.jq.addClass('active');
    } else {
      return this.jq.removeClass('active');
    }
  };
  return DomainView;
})();