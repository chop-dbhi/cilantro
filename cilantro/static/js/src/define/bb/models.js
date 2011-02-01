define('define/bb/models',

    ['lib/backbone', 'lib/clerk'],

    function() {


        /*
         * Class: ActiveStateModel
         *
         * Basic model that receives an additional attribute "active", for
         * keeping track of whether the model is considered "active" at any
         * given time. The utility of being active is dependent on the
         * implementation. This is meant to be used with the
         * SingleActiveStateCollection class.
         */
        var ActiveStateModel = Backbone.Model.extend({ 

            defaults: {

                active: false

            }
       
        });


        /*
         * Class: SingleActiveStateCollection
         *
         * Expected to be used with a model that has an "active" attribute.
         * Manages activating and deactivating the models. Only a single
         * model can be active at any given time.
         */
        var SingleActiveStateCollection = Backbone.Collection.extend({

            model: ActiveStateModel,

            initialize: function() {

                // any messages sent to this collection will not executed
                // until the data has been refreshed
                this.bind('refresh', function() {

                    clerk.receive(this);

                });

            },

            /*
             * Method: updateActiveState
             *
             * Resets all models to an inactive state expect for the model
             * representing the passed in identifier.
             */
            updateActiveState: function(id) {

                this.each(function(o) {

                    o.set({ active: (o.id === id) });

                });

            }

        });


        /*
         * Class: CategoryModel
         *
         * Each category instance can hold a reference to the last criterion
         * that was active for this category. If a reference exists, anytime
         * this category becomes active, the criterion also becomes active.
         */
        var CategoryModel = ActiveStateModel.extend({

            defaults: {

                criterion: null
            
            },

            initialize: function() {

                ActiveStateModel.prototype.initialize.call(this);

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

                clerk.send(CriterionCollection, 'filterByCategory', [this.id]);
            }

        });


        /*
         * Class: CategoryCollection
         *
         * The collection of categories.
         */
        var CategoryCollection = SingleActiveStateCollection.extend({

            url: window.__api__.categories,

            model: CategoryModel

        });


        /*
         * Class: CriterionModel
         *
         * Criteria visibility is dependent on the current category that is
         * selected. Thus, it has a 'visible' property which denotes whether it
         * should be made available. The details of how it is made or not made
         * available in the UI is defined in the corresponding view class.
         */
        var CriterionModel = ActiveStateModel.extend({

            defaults: {

                visible: true

            },

            initialize: function() {

                this.bind('change:active', this.setCategoryActiveState);

                ActiveStateModel.prototype.initialize.call(this);

                clerk.send(CategoryCollection, function(model) {

                    model.set({ category: this.get(model.get('category').id) });

                }, [this]);

            },


            /*
             * Method: setCategoryActiveState
             *
             * When this criterion becomes active, it must tell the category
             * collection to update it's active state (this occurs when this
             * criterion is activated independent of the user, like onload),
             * as well as send a reference of itself to it's category instance.
             */
            setCategoryActiveState: function() {

                if (!this.get('active'))
                    return;

                var category = this.get('category');
                category.set({ criterion: this });

                clerk.send(CategoryCollection, 'updateActiveState',
                    [category.id]);

            }

        });


        var CriterionCollection = SingleActiveStateCollection.extend({

            url: window.__api__.criteria,

            model: CriterionModel,

            initialize: function() {

                _.bindAll(this, 'filterByCategory');

                SingleActiveStateCollection.prototype.initialize.call(this);

            },

            filterByCategory: function(id) {

                var category;

                this.each(function(model) {

                    category = model.get('category');
                    model.set({ visible: (category.id === id) });

                });

            }

        });


        CriterionCollection = new CriterionCollection;
        CategoryCollection = new CategoryCollection;

        // set the newly define models
        var models = {
            CriterionCollection: CriterionCollection,
            CategoryCollection: CategoryCollection
        };

        return models;

    }
);


