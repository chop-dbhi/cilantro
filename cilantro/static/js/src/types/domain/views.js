var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/views/state', 'common/views/collection'], function(stateview, collectionview) {
  /*
          The DomainView handles setting up DOM event handlers for each Domain
          instance that exists.
          */
  var DomainCollectionView, DomainView, SubdomainCollectionView, SubdomainView;
  DomainView = (function() {
    __extends(DomainView, stateview.View);
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
      this.name.text(this.model.get('name'));
      return this;
    };
    DomainView.prototype.click = function(event) {
      return this.model.activate();
    };
    return DomainView;
  })();
  DomainCollectionView = (function() {
    __extends(DomainCollectionView, collectionview.View);
    function DomainCollectionView() {
      DomainCollectionView.__super__.constructor.apply(this, arguments);
    }
    DomainCollectionView.prototype.el = '#domains';
    DomainCollectionView.prototype.viewClass = DomainView;
    return DomainCollectionView;
  })();
  SubdomainView = (function() {
    __extends(SubdomainView, DomainView);
    function SubdomainView() {
      SubdomainView.__super__.constructor.apply(this, arguments);
    }
    SubdomainView.prototype.el = '<span role="name"></span>';
    SubdomainView.prototype.render = function() {
      this.el.text(this.model.get('name'));
      return this;
    };
    return SubdomainView;
  })();
  SubdomainCollectionView = (function() {
    __extends(SubdomainCollectionView, DomainCollectionView);
    function SubdomainCollectionView() {
      this.toggleEnableByDomain = __bind(this.toggleEnableByDomain, this);
      SubdomainCollectionView.__super__.constructor.apply(this, arguments);
    }
    SubdomainCollectionView.prototype.el = '#subdomains';
    SubdomainCollectionView.prototype.viewClass = SubdomainView;
    SubdomainCollectionView.prototype.initialize = function() {
      SubdomainCollectionView.__super__.initialize.apply(this, arguments);
      return App.hub.subscribe('domain/active', this.toggleEnableByDomain);
    };
    SubdomainCollectionView.prototype.toggleEnableByDomain = function(id) {
      if (!this.collection._byDomain[id]) {
        if (!this.el.is(':hidden')) {
          return this.el.fadeTo(100, 0).slideUp('fast');
        }
      } else if (this.el.is(':hidden')) {
        return this.el.slideDown('fast').fadeTo(100, 1);
      }
    };
    return SubdomainCollectionView;
  })();
  return {
    DomainView: DomainView,
    DomainCollectionView: DomainCollectionView,
    SubdomainView: SubdomainView,
    SubdomainCollectionView: SubdomainCollectionView
  };
});