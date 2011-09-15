var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
define(['common/models/state', 'common/views/state', 'common/views/collection'], function(statemodel, stateview, collectionview) {
  var Condition, ConditionCollection, ConditionListPane, ConditionListView, ConditionView;
  Condition = (function() {
    __extends(Condition, statemodel.Model);
    function Condition() {
      Condition.__super__.constructor.apply(this, arguments);
    }
    return Condition;
  })();
  ConditionCollection = (function() {
    __extends(ConditionCollection, Backbone.Collection);
    function ConditionCollection() {
      ConditionCollection.__super__.constructor.apply(this, arguments);
    }
    ConditionCollection.prototype.model = Condition;
    ConditionCollection.prototype.url = App.urls.session.scope;
    ConditionCollection.prototype.parse = function(json) {
      return json.conditions;
    };
    return ConditionCollection;
  })();
  ConditionView = (function() {
    __extends(ConditionView, Backbone.View);
    function ConditionView() {
      ConditionView.__super__.constructor.apply(this, arguments);
    }
    ConditionView.prototype.events = {
      'click': 'click',
      'click .remove': 'remove'
    };
    ConditionView.prototype.template = _.template('<div class="condition clearfix">\
                    <a href="#" class="remove"></a>\
                    <%= condition %>\
                </div>');
    ConditionView.prototype.render = function() {
      this.el.remove();
      this.el = $(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    };
    ConditionView.prototype.click = function() {
      this.model.activate();
      return false;
    };
    ConditionView.prototype.remove = function() {
      this.model.remove();
      return false;
    };
    return ConditionView;
  })();
  ConditionListPane = (function() {
    __extends(ConditionListPane, Backbone.View);
    function ConditionListPane() {
      ConditionListPane.__super__.constructor.apply(this, arguments);
    }
    ConditionListPane.prototype.el = '#condition-list-pane';
    ConditionListPane.prototype.events = {
      'click #clear-conditions': 'click'
    };
    ConditionListPane.prototype.initialize = function(options) {
      return this.list = options.list;
    };
    ConditionListPane.prototype.click = function() {
      return this.list.collection.remove(this.list.collection.models);
    };
    return ConditionListPane;
  })();
  ConditionListView = (function() {
    __extends(ConditionListView, collectionview.View);
    function ConditionListView() {
      ConditionListView.__super__.constructor.apply(this, arguments);
    }
    ConditionListView.prototype.el = '#condition-list';
    ConditionListView.prototype.viewClass = ConditionView;
    ConditionListView.prototype.defaultContent = '<div class="message warning">You have not defined any conditions</div>';
    return ConditionListView;
  })();
  return {
    Collection: ConditionCollection,
    ListView: ConditionListView,
    ListPane: ConditionListPane
  };
});
/*
    define(
        function() {

            var tmpl = $.jqotec([
                '<div data-uri="<%=this.uri%>" data-id="<%= this.pk %>" class="criterion clearfix">',
                    '<a href="#" class="remove-criterion"></a>',
                    '<a href="#" class="field-anchor">',
                        '<%= this.description %>',
                    '</a>',
                '</div>'
            ].join(''));

            var criteriaList = $('#criteria-list');

            criteriaList.bind('activate-criterion', function(evt, id) {
                criteriaList.children().removeClass('selected').filter('[data-id='+id+']').addClass('selected');
            });
            
            var Criteria = function(criteria_constraint, uri, english){
                
                var element = $($.jqote(tmpl, {pk:criteria_constraint.concept_id,
                                               description:english,
                                               uri:uri+criteria_constraint.concept_id}));
                element.data("constraint", criteria_constraint);
                
                element.find(".remove-criterion").click(function(){
                    element.trigger("CriteriaRemovedEvent");
                    return false;
                });
                

                // Display the concept in the main area when the user clicks on the description
                element.click(function (evt) { 
                    element.trigger('activate-criterion',
                        [criteria_constraint.concept_id]);
                    return false;
                }); 

                return element;
            };

            return {Criteria:Criteria};
        }
    );
*/