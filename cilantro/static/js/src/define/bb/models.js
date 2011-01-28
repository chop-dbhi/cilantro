define('define/bb/models',

    ['lib/backbone'],

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

            },

            initialize: function() {

                this.queue = new Queue;

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

                this.queue = new Queue;

                this.bind('refresh', _.bind(this.queue.flush, this.queue));

            },

            /*
             * Method: updateActiveState
             *
             * Resets all models to an inactive state expect for the passed
             * in model id.
             */
            updateActiveState: function(id) {

                this.each(function(o) {

                    o.set({ active: (o.id === id) });

                });

            }    

        });


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
             * the associated criterion object is toggled as well.
             */
            toggleCriterionActiveState: function(model, isActive) {

                var criterion = this.get('criterion');

                // nothing to do
                if (!criterion) return;
                
                // set active status relative to category
                criterion.set({ active: isActive });

            },

            filterCriteria: function(model, isActive) {

                if (!isActive) return;

                CriterionCollection.queue.add(CriterionCollection.filterByCategory, this.id);
            }

        });

        var CategoryCollection = SingleActiveStateCollection.extend({

            url: window.__api__.categories,

            model: CategoryModel

        });

        var CriterionModel = ActiveStateModel.extend({

            defaults: {

                visible: true

            },


            initialize: function() {

                //this.bind('change:active', this.setCategoryActiveState);

                ActiveStateModel.prototype.initialize.call(this);

            },

            setCategoryActiveState: function() {

                if (!this.get('active'))
                    return;

                var id = this.get('category').id;

                CategoryCollection.updateActiveState(id);

                var criterion = this;
                CategoryCollection.queue.add(_.bind(function() {
                    this.get(id).set({criterion: criterion});
                }, CategoryCollection));

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


