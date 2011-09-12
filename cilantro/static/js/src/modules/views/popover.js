var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var Popover, directions;
  directions = {
    right: function(reference, target) {
      var rHeight, rOffset, rWidth, tHeight;
      tHeight = target.outerHeight();
      rOffset = reference.offset();
      rHeight = reference.outerHeight();
      rWidth = reference.outerWidth();
      return target.animate({
        top: rOffset.top - (tHeight - rHeight) / 2.0,
        left: rOffset.left + rWidth + 5.0
      }, 400, 'easeOutQuint');
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
      }, 400, 'easeOutQuint');
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
      }, 400, 'easeOutQuint');
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
      }, 400, 'easeOutQuint');
    }
  };
  Popover = (function() {
    __extends(Popover, Backbone.View);
    function Popover() {
      Popover.__super__.constructor.apply(this, arguments);
    }
    Popover.prototype.events = {
      'mouseenter': 'mouseenter',
      'mouseleave': 'mouseleave'
    };
    Popover.prototype.elements = {
      '.title': 'title',
      '.content': 'content'
    };
    Popover.prototype.update = function(view) {};
    Popover.prototype.show = function(view, side) {
      if (side == null) {
        side = 'right';
      }
      clearTimeout(this._hoverTimer);
      return this._hoverTimer = setTimeout(__bind(function() {
        this.update(view);
        this.el.removeClass('right left above below').addClass(side);
        directions[side](view.el, this.el);
        return this.el.fadeIn();
      }, this), 200);
    };
    Popover.prototype.hide = function(immediately) {
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
    Popover.prototype.mouseenter = function(view) {
      clearTimeout(this._hoverTimer);
      return this.entered = true;
    };
    Popover.prototype.mouseleave = function() {
      clearTimeout(this._hoverTimer);
      this.entered = false;
      return this.hide();
    };
    return Popover;
  })();
  return {
    Popover: Popover
  };
});