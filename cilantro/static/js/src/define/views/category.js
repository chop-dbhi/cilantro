define('define/views/category', ['define/views/base'],

    function(base) {

        var template = _.template('<div class="icon"></div>' +
            '<span><%= name %></span>');

        /*
         * Class: CategoryView
         *
         * The corresponding view for CategoryModel.
         */
        var CategoryView = base.ActiveStateView.extend({

            tagName: 'span',

            className: 'tag',

            template: template,

            render: function() {

                // dynamic `id' must be set if it does not exist
                if (!this.el.id)
                    this.el.id = 'tab-' + this.model.get('name').toLowerCase();

                return base.ActiveStateView.prototype.render.call(this);
            }    

        });


        /*
         * Class: CategoryCollectionView
         *
         * A bootstrap feature has been added to this class to activate
         * the first category in this collection, so the user has a 
         * starting point.
         */
        var CategoryCollectionView = base.SingleActiveStateCollectionView.extend({

            jq: $('#categories'),

            modelView: CategoryView,

            initialize: function() {

                this.bind('render', this.selectFirst);

                base.SingleActiveStateCollectionView.prototype.initialize.call(this);
            },

            
            /*
             * Method: selectFirst
             *
             * A bootstrap method that tells the collection to update it's
             * 'active' state relative to it's first element.
             */
            selectFirst: function() {

                clerk.send(this.collection, function() {

                    this.updateActiveState(this.at(0).id);

                });

            }

        });

        return {
            CategoryCollectionView: CategoryCollectionView
        };

    }
);
