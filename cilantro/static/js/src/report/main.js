define('cilantro/report/main', ['cilantro/main'], function() {
  var App;
  App = window.App;
  if (!App) {
    window.App = App = {};
  }
  return App.hub = new PubSub;
});