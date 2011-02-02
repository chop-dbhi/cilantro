define('define/models/criterion',
    
    ['define/models/base'],
    
    function(base) {

        /*
         * Class: CriterionModel
         *
         * Criteria visibility is dependent on the current category that is
         * selected. Thus, it has a 'visible' property which denotes whether it
         * should be made available. The details of how it is made or not made
         * available in the UI is defined in the corresponding view class.
         */
        var CriterionModel = base.ActiveStateModel.extend({

            path: 'criterion.model',

            defaults: {

                visible: true

            },

            initialize: function() {

                this.bind('change:active', this.setCategoryActiveState);

                base.ActiveStateModel.prototype.initialize.call(this);

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

                clerk.send('category.collection', 'updateActiveState',
                    [category.id]);

            }

        });


        var CriterionCollection = base.SingleActiveStateCollection.extend({

            url: window.api.criterion,

            path: 'criterion.collection',

            model: CriterionModel,

            initialize: function() {

                // when the criterion collection refreshes, each criterion
                // model must get a reference to the category model it is
                // associated with.
                this.bind('refresh', function() {

                    clerk.send('category.collection', function(collection) {

                        var ref = this;
                        collection.each(function(model) {
                            model.set({ category: ref.get(model.get('category').id) });
                        });

                    }, [this]);

                });

                base.SingleActiveStateCollection.prototype.initialize.call(this);

            },

            filterByCategory: function(id) {

                var category;

                this.each(function(model) {

                    category = model.get('category');
                    model.set({ visible: (category.id === id) });

                });

            }

        });


        return {

            CriterionCollection: CriterionCollection

        };

    }
);
