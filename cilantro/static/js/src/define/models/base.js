define('define/models/base', ['lib/backbone', 'lib/clerk'],

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

                // takes the base path for this model type an appends the id
                this.path = this.path + '.' + this.id;

                // bind the name and object in clerk for future reference
//                clerk.bind(this.path, this);

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

                clerk.bind(this.path, this);

                // any messages sent to this collection will not executed
                // until the data has been refreshed
                this.bind('refresh', function() {

                    clerk.receive(this.path, this);

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

        return {
            ActiveStateModel: ActiveStateModel,
            SingleActiveStateCollection: SingleActiveStateCollection 
        };

    }
);
