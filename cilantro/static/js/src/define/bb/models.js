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
             * Method: changeActiveState
             *
             * Resets all models to an inactive state expect for the passed
             * in model.
             */
            changeActiveState: function(id) {

                // set all to the inactive state
                this.each(function(o) {

                    if (o.id === id)
                        o.set({'active': true});
                    else
                        o.set({'active': false});

                });

            }    

        });

        // 
        var CategoryModel = ActiveStateModel.extend({

            defaults: {

                criterion: null
            
            },

            initialize: function() {

                ActiveStateModel.prototype.initialize.call(this);

                this.bind('change:active', this.toggleCriterionActiveState);
                this.bind('change:active', this.filterCriteria);

            },

            toggleCriterionActiveState: function() {

                var active = this.get('active');
                var criterion = this.get('criterion');

                // nothing to do
                if (!criterion) return;
                
                // set active status relative to category
                criterion.set({'active': active});

            },

            filterCriteria: function() {

                if (!this.get('active'))
                    return;

                // ref to category id
                var id = this.id;

                CriterionCollection.each(function(model) {

                    if (model.get('category').id === id)
                        model.set({'visible': true});
                    else
                        model.set({'visible': false});
                })

            }

        });

        var CategoryCollection = SingleActiveStateCollection.extend({

            url: window.__api__.categories,

            model: CategoryModel

        });

        CategoryCollection = new CategoryCollection;

        var CriterionModel = ActiveStateModel.extend({

            defaults: {

                visible: true

            },


            initialize: function() {

                this.bind('change:active', this.setCategoryActiveState);

                ActiveStateModel.prototype.initialize.call(this);

            },

            setCategoryActiveState: function() {

                if (!this.get('active'))
                    return;

                var id = this.get('category').id;
                CategoryCollection.changeActiveState(id);

                var criterion = this;
                CategoryCollection.queue.add(_.bind(function() {
                    this.get(id).set({criterion: criterion});
                }, CategoryCollection));

            }

        });


        var CriterionCollection = SingleActiveStateCollection.extend({

            url: window.__api__.criteria,

            model: CriterionModel

        });

        CriterionCollection = new CriterionCollection;


        // set the newly define models
        var models = {
            CriterionCollection: CriterionCollection,
            CategoryCollection: CategoryCollection
        };

        return models;

    }
);


