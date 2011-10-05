define(
    function() {
        var tmpl = _.template('<div class="condition clearfix"><a href="#" class="remove"></a><%= condition %></div>'); 
        var criteriaList = $('#condition-list');

        criteriaList.bind('activate-criterion', function(evt, id) {
            //criteriaList.children().removeClass('selected').filter('[data-id='+id+']').addClass('selected');
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
                element.trigger('activate-criterion',
                    [criteria_constraint.concept_id]);
                return false;
            }); 

            return element;
        };

        return {Criteria:Criteria};
    }
);
