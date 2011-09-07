var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(function() {
  var App, extend, include, namespace;
  extend = function(obj, mixin) {
    var method, name, _results;
    _results = [];
    for (name in mixin) {
      method = mixin[name];
      _results.push(obj[name] = method);
    }
    return _results;
  };
  include = function(klass, mixin) {
    return extend(klass.prototype, mixin);
  };
  namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref2;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref2 = name.split('.');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      item = _ref2[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };
  App = (function() {
    function App(attrs) {
      attrs.pending || (attrs.pending = 0);
      extend(this, attrs);
    }
    App.prototype._ready = function() {
      var timer;
      if (this._queue) {
        return;
      } else {
        this._queue = [];
      }
      return timer = setInterval(__bind(function() {
        var fn, _i, _len, _ref;
        if (this.pending !== 0) {
          return;
        }
        this._isReady = true;
        clearTimeout(timer);
        _ref = this._queue;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fn = _ref[_i];
          fn();
        }
        return delete this._queue;
      }, this), 25);
    };
    App.prototype.ready = function(fn) {
      this._ready();
      if (this._isReady) {
        return fn();
      }
      return this._queue.push(fn);
    };
    return App;
  })();
  return {
    extend: extend,
    include: include,
    namespace: namespace,
    App: App
  };
});