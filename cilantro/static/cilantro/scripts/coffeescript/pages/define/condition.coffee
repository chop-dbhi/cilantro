define [
        'common/models/state'
        'common/views/state'
        'common/views/collection'
    ],

    (statemodel, stateview, collectionview) ->

        class Condition extends statemodel.Model


        class ConditionCollection extends Backbone.Collection
            model: Condition

            url: App.endpoints.session.scope

            parse: (json) -> json.conditions


        class ConditionView extends Backbone.View
            events:
                'click': 'click'
                'click .remove': 'remove'

            template: _.template '<div class="criterion clearfix">
                    <a href="#" class="remove-criterion"></a>
                    <a href="#" class="field-anchor">
                    <%= condition %>
                    </a>
                </div>'

            render: ->
                @el.remove()
                @el = $(@template @model.toJSON())
                @delegateEvents()
                @

            click: ->
                @model.activate()
                return false

            remove: ->
                @model.remove()
                return false


        class ConditionListPane extends Backbone.View
            el: '#condition-list-pane'

            events:
                'click #clear-conditions': 'click'

            initialize: (options) ->
                @list = options.list

            click: ->
                @list.collection.remove(@list.collection.models)

        class ConditionListView extends collectionview.View
            el: '#condition-list'

            viewClass: ConditionView

            #defaultContent: '<div class="message warning">You have not defined any conditions</div>'


        return {
            Collection: ConditionCollection
            ListView: ConditionListView
            ListPane: ConditionListPane
        }


###
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
###
