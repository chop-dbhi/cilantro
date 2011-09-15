var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/views/state', 'cilantro/utils/search'], function(stateview, Search) {
  var InputView, ResultCollection, ResultItemView, ResultListView;
  ResultCollection = (function() {
    __extends(ResultCollection, Search.ResultCollection);
    function ResultCollection() {
      ResultCollection.__super__.constructor.apply(this, arguments);
    }
    ResultCollection.prototype.url = App.urls.criteria;
    return ResultCollection;
  })();
  ResultItemView = (function() {
    __extends(ResultItemView, stateview.View);
    function ResultItemView() {
      ResultItemView.__super__.constructor.apply(this, arguments);
    }
    ResultItemView.prototype.template = _.template('<span class="name"><%= name %></span>\
                <br><span class="info"><%= domain.name %></span>');
    ResultItemView.prototype.events = {
      'click': 'click'
    };
    ResultItemView.prototype.render = function() {
      this.el.html(this.template(this.model.toJSON()));
      return this;
    };
    ResultItemView.prototype.click = function() {
      App.hub.publish('concept/request', this.model.id);
      return false;
    };
    return ResultItemView;
  })();
  InputView = (function() {
    __extends(InputView, Search.InputView);
    function InputView() {
      InputView.__super__.constructor.apply(this, arguments);
    }
    InputView.prototype.el = '#concept-search';
    return InputView;
  })();
  ResultListView = (function() {
    __extends(ResultListView, Search.ResultListView);
    function ResultListView() {
      ResultListView.__super__.constructor.apply(this, arguments);
    }
    ResultListView.prototype.el = '#concept-search-results';
    ResultListView.prototype.viewClass = ResultItemView;
    ResultListView.prototype.inputViewClass = InputView;
    return ResultListView;
  })();
  return {
    ResultCollection: ResultCollection,
    ResultListView: ResultListView
  };
});