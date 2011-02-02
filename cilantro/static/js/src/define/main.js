require(
    // required modules
    [

        'define/models/main',
        'define/views/main',
        'define/events',
//        'define/search',
//        'define/criteriamanager',
        'utils/html5fix',
        'utils/ajaxsetup',
        'utils/extensions',
        'utils/sanitizer',
        'lib/jquery.bubbleproxy'

    ],
    
    function(models, views, Events, CategoryCollection, CriterionCollection, search, criteriamanager) {
   
        $(function() {

            var AppView = Backbone.View.extend({

                initialize: function() {

                    // initialize collections and models up front
                    var criterion_collection = new models.CriterionCollection;
                    var category_collection = new models.CategoryCollection;

                    // initialize views and set the associated collection and
                    // models
                    new views.CriterionCollectionView({
                        collection: criterion_collection
                    });

                    new views.CategoryCollectionView({
                        collection: category_collection
                    });

                    new views.SearchView({
                        collection: criterion_collection
                    });

                }

            });

            new AppView;

//            var config = {};
//
//            config[Events.ACTIVATE_CATEGORY] = {
//                listeners: ['#criteria', '#categories']
//            };
//
//            config[Events.ACTIVATE_CRITERION] = {
//                listeners: ['#criteria']
//            };
//
//            config[Events.SYNC_CATEGORY] = {
//                listeners: ['#categories']
//            };
//
//            config[Events.ACTIVATE_DESCRIPTION] = {
//                listeners: ['#description']
//            };
//
//            config[Events.DEACTIVATE_DESCRIPTION] = {
//                listeners: ['#description']
//            };
//
//            config['ConceptAddedEvent ConceptDeletedEvent'] = {
//                listeners: ['#plugin-panel']
//            };
//
//            config['UpdateQueryEvent'] = {
//                listeners: ['#user-criteria']
//            };
//
            var body = $('body');
//            
//            body.bubbleproxy(config);
//         
            body.ajaxComplete(function() {
                OVERLAY.fadeOut();
            });

        });
    }
);
