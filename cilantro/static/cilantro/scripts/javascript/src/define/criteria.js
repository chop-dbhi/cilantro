define(['jquery', 'underscore', 'cilantro/define/conceptmanager'],
    function($, _, ConceptManager) {
        var tmpl = _.template('<div class="condition clearfix"><a href="#" class="remove"></a><%= condition %></div>');
        var criteriaList = $('#condition-list');

        criteriaList.bind('activate-criterion', function(evt, id,element) {
            criteriaList.children().removeClass('selected');
            element.addClass("selected");
            $.get(App.endpoints.criteria+id, function(data){
                ConceptManager.show(data.viewset,element.data("constraint"));
            });
        });

        var Criteria = function(criteria_constraint, uri, server_resp){
            var element =  $(tmpl(server_resp));
            element.data("constraint", criteria_constraint);
            element.find(".remove").click(function(){
                App.hub.publish("CriteriaRemovedEvent", element);
                return false;
            });
            // Display the concept in the main area when the user clicks on the description
            element.click(function (evt) {
                App.hub.publish('concept/request', criteria_constraint.concept_id);
                element.trigger('activate-criterion',
                    [criteria_constraint.concept_id,element]);

                return false;
            });

            return element;
        };

        return {Criteria:Criteria};
    }
);
