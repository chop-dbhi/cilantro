var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define('define/main', ['lib/underscore', 'lib/backbone'], function() {
  /*
  The application namespace.
  */  var App, AppView, Concept, ConceptCollection, ConceptView, Concepts, Domain, DomainCollection, DomainView, Domains, State, SubDomainView;
  window.App = App = {};
  App.Domains = Domains = null;
  App.Concepts = Concepts = null;
  /*
  The storage area for shared state between models and collections. KVO
  can be setup to watch for changes to this object. Each observer should
  force their "onstatechange" behaviors on initialization to ensure they
  "catch up" reflecting the correct application state.
  */
  State = new Backbone.Model({
    _domain: null,
    domain: null,
    subdomain: null,
    concept: null
  });
  /*
  A Domain is a high-level organization for concepts. Only a single domain
  can be active at any given time. A domain is considered a sub-domain if and
  only if it has a parent domain defined. If this is the case, then a
  sub-domain implies the parent domain is active.
  */
  Domain = (function() {
    function Domain() {
      this.subdomainBinding = __bind(this.subdomainBinding, this);;
      this.domainBinding = __bind(this.domainBinding, this);;
      this.conceptBinding = __bind(this.conceptBinding, this);;      Domain.__super__.constructor.apply(this, arguments);
    }
    __extends(Domain, Backbone.Model);
    Domain.prototype.initialize = function() {
      State.bind('change:concept', this.conceptBinding);
      this.type = this.get('parent') ? 'subdomain' : 'domain';
      this.parent = null;
      this.state = {
        subdomain: null,
        concept: null
      };
      if (this.type === 'domain') {
        return State.bind('change:domain', this.domainBinding);
      } else {
        return State.bind('change:subdomain', this.subdomainBinding);
      }
    };
    Domain.prototype.conceptBinding = function(model, concept) {
      if (this === State.get(this.type)) {
        this.state.concept = concept;
        if (this.type === 'subdomain') {
          return this.parent.state.concept = concept;
        }
      }
    };
    Domain.prototype.domainBinding = function(model, domain) {
      if (this === domain) {
        return State.set({
          subdomain: this.state.subdomain,
          concept: this.state.concept
        });
      }
    };
    Domain.prototype.subdomainBinding = function(model, subdomain) {
      if (this === subdomain) {
        return State.set({
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
    function DomainCollection() {
      DomainCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(DomainCollection, Backbone.Collection);
    DomainCollection.prototype.model = Domain;
    DomainCollection.prototype.url = '/audgendb/api/categories/';
    DomainCollection.prototype.initialize = function() {
      this.bind('refresh', this.refreshBinding);
      return State.bind('change:_domain', this._domainBinding);
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
  Concepts are the data-driven entry points for constructing their
  self-contained interfaces. Every concept must be "contained" within
  a domain, thus when a concept becomes active, the associated domain
  (or sub-domain) will become active as well.
  */
  Concept = (function() {
    function Concept() {
      Concept.__super__.constructor.apply(this, arguments);
    }
    __extends(Concept, Backbone.Model);
    return Concept;
  })();
  /*
  The ConceptCollection encapsulates cross-instance logic.
  */
  ConceptCollection = (function() {
    function ConceptCollection() {
      ConceptCollection.__super__.constructor.apply(this, arguments);
    }
    __extends(ConceptCollection, Backbone.Collection);
    ConceptCollection.prototype.model = Concept;
    ConceptCollection.prototype.url = '/audgendb/api/criteria/';
    return ConceptCollection;
  })();
  /*
  The DomainView handles setting up DOM event handlers for each Domain
  instance that exists.
  */
  DomainView = (function() {
    function DomainView() {
      this.domainBinding = __bind(this.domainBinding, this);;      DomainView.__super__.constructor.apply(this, arguments);
    }
    __extends(DomainView, Backbone.View);
    DomainView.prototype.tagName = 'span';
    DomainView.prototype.template = _.template('<div class="icon"></div><span><%= name %></span>');
    DomainView.prototype.events = {
      'click': 'clickBinding'
    };
    DomainView.prototype.initialize = function() {
      State.bind('change:domain', this.domainBinding);
      return this.render();
    };
    DomainView.prototype.render = function() {
      var name;
      name = this.model.get('name');
      this.jq = $(this.el);
      this.jq.attr({
        'id': "tab-" + (name.toLowerCase())
      });
      return this.jq.html(this.template({
        name: name
      }));
    };
    DomainView.prototype.domainBinding = function(model, domain) {
      if (this.model === domain) {
        return this.jq.addClass('active');
      } else {
        return this.jq.removeClass('active');
      }
    };
    DomainView.prototype.clickBinding = function(event) {
      State.set({
        domain: this.model
      });
      return false;
    };
    return DomainView;
  })();
  SubDomainView = (function() {
    function SubDomainView() {
      this.subdomainBinding = __bind(this.subdomainBinding, this);;      SubDomainView.__super__.constructor.apply(this, arguments);
    }
    __extends(SubDomainView, DomainView);
    SubDomainView.prototype.tagName = 'span';
    SubDomainView.prototype.className = 'subdomain';
    SubDomainView.prototype.initialize = function() {
      State.bind('change:subdomain', this.subdomainBinding);
      return this.render();
    };
    SubDomainView.prototype.render = function() {
      return this.el.innerHTML = this.model.get('name');
    };
    SubDomainView.prototype.subdomainBinding = function(model, subdomain) {
      if (this.model === subdomain) {
        return this.jq.addClass('active');
      } else {
        return this.jq.removeClass('active');
      }
    };
    SubDomainView.prototype.clickBinding = function(event) {
      State.set({
        subdomain: this.model
      });
      return false;
    };
    return SubDomainView;
  })();
  ConceptView = (function() {
    function ConceptView() {
      this.subdomainBinding = __bind(this.subdomainBinding, this);;
      this.domainBinding = __bind(this.domainBinding, this);;
      this.conceptBinding = __bind(this.conceptBinding, this);;      ConceptView.__super__.constructor.apply(this, arguments);
    }
    __extends(ConceptView, Backbone.View);
    ConceptView.prototype.template = _.template('<span class="name"><%= name %></span>\
            <span class="description"><%= description %></span>');
    ConceptView.prototype.events = {
      'click': 'clickBinding'
    };
    ConceptView.prototype.initialize = function() {
      State.bind('change:concept', this.conceptBinding);
      if (this.model.domain.type === 'domain') {
        State.bind('change:domain', this.domainBinding);
      } else {
        State.bind('change:subdomain', this.subdomainBinding);
      }
      return this.render();
    };
    ConceptView.prototype.render = function() {
      return this.jq = $(this.el).html(this.template(this.model.toJSON()));
    };
    ConceptView.prototype.conceptBinding = function() {
      if (this.model === State.get('concept')) {
        return this.jq.addClass('active');
      } else {
        return this.jq.removeClass('active');
      }
    };
    ConceptView.prototype.domainBinding = function() {
      if (this.model.domain === State.get('domain')) {
        return this.jq.show();
      } else {
        return this.jq.hide();
      }
    };
    ConceptView.prototype.subdomainBinding = function() {
      var domain, subdomain;
      domain = State.get('domain');
      subdomain = State.get('subdomain');
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
        State.set({
          concept: this.model,
          domain: this.model.domain
        });
      } else {
        State.set({
          concept: this.model,
          subdomain: this.model.domain
        });
      }
      return false;
    };
    return ConceptView;
  })();
  /*
  The ApplicationView itself. This drives the bootstrapping of the whole
  application.
  */
  AppView = (function() {
    function AppView() {
      AppView.__super__.constructor.apply(this, arguments);
    }
    __extends(AppView, Backbone.View);
    AppView.prototype.initialize = function() {
      var concepts, domains, subdomains;
      domains = $('#categories');
      subdomains = $('#sub-categories');
      concepts = $('#criteria');
      Domains = new DomainCollection;
      Domains.fetch({
        success: function() {
          return Domains.each(function(model) {
            var view;
            if (model.type === 'domain') {
              view = new DomainView({
                model: model
              });
              return domains.append(view.el);
            } else {
              view = new SubDomainView({
                model: model
              });
              return subdomains.append(view.el);
            }
          });
        }
      });
      Concepts = new ConceptCollection;
      return Concepts.fetch({
        success: function() {
          Concepts.each(function(model) {
            var view;
            model.domain = Domains.get(model.get('category').id);
            view = new ConceptView({
              model: model
            });
            return concepts.append(view.el);
          });
          return State.set({
            domain: Domains.at(0)
          });
        }
      });
    };
    return AppView;
  })();
  return $(function() {
    return new AppView;
  });
});