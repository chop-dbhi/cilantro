var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
define('cilantro/define/main', ['cilantro/main'], function() {
  var App, CollectionView, Concept, ConceptCollection, ConceptCollectionView, ConceptView, Domain, DomainCollection, DomainCollectionView, DomainView, Report, ReportView, StateView, Subdomain, SubdomainCollection, SubdomainCollectionView, SubdomainView;
  App = window.App;
  if (!App) {
    window.App = App = {};
  }
  App.hub = new PubSub;
  App.Models = {};
  App.Collections = {};
  App.Views = {};
  App.Routes = {};
  /*
  
      What is the best of targeting sub-elements?
  
      class ObservableView extends Backbone.View
          applyBindings: (bindings) ->
              if !(bindings or (bindings = @bindings)) then return
              sview = Synapse(@)
              for get, set in bindings
                  sview.observe(@model, get, set)
  
  
      ObservableView::constructor = (options) ->
          @cid = _.uniqueId('view')
          @_configure(options or {})
          @_ensureElement()
          @setLocalElements()
          @applyBindings()
          @delegateEvents()
          @initialize.apply @, arguments
  
      */
  StateView = (function() {
    __extends(StateView, Backbone.View);
    function StateView() {
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.deactivate = __bind(this.deactivate, this);
      this.activate = __bind(this.activate, this);
      StateView.__super__.constructor.apply(this, arguments);
    }
    StateView.prototype.initialize = function() {
      this.model.bind('activate', this.activate);
      this.model.bind('deactivate', this.deactivate);
      this.model.bind('show', this.show);
      return this.model.bind('hide', this.hide);
    };
    StateView.prototype.activate = function() {
      return this.el.addClass('active');
    };
    StateView.prototype.deactivate = function() {
      return this.el.removeClass('active');
    };
    StateView.prototype.show = function() {
      return this.el.show();
    };
    StateView.prototype.hide = function() {
      return this.el.hide();
    };
    return StateView;
  })();
  CollectionView = (function() {
    __extends(CollectionView, Backbone.View);
    function CollectionView() {
      this.destroy = __bind(this.destroy, this);
      this.remove = __bind(this.remove, this);
      this.reset = __bind(this.reset, this);
      this.add = __bind(this.add, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }
    CollectionView.prototype.initialize = function() {
      this.childViews = {};
      this.collection.bind('add', this.add);
      this.collection.bind('reset', this.reset);
      this.collection.bind('remove', this.remove);
      return this.collection.bind('destroy', this.destroy);
    };
    CollectionView.prototype.add = function(model) {
      var view, _ref;
      if (_ref = model.cid, __indexOf.call(this.childViews, _ref) >= 0) {
        view = this.childViews[model.cid];
        clearTimeout(view.dtimer);
      } else {
        view = this.childViews[model.cid] = (new this.viewClass({
          model: model
        })).render();
      }
      return this.el.append(view.el);
    };
    CollectionView.prototype.reset = function(collection, options) {
      collection.each(this.add);
      if (options.initial) {
        return this.el.animate({
          opacity: 100
        }, 500);
      }
    };
    CollectionView.prototype.remove = function(model) {
      var view;
      view = this.childViews[model.cid];
      view.el.detach();
      return view.dtimer = _.delay(this.destroy, 1000 * 10);
    };
    CollectionView.prototype.destroy = function(model) {
      return this.childViews[model.cid].el.remove();
    };
    return CollectionView;
  })();
  App.Views.State = StateView;
  App.Views.Collection = CollectionView;
  /*
      The storage area for shared state between models and collections. KVO
      can be setup to watch for changes to this object. Each observer should
      force their "onstatechange" behaviors on initialization to ensure they
      "catch up" reflecting the correct application state.
      */
  /*
      class State extends Backbone.Model
          defaults:
              # represents the currently active domain. from an application viewpoint
              # there is no distinction between domains and sub-domains. this logic is
              # handled within the DomainCollection
              domain: null
  
              # represents the currently active concept. this will not be set onload
              # unless a session is being refreshed.
              concept: null
  
          initialize: ->
              # delegation for this collection's views. this ensures this event
              # is dealt with once (rather than for N items in the collection)
              @bind 'change:domain', (controller, domain, options) ->
                  # this will not be set if this is the initial load
                  if controller.previous('domain')
                      controller.previous('domain').view.deactivate()
  
                  # set the new domain as active
                  domain.view.activate()
  
                  # update to the latest concept and subdomain for this domain
                  controller.set
                      concept: domain.state.concept
                      subdomain: domain.state.subdomain
                  , options
  
              # delegation for this collection's views. this ensures this event
              # is dealt with once (rather than for N items in the collection)
              @bind 'change:subdomain', (controller, subdomain) ->
                  # this will not be set if this is the initial load
                  if controller.previous('subdomain')
                      controller.previous('subdomain').view.dectivate()
  
                  if subdomain
                      # set the new domain as active
                      subdomain.view.activate()
  
                      # update to the latest concept and subdomain for this domain
                      controller.set
                          concept: subdomain.state.concept
                          domain: subdomain.get('domain')
                      , options
  
              # when the concept changes, it's domain must be change on the
              # controller. the attribute that gets set is relative to the domain
              # type
              @bind 'change:concept', (controller, concept, options) ->
                  if not concept
                      return
  
                  domain = concept.get('domain')
  
                  # update internal state of the domain
                  domain.state.concept = concept
  
                  attrs = {}
                  attrs[domain.type] = domain
                  controller.set attrs, options
  
      */
  App.State = new Backbone.Model;
  /*
      A Domain is a high-level organization for concepts. Only a single domain
      can be active at any given time.
  
      A domain can have subdomains associated with it. If this is the case, it
      will act as a delegate to those subdomains.
      */
  Domain = (function() {
    __extends(Domain, Backbone.Model);
    function Domain() {
      Domain.__super__.constructor.apply(this, arguments);
    }
    Domain.prototype.initialize = function() {
      var parent, proxy, subdomain;
      this.bind('activate', this.activate);
      this.state = {
        subdomain: null,
        concept: null
      };
      if ((parent = this.get('parent'))) {
        parent = this.collection.get(parent.id);
        if (!parent.hasSubdomains) {
          parent.state.subdomain = proxy = new App.Models.Subdomain({
            id: parent.id,
            name: 'All'
          });
          proxy.parent = parent;
          App.subdomains.add(proxy);
        }
        parent.hasSubdomains = true;
        App.subdomains.add((subdomain = new App.Models.Subdomain(this.attributes)));
        return this.parent = subdomain.parent = parent;
      }
    };
    Domain.prototype.activate = function() {
      return App.State.set('concept', this.state.concept);
    };
    return Domain;
  })();
  /*
      The DomainCollection encapsulates cross-instance logic.
      */
  DomainCollection = (function() {
    __extends(DomainCollection, Backbone.Collection);
    function DomainCollection() {
      this.changeSubdomain = __bind(this.changeSubdomain, this);
      this.changeDomain = __bind(this.changeDomain, this);
      this.proxyDomain = __bind(this.proxyDomain, this);
      DomainCollection.__super__.constructor.apply(this, arguments);
    }
    DomainCollection.prototype.model = Domain;
    DomainCollection.prototype.url = App.urls.domains;
    DomainCollection.prototype.initialize = function() {
      App.State.bind('change:_domain', this.changeDomain);
      App.State.bind('change:_subdomain', this.changeSubdomain);
      return App.State.bind('change:domain', this.proxyDomain);
    };
    DomainCollection.prototype.proxyDomain = function(state, model, options) {
      var type;
      if (typeof model === 'number') {
        model = this.get(model);
      }
      type = model.parent ? '_subdomain' : '_domain';
      return state.set(type, model);
    };
    DomainCollection.prototype.changeDomain = function(state, model, options) {
      var previous;
      if ((previous = state.previous('_domain'))) {
        previous.trigger('deactivate');
      }
      model.trigger('activate');
      state.set('domain', model);
      return state.set('_subdomain', model.state.subdomain);
    };
    DomainCollection.prototype.changeSubdomain = function(state, model, options) {
      if (model) {
        return model.parent.state.subdomain = model;
      }
    };
    return DomainCollection;
  })();
  /*
      The DomainView handles setting up DOM event handlers for each Domain
      instance that exists.
  
      DOM Events:
          click - sets ``App.State.[sub]domain`` to this view's model
      */
  DomainView = (function() {
    __extends(DomainView, App.Views.State);
    function DomainView() {
      this.click = __bind(this.click, this);
      DomainView.__super__.constructor.apply(this, arguments);
    }
    DomainView.prototype.el = '<span role="domain">\
                <div class="icon"></div><span role="name"></span>\
            </span>';
    DomainView.prototype.elements = {
      'span': 'name'
    };
    DomainView.prototype.events = {
      'click': 'click'
    };
    DomainView.prototype.render = function() {
      var name;
      name = this.model.get('name');
      this.el.attr({
        'id': "tab-" + (name.toLowerCase())
      });
      Synapse(this.name).observe(this.model, 'name');
      return this;
    };
    DomainView.prototype.click = function(event) {
      return App.State.set('domain', this.model);
    };
    return DomainView;
  })();
  DomainCollectionView = (function() {
    __extends(DomainCollectionView, App.Views.Collection);
    function DomainCollectionView() {
      this.add = __bind(this.add, this);
      DomainCollectionView.__super__.constructor.apply(this, arguments);
    }
    DomainCollectionView.prototype.el = '#categories';
    DomainCollectionView.prototype.viewClass = DomainView;
    DomainCollectionView.prototype.add = function(model) {
      if (model.parent) {
        return;
      }
      return DomainCollectionView.__super__.add.apply(this, arguments);
    };
    return DomainCollectionView;
  })();
  App.Models.Domain = Domain;
  App.Collections.Domain = DomainCollection;
  App.Views.Domain = DomainView;
  App.Views.DomainCollection = DomainCollectionView;
  App.domains = new App.Collections.Domain;
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
  /*
      Concepts are the data-driven entry points for constructing their
      self-contained interfaces. Every concept must be "contained" within
      a domain, thus when a concept becomes active, the associated domain
      (or sub-domain) will become active as well.
      */
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
      this.changeDomain = __bind(this.changeDomain, this);
      this.changeConcept = __bind(this.changeConcept, this);
      ConceptCollection.__super__.constructor.apply(this, arguments);
    }
    ConceptCollection.prototype.model = Concept;
    ConceptCollection.prototype.url = App.urls.criteria;
    ConceptCollection.prototype.initialize = function() {
      App.State.bind('change:concept', this.changeConcept);
      return App.State.bind('change:domain', this.changeDomain);
    };
    ConceptCollection.prototype.changeConcept = function(state, model, options) {
      var previous;
      if ((previous = state.previous('concept'))) {
        previous.trigger('deactivate');
      }
      if (model) {
        model.trigger('activate');
        return state.set('domain', App.domains.get(model.get('domain').id));
      }
    };
    ConceptCollection.prototype.changeDomain = function(state, model, options) {
      return this.each(function(obj) {
        var domain, parent;
        domain = obj.get('domain');
        parent = domain.parent;
        if (domain.id === model.id || parent && parent.id === model.id) {
          return obj.trigger('show');
        } else {
          return obj.trigger('hide');
        }
      });
    };
    return ConceptCollection;
  })();
  ConceptView = (function() {
    __extends(ConceptView, App.Views.State);
    function ConceptView() {
      ConceptView.__super__.constructor.apply(this, arguments);
    }
    ConceptView.prototype.template = _.template('<span class="name"><%= name %></span>\
            <span class="description"><%= description %></span>');
    ConceptView.prototype.events = {
      'click': 'click'
    };
    ConceptView.prototype.render = function() {
      this.el.html(this.template(this.model.toJSON()));
      return this;
    };
    ConceptView.prototype.click = function(event) {
      App.State.set({
        concept: this.model
      }, {
        noscroll: true
      });
      return false;
    };
    return ConceptView;
  })();
  ConceptCollectionView = (function() {
    __extends(ConceptCollectionView, App.Views.Collection);
    function ConceptCollectionView() {
      this.activate = __bind(this.activate, this);
      this.scrollToConcept = __bind(this.scrollToConcept, this);
      ConceptCollectionView.__super__.constructor.apply(this, arguments);
    }
    ConceptCollectionView.prototype.el = '#criteria';
    ConceptCollectionView.prototype.viewClass = ConceptView;
    ConceptCollectionView.prototype.initialize = function() {
      ConceptCollectionView.__super__.initialize.apply(this, arguments);
      return this.collection.bind('activate', this.activate);
    };
    ConceptCollectionView.prototype.scrollToConcept = function(model) {
      var view;
      view = this.childViews[model.cid];
      return this.el.scrollTo(view.el, 250, {
        axis: 'y',
        offset: {
          top: this.el.outerHeight() / -2
        }
      });
    };
    ConceptCollectionView.prototype.activate = function(collection, model, options) {
      if (model) {
        if (!options.noscroll) {
          return _.defer(this.scrollToConcept, model);
        }
      }
    };
    return ConceptCollectionView;
  })();
  App.Models.Concept = Concept;
  App.Collections.Concept = ConceptCollection;
  App.Views.Concept = ConceptView;
  App.Views.ConceptCollection = ConceptCollectionView;
  App.concepts = new App.Collections.Concept;
  Report = (function() {
    __extends(Report, Backbone.Model);
    function Report() {
      Report.__super__.constructor.apply(this, arguments);
    }
    Report.prototype.url = App.urls.session.report;
    Report.prototype.defaults = {
      description: 'Add a description...'
    };
    Report.prototype.initialize = function() {
      this.defaults.name = this.generateReportName();
      if (!this.get('name')) {
        return this.set('name', this.defaults.name);
      }
    };
    Report.prototype.generateReportName = function() {
      var now;
      now = new Date();
      return "" + (now.toLocaleDateString()) + " @ " + (now.toLocaleTimeString());
    };
    return Report;
  })();
  ReportView = (function() {
    __extends(ReportView, Backbone.View);
    function ReportView() {
      this.showDescription = __bind(this.showDescription, this);
      this.editDescription = __bind(this.editDescription, this);
      this.showName = __bind(this.showName, this);
      this.editName = __bind(this.editName, this);
      ReportView.__super__.constructor.apply(this, arguments);
    }
    ReportView.prototype.el = '#report-info';
    ReportView.prototype.events = {
      'dblclick h2': 'editName',
      'blur [name=name]': 'showName',
      'dblclick em': 'editDescription',
      'blur [name=description]': 'showDescription'
    };
    ReportView.prototype.elements = {
      'h2': 'name',
      '[name=name]': 'nameField',
      'em': 'description',
      '[name=description]': 'descriptionField'
    };
    ReportView.prototype.initialize = function() {
      Synapse(this.nameField).sync(this.model).notify(this.name);
      return Synapse(this.descriptionField).sync(this.model).notify(this.description);
    };
    ReportView.prototype.editName = function() {
      this.name.hide();
      return this.nameField.show().select();
    };
    ReportView.prototype.showName = function() {
      this.name.show();
      this.nameField.hide();
      if (!this.model.get('name')) {
        return this.model.set({
          name: this.model.defaults.name
        });
      }
    };
    ReportView.prototype.editDescription = function() {
      this.description.hide();
      return this.descriptionField.show().select();
    };
    ReportView.prototype.showDescription = function() {
      this.description.show();
      this.descriptionField.hide();
      if (!this.model.get('description')) {
        return this.model.set({
          description: this.model.defaults.description
        });
      }
    };
    return ReportView;
  })();
  return $(function() {
    App.DomainTabs = new App.Views.DomainCollection({
      collection: App.domains
    });
    App.SubdomainTabs = new App.Views.SubdomainCollection({
      collection: App.subdomains
    });
    App.ConceptList = new App.Views.ConceptCollection({
      collection: App.concepts
    });
    App.domains.fetch({
      initial: true
    });
    App.concepts.fetch({
      initial: true
    });
    App.report = new Report;
    return App.report.fetch({
      success: function(model) {
        return App.ReportForm = new ReportView({
          model: model
        });
      }
    });
  });
});
