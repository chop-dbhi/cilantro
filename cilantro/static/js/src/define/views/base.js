define('define/views/base', ['lib/backbone'],
        
    function() {

        /*
         * Class: ActiveStateView
         *
         * The corresponding view for ActiveStateModel. The primary hooks
         * include provide a click event handler for the DOM element. This
         * will set the corresponding model instance to the 'active' state.
         * It also listens for when it's model 'active' state has changed
         * and will make any UI changes to reflect that change.
         */
        var ActiveStateView = Backbone.View.extend({

            events: {

                // behaves like a tabbed interface, thus when the user clicks 
                'click': 'setModelActiveState'

            },

            initialize: function() {

                // when the associated model changes it's "active" state,
                // this needs to be reflected in the UI
                this.model.bind('change:active',
                    _.bind(this.toggleActiveState, this));

                // bind a reference of this view to the model for convenience
                this.model.view = this;

                // once everything above is define, we can finally render
                // this view. note, this step does not necessarily mean the
                // view gets inserted into the DOM.
                this.render();

            },

            render: function() {

                // cache the jQuery object representing this DOM element
                this.jq = this.jq || $(this.el);

                // render the inner html of this view
                this.jq.html(this.template(this.model.toJSON()));

                // custom event to notify when this view has been rendered,
                // though not necessarily added in to the DOM
                this.trigger('render');

                return this;

            },

            /*
             * Method: setModelActiveState
             *
             * Click event handler for this view. This is the interface to
             * the associated model/collection.
             */
            setModelActiveState: function(evt) {

                this.model.collection.updateActiveState(this.model.id);

            },

            /*
             * Method: toggleActiveState
             *
             * Performs any necessary DOM changes when this view becomes
             * active or deactive. This is a model event callback when the
             * associated model changes it's "active" state.
             */
            toggleActiveState: function() {

                if (this.model.get('active'))
                    this.jq.addClass('active');
                else
                    this.jq.removeClass('active');
                
            }

        });


        /*
         * Class: SingleActiveStateCollectionView
         *
         * The role of this class is to manage activating or deactiving 
         * child views. 
         */
        var SingleActiveStateCollectionView = Backbone.View.extend({

            initialize: function() {

                // once the whole collection is refreshed, create the
                // associated views for each model in the collection
                this.collection.bind('refresh', _.bind(this.render, this));

                // fetch the data for this collection now that the above
                // callbacks are defined.
                this.collection.fetch();

            },


            /*
             * Method: render
             *
             * Handles rendering the contents of this collection. It is
             * assumed the DOM element for this collection view is already
             * defined in the DOM. If not, define the render method in a
             * subclass, add the necessary steps to create the DOM element,
             * then call this render method at the end.
             */
            render: function() {

                this.collection.each(_.bind(this.createModelView, this));

                // since this view is composed of other views, this is
                // technically where the 'render' event should be triggered
                this.trigger('render');

                return this;

            },

            /*
             * Method: createModelView
             *
             * Takes a new model instance, creates a corresponding view
             * and aappends it to this collection view.
             */ 
            createModelView: function(model) {

                var view = new this.modelView({
                    model: model
                });

                this.jq.append(view.el);

            }

        });

        return {
            ActiveStateView: ActiveStateView,
            SingleActiveStateCollectionView: SingleActiveStateCollectionView
        };

    }
);
