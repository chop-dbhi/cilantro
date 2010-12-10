define(
    
    'define/criteria',
     
    function() {
        var tmpl = $.jqotec([
            '<div data-uri="<%=this.uri%>" data-id="<%= this.pk %>" class="criterion clearfix">',
                '<a href="#" class="remove-criterion"></a>',
                '<a href="#" class="field-anchor">',
                    '<%= this.description %>',
                '</a>',
            '</div>'
        ].join(''));
        
        var Criteria = function(criteria_constraint, uri, english){
            
            var element = $($.jqote(tmpl, {pk:criteria_constraint.concept_id,
                                           description:english,
                                           uri:uri+criteria_constraint.concept_id}));
            element.data("constraint", criteria_constraint);
            
            element.find(".remove-criterion").click(function(){
                element.trigger("CriteriaRemovedEvent");
            });
            

            // Display the concept in the main area when the user clicks on the description
            element.find(".field-anchor").click(function (evt) { 
                element.trigger('activate-criterion',
                    [criteria_constraint.concept_id, element.data("constraint")]);
            }); 

            return element;
        };

        return {Criteria:Criteria};
    }
);
