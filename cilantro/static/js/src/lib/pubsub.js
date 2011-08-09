var __slice = Array.prototype.slice;
(function(window) {
  var Pub, PubSub, Sub, Topic, puid, suid;
  if (!Array.prototype.last) {
    Array.prototype.last = function() {
      return this[this.length - 1];
    };
  }
  puid = 1;
  suid = 1;
  Sub = function(topic, forwards, backwards, context) {
    this.id = suid++;
    this.topic = topic;
    this.forwards = forwards;
    this.backwards = backwards;
    this.context = context || this;
    this.active = true;
    return this;
  };
  Pub = function(topic, args, prev) {
    this.id = puid++;
    this.topic = topic;
    this.args = args;
    this.prev = prev;
    return this;
  };
  Topic = function(name) {
    this.name = name;
    this.subscribers = [];
    this.history = [];
    this.active = true;
    return this;
  };
  PubSub = function() {
    return new PubSub.fn.init();
  };
  PubSub.version = '0.1';
  PubSub.fn = PubSub.prototype = {
    constructor: PubSub,
    init: function() {
      this.topics = {};
      this.publications = {};
      this.subscribers = {};
      this.undoStack = [];
      this.redoStack = [];
      return this;
    },
    subscribe: function(name, forwards, backwards, context, history) {
      var pub, publish, sub, topic, _i, _len, _ref;
      if (history == null) {
        history = 'full';
      }
      if (typeof name === 'number') {
        if (!(sub = this.subscribers[name])) {
          return;
        }
        sub.active = true;
        topic = sub.topic;
        publish = forwards || publish;
      } else {
        if (!(topic = this.topics[name])) {
          topic = this.topics[name] = new Topic(name);
        } else if (!forwards || typeof forwards !== 'function') {
          topic.active = true;
          return;
        }
        sub = new Sub(topic, forwards, backwards, context);
        this.subscribers[sub.id] = sub;
        topic.subscribers.push(sub);
      }
      if (history && topic.history.length) {
        switch (history) {
          case 'full':
            _ref = topic.history;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              pub = _ref[_i];
              if (pub.id > this.last.id) {
                break;
              }
              if (sub.last && sub.last.id >= pub.id) {
                continue;
              }
              sub.forwards.apply(sub.context, pub.args);
            }
            break;
          case 'tip':
            pub = topic.history.last();
            if (pub.id > this.last.id) {
              return;
            }
            if (sub.last && sub.last.id >= pub.id) {
              return;
            }
            sub.forwards.apply(sub.context, pub.args);
        }
        sub.last = pub;
      }
      return sub.id;
    },
    unsubscribe: function(name, hard) {
      var len, sub, subscribers, topic, _i, _len, _ref, _results;
      if (hard == null) {
        hard = false;
      }
      if (typeof name === 'number') {
        sub = this.subscribers[name];
        if (hard) {
          delete this.subscribers[name];
          subscribers = sub.topic.subscribers;
          len = subscribers.length;
          _results = [];
          while (len--) {
            _results.push(sub.id === subscribers[len].id ? subscribers.splice(len, 1) : void 0);
          }
          return _results;
        } else {
          return sub.active = false;
        }
      } else {
        if ((topic = this.topics[name])) {
          if (hard) {
            _ref = this.topics[name].subscribers;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              sub = _ref[_i];
              delete this.subscribers[sub.id];
            }
            return delete this.topics[name];
          } else {
            return topic.active = false;
          }
        }
      }
    },
    publish: function() {
      var args, name, pub, sub, topic, _i, _len, _ref;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!(topic = this.topics[name])) {
        topic = this.topics[name] = new Topic(name);
      } else if (!topic.active) {
        return;
      }
      pub = null;
      if (!this.locked) {
        this._flushRedo();
        pub = this._recordPub(topic, args);
      }
      if (topic.subscribers.length) {
        _ref = topic.subscribers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          if (!sub.active) {
            continue;
          }
          this._transaction(sub, pub, args.slice(0));
        }
      }
      return pub && pub.id;
    },
    undo: function() {
      var pub;
      if ((pub = this.undoStack.pop())) {
        this.redoStack.push(pub);
        if (!pub.topic.active) {
          return this.undo();
        } else {
          return this._backwards(pub);
        }
      }
    },
    redo: function() {
      var pub;
      if ((pub = this.redoStack.pop())) {
        this.undoStack.push(pub);
        if (!pub.topic.active) {
          return this.redo();
        } else {
          return this._forwards(pub);
        }
      }
    },
    _transaction: function(sub, pub, args) {
      if (!this.locked) {
        this.locked = true;
        try {
          sub.forwards.apply(sub.context, args);
          return sub.last = pub;
        } finally {
          this.locked = false;
        }
      } else {
        try {
          return sub.forwards.apply(sub.context, args);
        } catch (_e) {}
      }
    },
    _forwards: function(pub) {
      var sub, topic, _i, _len, _ref;
      topic = pub.topic;
      if (topic.subscribers.length) {
        _ref = topic.subscribers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          if (!sub.active) {
            continue;
          }
          try {
            sub.forwards.apply(sub.context, pub.args.slice(0));
          } finally {
            sub.last = pub;
          }
        }
      }
      return this.last = pub;
    },
    _backwards: function(pub) {
      var sub, topic, _i, _len, _ref;
      topic = pub.topic;
      if (topic.subscribers.length) {
        _ref = topic.subscribers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          if (!sub.active) {
            continue;
          }
          try {
            if (!sub.backwards) {
              if (pub.prev) {
                sub.forwards.apply(sub.context, pub.prev.args.slice(0));
              } else {
                sub.forwards.apply(sub.context);
              }
            } else {
              sub.backwards.apply(sub.context, pub.args.slice(0));
            }
          } finally {
            sub.last = pub;
          }
        }
      }
      return this.last = pub;
    },
    _flushRedo: function() {
      var pub, _, _i, _len, _ref, _results;
      _ref = this.redoStack;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ = _ref[_i];
        pub = this.redoStack.shift();
        pub.topic.history.pop();
        _results.push(delete this.publications[pub.id]);
      }
      return _results;
    },
    _recordPub: function(topic, args) {
      var pub;
      pub = new Pub(topic, args, topic.history.last());
      this.publications[pub.id] = pub;
      topic.history.push(pub);
      this.undoStack.push(pub);
      return this.last = pub;
    }
  };
  PubSub.fn.init.prototype = PubSub.fn;
  return window.PubSub = PubSub;
})(window);
