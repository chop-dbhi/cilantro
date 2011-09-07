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
define(['common/models/state', 'common/views/state', 'common/views/collection'], function(statemodel, stateview, collectionview) {
  /*
      Concepts are the data-driven entry points for constructing their
      self-contained interfaces. Every concept must be "contained" within
      a domain, thus when a concept becomes active, the associated domain
      (or sub-domain) will become active as well.
      */
  var Concept, ConceptCollection, ConceptCollectionView, ConceptDescriptionPopover, ConceptView;
  Concept = (function() {
    __extends(Concept, statemodel.Model);
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
  ConceptDescriptionPopover = (function() {
    __extends(ConceptDescriptionPopover, Backbone.View);
    function ConceptDescriptionPopover() {
      ConceptDescriptionPopover.__super__.constructor.apply(this, arguments);
    }
    ConceptDescriptionPopover.prototype.el = '#concept-description';
    ConceptDescriptionPopover.prototype.noDescription = '<span class="info">No description available</span>';
    ConceptDescriptionPopover.prototype.events = {
      'mouseenter': 'mouseenter',
      'mouseleave': 'mouseleave'
    };
    ConceptDescriptionPopover.prototype.elements = {
      '.title': 'title',
      '.content': 'content'
    };
    ConceptDescriptionPopover.prototype.show = function(view) {
      clearTimeout(this._hoverTimer);
      return this._hoverTimer = setTimeout(__bind(function() {
        var rHeight, vHeight, vOffset, vWidth;
        this.title.text(view.model.get('name'));
        this.content.html(view.model.get('description') || this.noDescription);
        rHeight = this.el.outerHeight();
        vOffset = view.el.offset();
        vHeight = view.el.outerHeight();
        vWidth = view.el.outerWidth();
        this.el.animate({
          top: vOffset.top - (rHeight - vHeight) / 2.0,
          left: vOffset.left + vWidth + 5.0
        }, 400, 'easeOutQuint');
        return this.el.fadeIn();
      }, this), 200);
    };
    ConceptDescriptionPopover.prototype.hide = function(immediately) {
      if (immediately == null) {
        immediately = false;
      }
      clearTimeout(this._hoverTimer);
      if (immediately) {
        return this.el.fadeOut();
      } else if (!this.entered) {
        return this._hoverTimer = setTimeout(__bind(function() {
          return this.el.fadeOut();
        }, this), 100);
      }
    };
    ConceptDescriptionPopover.prototype.mouseenter = function(view) {
      clearTimeout(this._hoverTimer);
      return this.entered = true;
    };
    ConceptDescriptionPopover.prototype.mouseleave = function() {
      clearTimeout(this._hoverTimer);
      this.entered = false;
      return this.hide();
    };
    return ConceptDescriptionPopover;
  })();
  ConceptView = (function() {
    __extends(ConceptView, stateview.View);
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
      this.el.data({
        cid: this.model.cid
      });
      return this;
    };
    ConceptView.prototype.click = function() {
      return this.model.activate({
        local: true
      });
    };
    return ConceptView;
  })();
  ConceptCollectionView = (function() {
    __extends(ConceptCollectionView, collectionview.View);
    function ConceptCollectionView() {
      this.activate = __bind(this.activate, this);
      this.scrollToConcept = __bind(this.scrollToConcept, this);
      ConceptCollectionView.__super__.constructor.apply(this, arguments);
    }
    ConceptCollectionView.prototype.el = '#criteria';
    ConceptCollectionView.prototype.viewClass = ConceptView;
    ConceptCollectionView.prototype.events = {
      'mouseenter div': 'mouseenter',
      'mouseleave div': 'mouseleave',
      'click div': 'click'
    };
    ConceptCollectionView.prototype.initialize = function() {
      ConceptCollectionView.__super__.initialize.apply(this, arguments);
      this.collection.bind('active', this.activate);
      return this.description = new ConceptDescriptionPopover;
    };
    ConceptCollectionView.prototype.scrollToConcept = function(model) {
      var view;
      view = this.childViews[model.cid];
      return this.el.scrollTo(view.el, {
        duration: 800,
        axis: 'y',
        offset: {
          top: this.el.outerHeight() / -2
        },
        easing: 'easeOutQuint'
      });
    };
    ConceptCollectionView.prototype.activate = function(model, options) {
      if (!(options != null ? options.local : void 0)) {
        return _.defer(this.scrollToConcept, model);
      }
    };
    ConceptCollectionView.prototype.mouseenter = function(event) {
      var cid, view;
      cid = $(event.currentTarget).data('cid');
      view = this.childViews[cid];
      return this.description.show(view);
    };
    ConceptCollectionView.prototype.mouseleave = function() {
      return this.description.hide();
    };
    ConceptCollectionView.prototype.click = function() {
      return this.description.hide(true);
    };
    return ConceptCollectionView;
  })();
  return {
    Model: Concept,
    Collection: ConceptCollection,
    View: ConceptView,
    CollectionView: ConceptCollectionView
  };
});