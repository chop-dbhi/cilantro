define('define/views/criterion', ['define/views/base'],

    function(base) {

        var template = _.template([
            '<span class="name"><%= name %></span>',
            '<span class="description"><%= description %></span>'
        ].join(''));

        /*
         * Class: CriterionView
         *
         * Adds UI components to handle the additional property 'visible'
         * on the CriterionModel.
         */
        var CriterionView = base.ActiveStateView.extend({

            tagName: 'div',

            template: template,

            initialize: function() {

                this.model.bind('change:visible',
                    _.bind(this.toggleVisibleState, this));

                base.ActiveStateView.prototype.initialize.call(this);

            },

            render: function() {

                base.ActiveStateView.prototype.render.call(this);

                return this;

            },

            /*
             * Method: toggleVisibleState
             *
             * Toggles the visibility of this view in the DOM.
             */
            toggleVisibleState: function() {

                this.model.get('visible') ? this.jq.show() : this.jq.hide();

            }

        });


        /*
         * Class: CriterionCollectionView
         *
         * Encapsulates all criterion views.
         */
        var CriterionCollectionView = base.SingleActiveStateCollectionView.extend({

            jq: $('#criteria'),

            modelView: CriterionView

        });

        return {
            CriterionCollectionView: CriterionCollectionView
        };

    }
);
