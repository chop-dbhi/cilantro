/*
    The storage area for shared state between models and collections. KVO
    can be setup to watch for changes to this object. Each observer should
    force their "onstatechange" behaviors on initialization to ensure they
    "catch up" reflecting the correct application state.
    */var controller;
controller = new Backbone.Model({
  _domain: null,
  domain: null,
  subdomain: null,
  concept: null
});