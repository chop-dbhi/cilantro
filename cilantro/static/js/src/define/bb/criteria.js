/*
 * The criterion objects provide the necessary data to render the interface
 * for interaction by the user. Thus, by definition, everything roughly
 * depends on which  criterion is currently active
 *
 * On Load:
 * - request all criterion objects, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the criterion has changed
 *
 * All events are in the 'criterion' namespace.
 */

define('define/bb/criteria',

    ['define/events', 'lib/backbone'],

    function(Events) {

        // template for CriterionView
        var template = [
            '<div data-id="<%= id %>">',
                '<div class="icon info"></div>',
                '<span class="name"><%= name %></span>',
                '<span class="description"><%= description %></span>',
            '</div>'
        ].join('');

        var CriterionCollectionView;

        $(function() {

            /*
             * Class: Criterion
             *
             */
            var Criterion = Backbone.Model.extend({ 

                // add the ``active`` so event triggers are automatic
                // on change
                defaults: {

                    active: false

                }
           
            });

            var CriterionCollection = Backbone.Collection.extend({

                model: Criterion,

                url: window.__api__.criteria,

                changeActiveState: function(object) {

                    // set all to the inactive state
                    _.each(this.models, function(e) {
                        e.set({'active': false});
                    });

                    // set the requested object's state
                    object.set({'active': true});

                }    

            });

            var CriterionView = Backbone.View.extend({

                template: _.template(template),

                events: {

                    'click': 'changeActiveState'

                },

                initialize: function() {

                    // this puts these event handlers within the context of
                    // this view, rather than the model which will be the
                    // object invoking the call
                    _.bindAll(this, 'render', 'toggleViewActiveState');

                    this.model.bind('add', this.render);
                    this.model.bind('change:active', this.toggleViewActiveState);
                    this.model.view = this;

                },

                render: function() {

                    this.el = $(this.template(this.model.toJSON()));

                    // rebind events since the element has been redefined
                    this.delegateEvents();

                    return this;

                },

                /*
                 * Performs any necessary DOM changes when this view becomes
                 * active or deactive.
                 */
                toggleViewActiveState: function() {

                    if (this.model.get('active') === true)
                        this.el.addClass('active');
                    else
                        this.el.removeClass('active');
                    
                },

                /*
                 * Click event handler for this view. This calls a method on
                 * the collection to manage activating and deactivating the
                 * respective tabs.
                 */
                changeActiveState: function() {

                    // don't both processing if it is already active
                    if (this.model.get('active') === true)
                        return;
                    
                    this.model.collection.changeActiveState(this.model);

                }

            });

            var CriterionCollectionView = Backbone.View.extend({

                el: $('#criteria'),

                collection: new CriterionCollection,

                initialize: function() {

                    _.bindAll(this, 'addOne', 'addAll');
                    
                    this.collection.bind('add', this.addOne);
                    this.collection.bind('refresh', this.addAll);

                    this.collection.fetch();

                },

                addOne: function(object) {

                    var view = new CriterionView({
                        model: object
                    });

                    this.el.append(view.render().el);

                },

                addAll: function() {

                    this.collection.each(this.addOne);

                }

            
            });


            CriterionCollectionView = new CriterionCollectionView;
        
        }); 


        return CriterionCollectionView;

    }
);


