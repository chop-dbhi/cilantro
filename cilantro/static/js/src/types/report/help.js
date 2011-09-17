var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var ReportHelpModal;
  ReportHelpModal = (function() {
    __extends(ReportHelpModal, Backbone.View);
    function ReportHelpModal() {
      ReportHelpModal.__super__.constructor.apply(this, arguments);
    }
    ReportHelpModal.prototype.title = 'Learn about Reports';
    ReportHelpModal.prototype.content = '<div class="content">\
            <section>Hello World</section>\
            </div>';
    ReportHelpModal.prototype.loadContent = null;
    ReportHelpModal.prototype.initialize = function(options) {
      if (this.loadContent) {
        this.el.load(this.loadContent);
      } else {
        this.el.html(this.content);
      }
      this.el.dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        title: this.title
      });
      if (options.trigger) {
        return $(options.trigger).click(__bind(function() {
          this.el.dialog('open');
          return false;
        }, this));
      }
    };
    return ReportHelpModal;
  })();
  return {
    Modal: ReportHelpModal
  };
});