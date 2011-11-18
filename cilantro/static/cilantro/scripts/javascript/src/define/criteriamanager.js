define(['jquery', 'cilantro/define/criteria'], function($, criteria) {

    var conditionCache = {};

    var conditionList = $("#condition-list"),
        clearConditions = $("#clear-conditions");

    var scopeEndpoint = App.endpoints.session.scope;

    var noConditionsMessage = $('#no-conditions'),
        getReportButton = $('#get-report');

    // Setup click event handlers get the report
    getReportButton.click(function() {
        window.location = App.endpoints.report;
    });

    // Clear all conditions
    clearConditions.click(function() {
       for (var key in conditionCache){
           if (conditionCache.hasOwnProperty(key)) {
               App.hub.publish("CriteriaRemovedEvent", conditionCache[key]);
           }
       }
    });

    // Listen for new criteria as it is added
    App.hub.subscribe("UpdateQueryEvent", function(criteria_constraint, english) {
        var pk = criteria_constraint.concept_id;
        var new_criteria;
        // If this is the first criteria to be added remove
        // content indicating no criteria is defined, and add
        // "run query button"
        if ($.isEmptyObject(conditionCache)){
            noConditionsMessage.hide();
            getReportButton.fadeIn();
        }

        // Until this is validated by the server and we receive the english version of it
        // disable the query.
        getReportButton.attr("disabled", true);

        // PATCH
        if (!english){
            var data = {}, operation = conditionCache.hasOwnProperty(pk) ? 'replace' : 'add';

            data[operation] = criteria_constraint;

            $.patchJSON(scopeEndpoint, JSON.stringify(data), function(english) {
                getReportButton.removeAttr("disabled");
                var was_empty = $.isEmptyObject(conditionCache);
                // Is this an update?
                if (operation === 'replace'){
                    new_criteria = criteria.Criteria(criteria_constraint, scopeEndpoint, english);
                    conditionCache[pk].replaceWith(new_criteria);
                    new_criteria.fadeTo(300, 0.5, function() {
                          new_criteria.fadeTo("fast", 1);
                    });
                } else {
                    new_criteria = criteria.Criteria(criteria_constraint, scopeEndpoint, english);
                    conditionList.append(new_criteria);
                    App.hub.publish("ConceptAddedEvent", pk);
                }
                conditionCache[pk] =  new_criteria;
                new_criteria.addClass("selected");
                new_criteria.siblings().removeClass("selected");

                // If the cache used to be empty, show this one in the console.
                if (was_empty){
                   $(conditionList.children()[0]).find(".field-anchor").click();
                }
           });

        } else{
           // This is temporary just to get the interface working until further refactoring can be done
           new_criteria = criteria.Criteria(criteria_constraint, scopeEndpoint, english);
           conditionList.append(new_criteria);
           App.hub.publish("ConceptAddedEvent", pk);
           conditionCache[pk] =  new_criteria;
           getReportButton.removeAttr("disabled");
        }

        App.hub.publish('concept/request', pk);
    });

    // Listen for removed criteria
    App.hub.subscribe("CriteriaRemovedEvent", function($target, revert){
        var constraint = $target.data("constraint");
        conditionCache[constraint.concept_id].remove();
        delete conditionCache[constraint.concept_id];

        if (!revert) {
            getReportButton.attr("disabled", true);

            $.patchJSON(scopeEndpoint, JSON.stringify({remove: constraint}), function() {
                getReportButton.removeAttr("disabled");
            });
        }

        App.hub.publish("ConceptDeletedEvent", constraint.concept_id);

        // If this is the last criteria, remove "run query" button
        // and add back "No Criteria" indicator
        if ($.isEmptyObject(conditionCache)){
            noConditionsMessage.fadeIn();
            getReportButton.hide();
        }
    });

    // Listen to see if the user clicks on any of the criteria.
    // Highlight the selected criteria to make it clear which one is
    // displayed
    App.hub.subscribe("concept/active", function (model){
         // If the user clicked on the left-hand side, but we have this criteria
         // defined, highlight it.
         conditionCache[model.id] && conditionCache[model.id].siblings().removeClass("selected");
         conditionCache[model.id] && conditionCache[model.id].addClass("selected");
    });


    function getSession(data){
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
          conditionList.children().last().click();
    }

    // Load any criteria on the session
    $.getJSON(scopeEndpoint, getSession);

    App.hub.subscribe("report/revert", function(){
         for (var key in conditionCache){
             if (conditionCache.hasOwnProperty(key)){
                 App.hub.publish("CriteriaRemovedEvent", conditionCache[key], true);
             }
         }
         // reload any criteria on the session
         $.getJSON(scopeEndpoint, getSession);
    });

    return {
        retrieveCriteriaDS: function(concept_id) {
            var ds = null;
            concept_id && $.each(conditionList.children(), function(index,element){
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

});
