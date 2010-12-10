require(
    // required modules
    [
        'define/categories',
        'define/criteria2',
        'define/search',
        'define/conceptmanager',
        'define/criteriamanager',
        'utils/html5fix',
        'utils/ajaxsetup',
        'utils/extensions',
        'utils/sanitizer',
        'lib/jquery.jqote2',
        'lib/jquery.bubbleproxy'
    ],
    
    function(categories, criteria, search, conceptmanager, criteriamanager) {
   
        $(function() {

            var body = $('body');
            
            body.bubbleproxy({
                'activate-category': {
                    listeners: ['#criteria', '#categories']
                },

                'activate-criterion': {
                    listeners: ['#criteria']
                },

                'sync-category': {
                    listeners: ['#categories']
                }
            });
            
            body.ajaxComplete(function() {
                OVERLAY.fadeOut();
            });

            // The view manager needs to know where in the DOM to place certain things
            var content = $("#content"),
                pluginTabs = $('#plugin-tabs'),
                pluginPanel = $('#plugin-panel'),
                pluginTitle = $('#plugin-title'),
                criteriaPanel = $("#user-criteria"),
                pluginStaticContent = $('#plugin-static-content'),
                pluginDynamicContent = $('#plugin-dynamic-content');

        
            // Create an instance of the conceptManager object. Only do this once.
            var conceptManager = conceptmanager.manager(pluginPanel, pluginTitle, pluginTabs, pluginDynamicContent,
                pluginStaticContent);
        
            var criteriaManager = criteriamanager.Manager(criteriaPanel);
        
            content.bind('UpdateQueryEvent', function(evt, criteria_constraint) {
                criteriaPanel.triggerHandler("UpdateQueryEvent", [criteria_constraint]);
            });
        
            content.bind("ConceptAddedEvent ConceptDeletedEvent", function(evt){
                pluginPanel.trigger(evt);
            });
        
            // There are currently three ways this event can be triggered.
            // 1) Clicking on concept in the left hand-side menu
            //    a)  Slightly differently, a user can click on a concept in the left
            //        hand panel while that concept is already part of a question in the
            //        right-hand query panel, in which case, the data needs to be retrieved
            //        from the query component. 
            // 2) Clicking on a criteria from the query box on the right-hand side
            // 3) Clicking on a tab where a concept has already been opened while on 
            //    another tab. For example, if you were on Audiology Tab, selected ABR 1000,
            //    and then moved to Imaging, and then clicked back on Audiology.
            body.bind('ShowConceptEvent activate-criterion', function(evt, id, conditions) {
                var target = criteria.src.criteria.get()[id];
                // notify the criteria manager so it can remove highlighted concepts if necessary
//                if (!target.is(".criterion"))
//                {
//                    evt.concept_id = target.attr('data-id');
//                    criteriaPanel.triggerHandler(evt);
//                }else {
//                    // deselect any highlighted criteria in the left hand side
//                    criteria.children(".active").removeClass("active");
//                
//                }
//                if (!existing_ds){
//                    // Criteria manager will have constraints if this is already in the right side
//                    // but they clicked on the concept in the left side
//                    existing_ds = criteriaManager.retrieveCriteriaDS(id);
//                }
//
                if (conceptManager.isConceptLoaded(id)){
                    pluginPanel.fadeIn(100);
                    conceptManager.show({id: id}, conditions);
                } else {
                    $.ajax({
                        url: target.data('uri'),
                        dataType:'json',
                        success: function(json) {
                                pluginPanel.fadeIn(100);
                                conceptManager.show(json, conditions);
                        }
                    });
                }
            });
        
        });
    }
);
