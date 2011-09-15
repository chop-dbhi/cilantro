var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/models/state', 'cilantro/types/domain/views'], function(statemodel, DomainViews) {
  /*
          A Domain is a high-level organization for concepts. Only a single domain
          can be active at any given time.
  
          A domain can have subdomains associated with it. If this is the case, it
          will act as a delegate to those subdomains.
          */
  var Domain, DomainCollection, Subdomain, SubdomainCollection;
  Domain = (function() {
    __extends(Domain, statemodel.Model);
    function Domain() {
      Domain.__super__.constructor.apply(this, arguments);
    }
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
    DomainCollection.prototype.url = App.urls.domains;
    DomainCollection.prototype.initialize = function() {
      this.bind('active', this.activate);
      this.bind('inactive', this.inactivate);
      return App.hub.subscribe('domain/request', __bind(function(id) {
        var domain, subdomain;
        domain = this.get(id);
        if (domain) {
          return domain.activate();
        } else {
          subdomain = this.subdomains.get(id);
          domain = this.get(subdomain.get('parent').id);
          domain.activate();
          return subdomain.activate();
        }
      }, this));
    };
    DomainCollection.prototype.parse = function(resp, xhr) {
      var domains, groups, id, key, subdomains;
      groups = _.groupBy(resp, function(obj) {
        var _ref;
        return ((_ref = obj['parent']) != null ? _ref.id : void 0) || null;
      });
      this.subdomains = new SubdomainCollection;
      new DomainViews.SubdomainCollectionView({
        collection: this.subdomains
      });
      domains = groups['null'];
      delete groups['null'];
      subdomains = _.flatten(_.values(groups));
      for (key in groups) {
        id = parseInt(key);
        subdomains.push({
          id: id,
          name: 'All',
          parent: {
            id: id
          }
        });
      }
      this.subdomains.reset(subdomains);
      return domains;
    };
    DomainCollection.prototype.activate = function(model) {
      App.hub.publish('domain/active', model.id);
      return this.chain().without(model).map(function(model) {
        return model.inactivate();
      });
    };
    DomainCollection.prototype.inactivate = function(model) {
      return App.hub.publish('domain/inactive', model.id);
    };
    return DomainCollection;
  })();
  Subdomain = (function() {
    __extends(Subdomain, Domain);
    function Subdomain() {
      Subdomain.__super__.constructor.apply(this, arguments);
    }
    return Subdomain;
  })();
  SubdomainCollection = (function() {
    __extends(SubdomainCollection, DomainCollection);
    function SubdomainCollection() {
      this.toggleEnableByDomain = __bind(this.toggleEnableByDomain, this);
      SubdomainCollection.__super__.constructor.apply(this, arguments);
    }
    SubdomainCollection.prototype.model = Subdomain;
    SubdomainCollection.prototype.initialize = function() {
      App.hub.subscribe('domain/active', this.toggleEnableByDomain);
      this.bind('reset', this.groupByDomain);
      this.bind('active', this.activate);
      return this.bind('inactive', this.inactivate);
    };
    SubdomainCollection.prototype.comparator = function(model) {
      return model.id;
    };
    SubdomainCollection.prototype.groupByDomain = function() {
      return this._byDomain = this.groupBy(function(model) {
        return model.get('parent').id;
      });
    };
    SubdomainCollection.prototype.toggleEnableByDomain = function(id) {
      var active;
      active = false;
      this.map(__bind(function(model) {
        if (model.get('parent').id === id) {
          model.enable({
            reactivate: true
          });
          if (model.isActive()) {
            return active = true;
          }
        } else {
          return model.disable();
        }
      }, this));
      if (!active && this._byDomain[id]) {
        return this.get(id).activate();
      }
    };
    SubdomainCollection.prototype.activate = function(model) {
      App.hub.publish('subdomain/active', model.id);
      return _(this._byDomain[model.get('parent').id]).without(model).map(function(model) {
        return model.inactivate();
      });
    };
    SubdomainCollection.prototype.inactivate = function(model) {
      return App.hub.publish('subdomain/inactive', model.id);
    };
    return SubdomainCollection;
  })();
  return {
    Model: Domain,
    Collection: DomainCollection
  };
});