define(['cilantro/define/criteria'], function(criteria) {
  /*
          class 
      
          template = '<button id="submit-query">Get Report</button>'
          
          $panel = $('#user-criteria')
  
          criteria_cache = {}
          
          $criteria_div = $panel.find("#criteria-list"),
              $run_query_div = $panel.find(".content"),
              $remove_criteria = $panel.find("#remove-criteria")
          
          criteria_api_uri = App.urls.criteria
          report_url = App.urls.report
          session_api_uri = App.urls.session.scope
          
          
          # Grab the contents of panel while it is empty and save off the 
          # "No Criteria" indicator text
          $no_criteria_defined = $criteria_div.children()
          
          # Create the run query button
          $run_query = $(template)
          
          # Load any criteria on the session
          $.getJSON(session_api_uri, function(data){
                if ((data.store === null) || $.isEmptyObject(data.store)){
                    return
                }
                if (!data.store.hasOwnProperty("concept_id")){ # Root node representing a list of concepts won't have this attribute
                    $.each(data.store.children.reverse(), function(index, criteria_constraint){
                        $panel.triggerHandler("UpdateQueryEvent", [criteria_constraint, true])
                    })
                }else{
                    $panel.triggerHandler("UpdateQueryEvent", [data.store, true])
                    console.log(data.store)
                }
          })
  
          # Setup click even handlers
          # run the query
          $run_query.click(function(){
              all_constraints = []
              server_query
              for (key in criteria_cache){
                   if (criteria_cache.hasOwnProperty(key)){
                     all_constraints.push(criteria_cache[key].data("constraint"))
                   }
              }
              
              if (all_constraints.length < 2){
                  server_query = all_constraints[0]
              }else{
                  server_query = {type: "and", children : all_constraints}
              }
              $.putJSON(session_api_uri, JSON.stringify(server_query), function(){
                  window.location=report_url
              })
          })
          
          # Hook into the remove all criteria link
          $remove_criteria.click(function(){
             for (key in criteria_cache){
                 if (criteria_cache.hasOwnProperty(key)){
                     criteria_cache[key].trigger("CriteriaRemovedEvent")
                 }
             } 
          })
          
          # Listen for new criteria as it is added
          $panel.bind("UpdateQueryEvent", function(evt, criteria_constraint, page_is_loading){
              
              pk = criteria_constraint.concept_id
              new_criteria
              # If this is the first criteria to be added remove 
              # content indicating no criteria is defined, and add 
              # "run query button"
              if ($.isEmptyObject(criteria_cache)){
                  $no_criteria_defined.detach()
                  $run_query_div.append($run_query)
              }
  
              # Until this is validated by the server and we receive the english version of it
              # disable the query.
              $run_query.attr("disabled","true")
              $.postJSON(criteria_api_uri, JSON.stringify(criteria_constraint), function(english){
                  $run_query.removeAttr("disabled")
                  was_empty = $.isEmptyObject(criteria_cache)
                  # Is this an update?
                  if (criteria_cache.hasOwnProperty(pk)){
                      new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english)
                      criteria_cache[pk].replaceWith(new_criteria)
                      new_criteria.fadeTo(300, 0.5, function() {
                            new_criteria.fadeTo("fast", 1)
                      })
                  }else{
                      new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english)
                      if (page_is_loading){
                          $criteria_div.prepend(new_criteria)
                      }else{
                           $criteria_div.append(new_criteria)
                      }
                      addEvent = $.Event("ConceptAddedEvent")
                      addEvent.concept_id = pk
                      $panel.trigger(addEvent)
                  }
                  criteria_cache[pk] =  new_criteria
                  if (!page_is_loading){
                      new_criteria.addClass("selected")
                      new_criteria.siblings().removeClass("selected")
                  }
                  
                  # If the cache used to be empty, show this one in the console.
                  if (was_empty){
                     $($criteria_div.children()[0]).find(".field-anchor").click()
                  }
              }, "text")
          })
  
  
          # Listen for removed criteria
          App.hub.subscribe 'CriteriaRemovedEvent', (evt) ->
              $target = $(evt.target)
              constraint = $target.data("constraint")
              criteria_cache[constraint.concept_id].remove()
              delete criteria_cache[constraint.concept_id]
              
              removedEvent = $.Event("ConceptDeletedEvent")
              removedEvent.concept_id = constraint.concept_id
              $panel.trigger(removedEvent)
              
              # If this is the last criteria, remove "run query" button
              # and add back "No Criteria" indicator
              if ($.isEmptyObject(criteria_cache)){
                  $criteria_div.append($no_criteria_defined)
                  $run_query.detach()
              }
          })
  
          return {
              retrieveCriteriaDS: function(concept_id) {
                  ds = null
                  concept_id && $.each($criteria_div.children(), function(index,element){
                      if (!$(element).data("constraint")){
                          return# could just be text nodes
                      }
                      if ($(element).data("constraint").concept_id == concept_id){ # TODO cast to string for both
                          ds = $(element).data("constraint")
                      }
                  })
                  return ds
              }
          }
          
      }
  */
});