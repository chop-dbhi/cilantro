var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['common/views/collection', 'common/models/state', 'common/views/state'], function(collectionview, statemodel, stateview) {
  var InputView, Result, ResultCollection, ResultListView;
  Result = (function() {
    __extends(Result, statemodel.Model);
    function Result() {
      Result.__super__.constructor.apply(this, arguments);
    }
    return Result;
  })();
  ResultCollection = (function() {
    __extends(ResultCollection, Backbone.Collection);
    function ResultCollection() {
      ResultCollection.__super__.constructor.apply(this, arguments);
    }
    ResultCollection.prototype.model = Result;
    ResultCollection.prototype.query = function(query) {
      return $.get(this.url, {
        q: query
      }, __bind(function(ids) {
        return this.each(function(model) {
          var _ref;
          if (_ref = model.id, __indexOf.call(ids, _ref) >= 0) {
            return model.enable();
          } else {
            return model.disable();
          }
        });
      }, this));
    };
    return ResultCollection;
  })();
  InputView = (function() {
    __extends(InputView, Backbone.View);
    function InputView() {
      InputView.__super__.constructor.apply(this, arguments);
    }
    InputView.prototype.events = {
      'focus': 'focus',
      'blur': 'blur',
      'keyup': 'keyup'
    };
    InputView.prototype.focus = function() {
      this.focused = true;
      if (this.el.val() !== '') {
        return this.results.show();
      }
    };
    InputView.prototype.blur = function() {
      this.focused = false;
      if (!this.results.entered) {
        return this.results.hide();
      }
    };
    InputView.prototype.keyup = function() {
      this.results.show();
      clearTimeout(this._searchTimer);
      return this._searchTimer = setTimeout(__bind(function() {
        return this.results.query(this.el.val());
      }, this), 200);
    };
    return InputView;
  })();
  ResultListView = (function() {
    __extends(ResultListView, collectionview.View);
    function ResultListView() {
      this.reposition = __bind(this.reposition, this);
      ResultListView.__super__.constructor.apply(this, arguments);
    }
    ResultListView.prototype.inputViewClass = InputView;
    ResultListView.prototype.defaultContent = '<div class="info">No results found</div>';
    ResultListView.prototype.elements = {
      '.content': 'content'
    };
    ResultListView.prototype.events = {
      'mouseenter': 'mouseenter',
      'mouseleave': 'mouseleave'
    };
    ResultListView.prototype.initialize = function(options) {
      if (!this.input) {
        this.input = new this.inputViewClass;
        this.input.results = this;
        this.defaultContent = $(this.defaultContent).hide();
        this.content.append(this.defaultContent);
      }
      this.render();
      return ResultListView.__super__.initialize.apply(this, arguments);
    };
    ResultListView.prototype.insertChild = function(view) {
      return this.content.append(view.el);
    };
    ResultListView.prototype.render = function() {
      this.el.appendTo('body');
      this.reposition();
      $(window).bind('resize', this.reposition);
      return this;
    };
    ResultListView.prototype.reposition = function() {
      var iHeight, iOffset, iWidth, rWidth;
      rWidth = this.el.outerWidth();
      iOffset = this.input.el.offset();
      iHeight = this.input.el.outerHeight();
      iWidth = this.input.el.outerWidth();
      return this.el.css({
        top: iOffset.top + iHeight + 5,
        left: iOffset.left - (rWidth - iWidth) / 2.0
      });
    };
    ResultListView.prototype.query = function(value) {
      return this.collection.query(value).success(__bind(function(ids) {
        if (ids.length) {
          return this.defaultContent.hide();
        } else {
          return this.defaultContent.show();
        }
      }, this));
    };
    ResultListView.prototype.mouseenter = function() {
      return this.entered = true;
    };
    ResultListView.prototype.mouseleave = function() {
      this.entered = false;
      if (!this.input.focused) {
        return this.hide();
      }
    };
    ResultListView.prototype.show = function() {
      return this.el.fadeIn('fast');
    };
    ResultListView.prototype.hide = function() {
      return this.el.fadeOut('fast');
    };
    return ResultListView;
  })();
  return {
    ResultModel: Result,
    ResultCollection: ResultCollection,
    ResultListView: ResultListView,
    InputView: InputView
  };
});