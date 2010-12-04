require(
    // required modules
    [
        'define/categories',
        'define/search',
        'define/conceptmanager',
        'define/criteriamanager',
        'utils/html5fix',
        'utils/ajaxsetup',
        'utils/extensions',
        'utils/sanitizer'
    ],
    
    function(categories, search, conceptmanager, criteriamanager) {
   
        $(function() {

            var body = $('body');
            
            body.bindproxy({
                'activate.category': {
                    listeners: ['#criteria'],
                }
            });
            
            body.ajaxComplete(function() {
                OVERLAY.fadeOut();
            });

            search.init();

            // The view manager needs to know where in the DOM to place certain things
            var content = $("#content"),
                pluginTabs = $('#plugin-tabs'),
                pluginPanel = $('#plugin-panel'),
                pluginTitle = $('#plugin-title'),
                criteriaPanel = $("#user-criteria"),
                pluginStaticContent = $('#plugin-static-content'),
                pluginDynamicContent = $('#plugin-dynamic-content'),

                criteria = $('#criteria');
        
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
            content.bind("ShowConceptEvent", function(evt){
                var target = $(evt.target);
                var concept_id = target.attr('data-id');
                var existing_ds = evt.constraints; // if they clicked on the right side
                // notify the criteria manager so it can remove highlighted concepts if necessary
                if (!$(evt.target).is(".criterion"))
                {
                    evt.concept_id = target.attr('data-id');
                    criteriaPanel.triggerHandler(evt);
                }else {
                    // deselect any highlighted criteria in the left hand side
                    criteria.children(".active").removeClass("active");
                
                }
                if (!existing_ds){
                    // Criteria manager will have constraints if this is already in the right side
                    // but they clicked on the concept in the left side
                    existing_ds = criteriaManager.retrieveCriteriaDS(concept_id);
                }

                if (conceptManager.isConceptLoaded(concept_id)){
                    pluginPanel.fadeIn(100);
                    conceptManager.show({id: concept_id}, existing_ds);
                }else{
                    $.ajax({
                        url: target.attr('data-uri'),
                        dataType:'json',
                        success: function(json) {
                                pluginPanel.fadeIn(100);
                                conceptManager.show(json, existing_ds);
                        }
                    });
                }    
            });
        
            content.bind('activate-criterion', function(evt, id) {
                var target;

                if (!id)
                    target = $(evt.target);
                else
                    target = criteria.children('[data-id=' + id + ']');

                id = id || target.attr('data-id');

                // remove active state for all siblings
                target.addClass('active').siblings().removeClass('active');

                target.trigger('ShowConceptEvent');
                // bind this concept's id to the current active tab
                content.trigger('setid-tab', [id]);

                return false;
            });
 
            $('[data-model=criterion]').live('click', function(evt) {
                $(this).trigger('activate-criterion');
                return false;
            });

            var descriptionBox = $('<div id="description"></div>')
                .appendTo('body');

            criteria.delegate('div > .info', 'mouseover', function() {
                var target = $(this).parent(),
                    offset = target.offset(),
                    width = target.outerWidth(),
                    description = target.children('.description').html();

                descriptionBox.html(description);
                descriptionBox.css({
                    left: offset.left + width + 20,
                    top: offset.top
                }).show();
            }).delegate('div > .info', 'mouseout', function() {
                descriptionBox.hide();
            });

        });
    }
);
