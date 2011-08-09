var SubDomainView;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
SubDomainView = (function() {
  __extends(SubDomainView, DomainView);
  function SubDomainView() {
    SubDomainView.__super__.constructor.apply(this, arguments);
  }
  SubDomainView.prototype.tagName = 'span';
  SubDomainView.prototype.className = 'subdomain';
  SubDomainView.prototype.initialize = function() {
    controller.bind('change:subdomain', this.toggleActiveStyle);
    return this.render();
  };
  SubDomainView.prototype.render = function() {
    this.el.innerHTML = this.model.get('name');
    this.jq = $(this.el);
    return this.el;
  };
  SubDomainView.prototype.clickBinding = function(event) {
    controller.set({
      subdomain: this.model
    });
    return false;
  };
  return SubDomainView;
})();