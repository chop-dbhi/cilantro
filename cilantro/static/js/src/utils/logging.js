var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
define(['cilantro/vendor/backbone'], function() {
  var LOG_LEVELS, Log, LogView, Message, MessageView;
  LOG_LEVELS = {
    'debug': 0,
    'info': 1,
    'warning': 2,
    'error': 3,
    'critical': 4
  };
  Message = (function() {
    __extends(Message, Backbone.Model);
    function Message() {
      Message.__super__.constructor.apply(this, arguments);
    }
    Message.prototype.defaults = {
      level: 'info',
      timeout: 3000
    };
    return Message;
  })();
  Log = (function() {
    __extends(Log, Backbone.Collection);
    function Log() {
      this.log = __bind(this.log, this);
      Log.__super__.constructor.apply(this, arguments);
    }
    Log.prototype.model = Message;
    Log.prototype.initialize = function() {
      return App.hub.subscribe('log', this.log);
    };
    Log.prototype.log = function(message) {
      if (message instanceof Backbone.Model) {
        this.add(message);
        return console.log(message);
      }
    };
    return Log;
  })();
  MessageView = (function() {
    __extends(MessageView, Backbone.View);
    function MessageView() {
      MessageView.__super__.constructor.apply(this, arguments);
    }
    MessageView.prototype.template = _.template('<div class="message <%= level %>"><%= message %></div>');
    MessageView.prototype.render = function() {
      this.el = $(this.template(this.model.get('message')));
      return this;
    };
    MessageView.prototype.show = function() {
      return this.el.slideDown(1000, 'easeOutBounce');
    };
    MessageView.prototype.hide = function() {
      return this.el.slideUp(400, 'easeInExpo');
    };
    return MessageView;
  })();
  LogView = (function() {
    __extends(LogView, Backbone.View);
    function LogView() {
      this.dismiss = __bind(this.dismiss, this);
      this.log = __bind(this.log, this);
      LogView.__super__.constructor.apply(this, arguments);
    }
    LogView.prototype.el = '#messages';
    LogView.prototype.initialize = function() {
      App.hub.subscribe('log', this.log);
      return App.hub.subscribe('dismiss', this.dismiss);
    };
    LogView.prototype.log = function(view) {
      if (!view instanceof Backbone.View) {
        view = new MessageView({
          model: view
        });
      }
      this.el.append(view.el.hide());
      view.show();
      if (view.timeout) {
        return this._messageTimer = _.delay(function() {
          return view.hide();
        }, view.timeout);
      }
    };
    LogView.prototype.dismiss = function(view) {
      clearTimeout(this._messageTimer);
      return view.hide();
    };
    return LogView;
  })();
  return {
    Message: Message,
    MessageView: MessageView,
    Log: Log,
    LogView: LogView
  };
});