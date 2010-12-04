/*
 * The criterion objects provide the necessary data to render the interface
 * for interaction by the user. Thus, by definition, everything roughly
 * depends on which  criterion is currently active
 *
 * On Load:
 * - request all criterion objects, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the criterion has changed
 *
 * All events are in the 'criterion' namespace.
 */

define(
    
    'define/criteria',
     
    function() {

        $(function() {
                        
        });

        var tmpl = $.jqotec([
            '<div data-uri="<%=this.uri%>" data-id="<%= this.pk %>" class="criterion clearfix">',
                '<a href="#" class="remove-criterion"></a>',
                '<a href="#" class="field-anchor">',
                    '<%= this.description %>',
                '</a>',
            '</div>'
        ].join(''));
        
        var Criteria = function(criteria_constraint, uri,english){
            
            var element = $($.jqote(tmpl, {pk:criteria_constraint.concept_id,
                                           description:english,
                                           uri:uri+criteria_constraint.concept_id}));
            element.data("constraint", criteria_constraint);
            
            element.find(".remove-criterion").click(function(){
                element.trigger("CriteriaRemovedEvent");
            });
            
            function showCriteria(){
                var evt = $.Event("ShowConceptEvent");
                evt.constraints = element.data("constraint");
                element.trigger(evt);
            }
            // Display the concept in the main area when the user clicks on the description
            element.find(".field-anchor").click(showCriteria);
            
            return element;
        };

        return {Criteria:Criteria};
    }
);
