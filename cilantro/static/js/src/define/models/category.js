define('define/models/category',
    
    ['define/models/base'],
    
    function(base) {

        /*
         * Class: CategoryModel
         *
         * Each category instance can hold a reference to the last criterion
         * that was active for this category. If a reference exists, anytime
         * this category becomes active, the criterion also becomes active.
         */
        var CategoryModel = base.ActiveStateModel.extend({

            path: 'category.model',

            defaults: {

                criterion: null
            
            },

            initialize: function() {

                base.ActiveStateModel.prototype.initialize.call(this);

                this.bind('change:active', this.toggleCriterionActiveState);
                this.bind('change:active', this.filterCriteria);

            },


            /*
             * Method: toggleCriterionActiveState
             *
             * This ensures that when this category changes it's active state,
             * the associated criterion object is set to active as well.
             */
            toggleCriterionActiveState: function(model, isActive) {

                var criterion = this.get('criterion');

                // nothing to do
                if (!criterion) return;
                
                // set active status relative to category
                criterion.set({ active: isActive });

            },

            
            /*
             * Method: filterCriteria
             *
             * This ensures that when this category becomes active, it sends a
             * message to the collection of criteria notifying it of this
             * change.
             */
            filterCriteria: function(model, isActive) {

                if (!isActive) return;

                clerk.send('criterion.collection', 'filterByCategory',
                    [this.id]);
            }

        });


        /*
         * Class: CategoryCollection
         *
         * The collection of categories.
         */
        var CategoryCollection = base.SingleActiveStateCollection.extend({

            url: window.api.category,

            path: 'category.collection',

            model: CategoryModel

        });

        return {

            CategoryCollection: CategoryCollection

        };

    }
);
