define(['cilantro/define/criteria'],
    function(criteria) {

        var template = '<button id="submit-query">Get Report</button>'; 
                                                                               
        var $panel = $('#condition-list-pane'); 

        var criteria_cache = {};
        
        var $criteria_div = $panel.find("#condition-list"),
            $run_query_div = $panel.find(".content"),
            $remove_criteria = $panel.find("#clear-conditions");
        
        var criteria_api_uri = App.urls.session.scope;
        var report_url = App.urls.report;
        var session_api_uri = App.urls.session.scope;
        
        $criteria_div.append('<div class="message warning">You have not defined any conditions</div>');
        var $no_criteria_defined;
        
        // Create the run query button
        var $run_query = $(template);
        


        // Setup click event handlers
        // run the query
        $run_query.click(function(){
                window.location = App.urls.report;
        });
        
        // Hook into the remove all criteria link
        $remove_criteria.click(function(){
           for (var key in criteria_cache){
               if (criteria_cache.hasOwnProperty(key)){
                   App.hub.publish("CriteriaRemovedEvent", criteria_cache[key]);
               }
           } 
        });
        
        // Listen for new criteria as it is added
        App.hub.subscribe("UpdateQueryEvent", function(criteria_constraint, english){
            var pk = criteria_constraint.concept_id;
            var new_criteria;
            // If this is the first criteria to be added remove 
            // content indicating no criteria is defined, and add 
            // "run query button"
            if ($.isEmptyObject(criteria_cache)){
                $no_criteria_defined = $criteria_div.children().detach();
                $run_query_div.append($run_query);
            }

            // Until this is validated by the server and we receive the english version of it
            // disable the query.
            $run_query.attr("disabled","true");

            // PATCH
            if (!english){
                $.ajax({
                     url:criteria_api_uri,
                     type:"PATCH",
                     data:criteria_cache.hasOwnProperty(pk)?JSON.stringify({replace:criteria_constraint}):JSON.stringify({add:criteria_constraint}),
                     contentType:"application/json",
                     success: function(english){
                        $run_query.removeAttr("disabled");
                        var was_empty = $.isEmptyObject(criteria_cache);
                        // Is this an update?
                        if (criteria_cache.hasOwnProperty(pk)){
                            new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english);
                            criteria_cache[pk].replaceWith(new_criteria);
                            new_criteria.fadeTo(300, 0.5, function() {
                                  new_criteria.fadeTo("fast", 1);
                            });
                        }else{
                            new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english);
                            $criteria_div.append(new_criteria);
                            App.hub.publish("ConceptAddedEvent", pk); 
                        }
                        criteria_cache[pk] =  new_criteria;
                        new_criteria.addClass("selected");
                        new_criteria.siblings().removeClass("selected");
                        // If the cache used to be empty, show this one in the console.
                        if (was_empty){
                           $($criteria_div.children()[0]).find(".field-anchor").click();
                        }
                   }
                });
            }else{
               // This is temporary just to get the interface working until further refactoring can be done
               new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english);
               $criteria_div.append(new_criteria);
               App.hub.publish("ConceptAddedEvent", pk); 
               criteria_cache[pk] =  new_criteria;
               $run_query.removeAttr("disabled");
            }
        });

        // Listen for removed criteria
        App.hub.subscribe("CriteriaRemovedEvent", function($target){
            var constraint = $target.data("constraint");
            criteria_cache[constraint.concept_id].remove();
            delete criteria_cache[constraint.concept_id];
            
            // Delete from the session
            $.ajax({
                url:criteria_api_uri,
                type:"PATCH",
                data: JSON.stringify({remove:constraint}), 
                contentType: "application/json"
            });
            
            App.hub.publish("ConceptDeletedEvent", constraint.concept_id);
            
            // If this is the last criteria, remove "run query" button
            // and add back "No Criteria" indicator
            if ($.isEmptyObject(criteria_cache)){
                $criteria_div.append($no_criteria_defined);
                $run_query.detach();
            }
        });
        
        // Listen to see if the user clicks on any of the criteria.
        // Highlight the selected criteria to make it clear which one is
        // displayed
        App.hub.subscribe("concept/active", function (model){
             // If the user clicked on the left-hand side, but we have this criteria
             // defined, highlight it.
             criteria_cache[model.id] && criteria_cache[model.id].siblings().removeClass("selected");
             criteria_cache[model.id] && criteria_cache[model.id].addClass("selected");
        });

        // Load any criteria on the session
        $.getJSON(session_api_uri, function(data){
              var conditions = {};
              if ((data.store === null) || $.isEmptyObject(data.store)){
                  return;
              }

              $.each(data.conditions, function(){
                   conditions[this.concept_id]=this;
              });

              if (!data.store.hasOwnProperty("concept_id")){ // Root node representing a list of concepts won't have this attribute
                  $.each(data.store.children, function(index, criteria_constraint){
                      App.hub.publish("UpdateQueryEvent", criteria_constraint, conditions[criteria_constraint.concept_id]);
                  });
              }else{
                  App.hub.publish("UpdateQueryEvent", data.store, data.conditions[0]);
              }       
              // Show the last condition
              $criteria_div.children().last().click();
        });

        return {
            retrieveCriteriaDS: function(concept_id) {
                var ds = null;
                concept_id && $.each($criteria_div.children(), function(index,element){
                    if (!$(element).data("constraint")){
                        return; // could just be text nodes
                    }
                    if ($(element).data("constraint").concept_id == concept_id){ // TODO cast to string for both
                        ds = $(element).data("constraint");
                    }
                });
                return ds;
            }
        };
        
    }
);
