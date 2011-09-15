var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var PopoverView, locations;
  locations = {
    right: function(reference, target) {
      var rHeight, rOffset, rWidth, tHeight;
      tHeight = target.outerHeight();
      rOffset = reference.offset();
      rHeight = reference.outerHeight();
      rWidth = reference.outerWidth();
      return target.animate({
        top: rOffset.top - (tHeight - rHeight) / 2.0,
        left: rOffset.left + rWidth + 5.0
      }, 300, 'easeOutQuint');
    },
    left: function(reference, target) {
      var rHeight, rOffset, tHeight, tWidth;
      tHeight = target.outerHeight();
      tWidth = target.outerWidth();
      rOffset = reference.offset();
      rHeight = reference.outerHeight();
      return target.animate({
        top: rOffset.top - (tHeight - rHeight) / 2.0,
        left: rOffset.left - tWidth - 5.0
      }, 300, 'easeOutQuint');
    },
    above: function(reference, target) {
      var rOffset, rWidth, tHeight, tWidth;
      tHeight = target.outerHeight();
      tWidth = target.outerWidth();
      rOffset = reference.offset();
      rWidth = reference.outerWidth();
      return target.animate({
        top: rOffset.top - tHeight - 5.0,
        left: rOffset.left - (tWidth - rWidth) / 2.0
      }, 300, 'easeOutQuint');
    },
    below: function(reference, target) {
      var rHeight, rOffset, rWidth, tWidth;
      tWidth = target.outerWidth();
      rOffset = reference.offset();
      rHeight = reference.outerHeight();
      rWidth = reference.outerWidth();
      return target.animate({
        top: rOffset.top + rHeight + 5.0,
        left: rOffset.left - (tWidth - rWidth) / 2.0
      }, 300, 'easeOutQuint');
    }
  };
  PopoverView = (function() {
    __extends(PopoverView, Backbone.View);
    function PopoverView() {
      PopoverView.__super__.constructor.apply(this, arguments);
    }
    PopoverView.prototype.location = 'right';
    PopoverView.prototype.events = {
      'mouseenter': 'mouseenter',
      'mouseleave': 'mouseleave'
    };
    PopoverView.prototype.elements = {
      '.title': 'title',
      '.content': 'content'
    };
    PopoverView.prototype.update = function(view) {};
    PopoverView.prototype.show = function(view, location) {
      if (location == null) {
        location = this.location;
      }
      clearTimeout(this._hoverTimer);
      return this._hoverTimer = setTimeout(__bind(function() {
        this.update(view);
        this.el.removeClass('right left above below').addClass(location);
        locations[location](view.el, this.el);
        return this.el.fadeIn('fast');
      }, this), 300);
    };
    PopoverView.prototype.hide = function(immediately) {
      if (immediately == null) {
        immediately = false;
      }
      clearTimeout(this._hoverTimer);
      if (immediately) {
        return this.el.hide();
      } else if (!this.entered) {
        return this._hoverTimer = setTimeout(__bind(function() {
          return this.el.hide();
        }, this), 100);
      }
    };
    PopoverView.prototype.mouseenter = function(view) {
      clearTimeout(this._hoverTimer);
      return this.entered = true;
    };
    PopoverView.prototype.mouseleave = function() {
      clearTimeout(this._hoverTimer);
      this.entered = false;
      return this.hide();
    };
    return PopoverView;
  })();
  return {
    Popover: PopoverView
  };
});