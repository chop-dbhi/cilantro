
/*
 * The categories, functionally, are proxies for the criterion objects that
 * are the main interactive component.
 *
 * On Load:
 * - request categories, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the category has been changed
 *
 * All events are in the 'category' namespace.
 */

define('define/categories',

    ['define/events', 'lib/backbone'],

    function(Events) {

        // template for CategoryView
        var template = [
            '<span id="tab-<%= name.toLowerCase() %>" ',
                'class="tab" data-id="<%= id %>">',
                '<div class="icon"></div>',
                '<span><%= name %></span>',
            '</span>'
        ].join('');

        var CategoryCollectionView;

        $(function() {

            /*
             * Class: Category
             *
             */
            var Category = Backbone.Model.extend({ 

                // add the ``active`` so event triggers are automatic
                // on change
                defaults: {

                    active: false

                }
           
            });

            var CategoryCollection = Backbone.Collection.extend({

                model: Category,

                url: window.__api__.categories,

                changeActiveState: function(object) {

                    // set all to the inactive state
                    _.each(this.models, function(e) {
                        e.set({'active': false});
                    });

                    // set the requested object's state
                    object.set({'active': true});

                }    

            });

            var CategoryView = Backbone.View.extend({

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

            var CategoryCollectionView = Backbone.View.extend({

                el: $('#categories'),

                collection: new CategoryCollection,

                initialize: function() {

                    _.bindAll(this, 'addOne', 'addAll');
                    
                    this.collection.bind('add', this.addOne);
                    this.collection.bind('refresh', this.addAll);

                    this.collection.fetch();

                },

                addOne: function(object) {

                    var view = new CategoryView({
                        model: object
                    });

                    this.el.append(view.render().el);

                },

                addAll: function() {

                    this.collection.each(this.addOne);

                    // set the first tab to be active
                    this.collection.at(0).set({'active': true})

                }

            
            });


            CategoryCollectionView = new CategoryCollectionView;


        }); 

        return CategoryCollectionView;

    }
);


