/*
    Concepts are the data-driven entry points for constructing their
    self-contained interfaces. Every concept must be "contained" within
    a domain, thus when a concept becomes active, the associated domain
    (or sub-domain) will become active as well.
    */var Concept, ConceptCollection, ConceptView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Concept = (function() {
  __extends(Concept, Backbone.Model);
  function Concept() {
    Concept.__super__.constructor.apply(this, arguments);
  }
  return Concept;
})();
/*
    The ConceptCollection encapsulates cross-instance logic.
    */
ConceptCollection = (function() {
  __extends(ConceptCollection, Backbone.Collection);
  function ConceptCollection() {
    ConceptCollection.__super__.constructor.apply(this, arguments);
  }
  ConceptCollection.prototype.model = Concept;
  ConceptCollection.prototype.url = '/apps/audgendb/api/criteria/';
  return ConceptCollection;
})();
ConceptView = (function() {
  __extends(ConceptView, Backbone.View);
  function ConceptView() {
    this.subdomainBinding = __bind(this.subdomainBinding, this);
    this.domainBinding = __bind(this.domainBinding, this);
    this.conceptBinding = __bind(this.conceptBinding, this);
    ConceptView.__super__.constructor.apply(this, arguments);
  }
  ConceptView.prototype.template = _.template('<span class="name"><%= name %></span>\
            <span class="description"><%= description %></span>');
  ConceptView.prototype.events = {
    'click': 'clickBinding'
  };
  ConceptView.prototype.initialize = function() {
    controller.bind('change:concept', this.conceptBinding);
    if (this.model.domain.type === 'domain') {
      controller.bind('change:domain', this.domainBinding);
    } else {
      controller.bind('change:subdomain', this.subdomainBinding);
    }
    this.render();
    return Synapse(controller).notify(this, {
      setInterface: 'conceptBinding'
    });
  };
  ConceptView.prototype.render = function() {
    return this.jq = $(this.el).html(this.template(this.model.toJSON()));
  };
  ConceptView.prototype.conceptBinding = function() {
    if (this.model === controller.get('concept')) {
      return this.jq.addClass('active');
    } else {
      return this.jq.removeClass('active');
    }
  };
  ConceptView.prototype.domainBinding = function() {
    if (this.model.domain === controller.get('domain')) {
      return this.jq.show();
    } else {
      return this.jq.hide();
    }
  };
  ConceptView.prototype.subdomainBinding = function() {
    var domain, subdomain;
    domain = controller.get('domain');
    subdomain = controller.get('subdomain');
    if (subdomain) {
      if (subdomain === this.model.domain) {
        return this.jq.show();
      } else {
        return this.jq.hide();
      }
    } else {
      if (domain === this.model.domain.parent) {
        return this.jq.show();
      } else {
        return this.jq.hide();
      }
    }
  };
  ConceptView.prototype.clickBinding = function(event) {
    if (this.model.domain.type === 'domain') {
      controller.set({
        concept: this.model,
        domain: this.model.domain
      });
    } else {
      controller.set({
        concept: this.model,
        subdomain: this.model.domain
      });
    }
    return false;
  };
  return ConceptView;
})();