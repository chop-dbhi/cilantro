var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/views/state', 'common/views/collection', 'common/views/popover'], function(stateview, collectionview, popover) {
  var ConceptCollectionView, ConceptDescriptionPopover, ConceptView;
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
        id: this.model.id
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
  ConceptDescriptionPopover = (function() {
    __extends(ConceptDescriptionPopover, popover.Popover);
    function ConceptDescriptionPopover() {
      ConceptDescriptionPopover.__super__.constructor.apply(this, arguments);
    }
    ConceptDescriptionPopover.prototype.el = '#concept-description';
    ConceptDescriptionPopover.prototype.defaultContent = '<span class="info">No description available</span>';
    ConceptDescriptionPopover.prototype.update = function(view) {
      this.title.text(view.model.get('name'));
      return this.content.html(view.model.get('description') || this.defaultContent);
    };
    return ConceptDescriptionPopover;
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
      view = this.childViews[model.id];
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
        _.defer(this.scrollToConcept, model);
      }
      return App.hub.publish('concept/active', model);
    };
    ConceptCollectionView.prototype.mouseenter = function(event) {
      var id, view;
      id = $(event.currentTarget).data('id');
      view = this.childViews[id];
      return this.description.show(view, 'right');
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
    View: ConceptView,
    CollectionView: ConceptCollectionView
  };
});