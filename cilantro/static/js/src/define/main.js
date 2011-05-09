define(
    // required modules
    [
        'cilantro/define/events',
        'cilantro/lib/jquery.bubbleproxy'
    ],
    
    function(Events, CategoryCollection, CriterionCollection, search, criteriamanager) {
   
        $(function() {

            var config = {};

            config[Events.ACTIVATE_CATEGORY] = {
                listeners: ['#criteria', '#categories']
            };

            config[Events.ACTIVATE_CRITERION] = {
                listeners: ['#criteria', '#criteria-list']
            };

            config[Events.SYNC_CATEGORY] = {
                listeners: ['#categories']
            };

            config[Events.ACTIVATE_DESCRIPTION] = {
                listeners: ['#description']
            };

            config[Events.DEACTIVATE_DESCRIPTION] = {
                listeners: ['#description']
            };

            config['ConceptAddedEvent ConceptDeletedEvent'] = {
                listeners: ['#plugin-panel']
            };

            config['UpdateQueryEvent'] = {
                listeners: ['#user-criteria']
            };

            $('body').bubbleproxy(config);
            
            // load page elements, these all in some way depend on the DOM
            // being ready
            require([
                'cilantro/define/categories',
                'cilantro/define/criteria2',
                'cilantro/define/search',
                'cilantro/define/criteriamanager'
            ]);
        
        });
    }
);
