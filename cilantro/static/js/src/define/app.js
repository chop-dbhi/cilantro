/*
    The ApplicationView itself. This drives the bootstrapping of the whole
    application.
    */var AppView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AppView = (function() {
  __extends(AppView, Backbone.View);
  function AppView() {
    AppView.__super__.constructor.apply(this, arguments);
  }
  AppView.prototype.initialize = function() {
    var Concepts, Domains, concepts, domains, subdomains;
    domains = $('#categories');
    subdomains = $('#sub-categories');
    concepts = $('#criteria');
    Domains = new DomainCollection;
    Domains.fetch({
      success: function() {
        Domains.each(function(model) {
          var view;
          if (model.type === 'domain') {
            view = new DomainView({
              model: model
            });
            return domains.append(view.jq);
          } else {
            view = new SubDomainView({
              model: model
            });
            return subdomains.append(view.jq);
          }
        });
        domains.animate({
          opacity: 100
        });
        return subdomains.animate({
          opacity: 100
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
          return concepts.append(view.jq);
        });
        concepts.fadeIn();
        return controller.set({
          domain: Domains.at(0)
        });
      }
    });
  };
  return AppView;
})();
$(function() {
  return App.View = new AppView;
});