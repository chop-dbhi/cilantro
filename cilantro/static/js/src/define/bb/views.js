define('define/bb/views',

    ['define/bb/models', 'lib/backbone', '/static/client/js/src/lib/queue.js'],

    function(models) {            

        // template for CategoryView

        $(function() {

            var SingleActiveStateView = Backbone.View.extend({

                events: {

                    'click': 'changeActiveState'

                },

                initialize: function() {

                    this.queue = new Queue;

                    // when the associated model changes it's "active" state,
                    // this needs to be reflected in the UI
                    this.model.bind('change:active', _.bind(this.toggleActiveState,
                        this));

                    // bind a reference of this view to the model for convenience
                    this.model.view = this;

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
                 * Performs any necessary DOM changes when this view becomes
                 * active or deactive.
                 */
                toggleActiveState: function() {

                    if (this.model.get('active') === true)
                        this.jq.addClass('active');
                    else
                        this.jq.removeClass('active');
                    
                },

                /*
                 * Click event handler for this view. This calls a method on
                 * the collection to manage activating and deactivating the
                 * respective tabs.
                 */
                changeActiveState: function() {

                    this.model.collection.changeActiveState(this.model.id);

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

                    this.queue = new Queue;

                    _.bindAll(this, 'appendView', 'render');
                    
                    this.collection.bind('add', this.appendView);
                    this.collection.bind('refresh', this.render);

                    this.collection.fetch();

                },

                appendView: function(object) {

                    var view = new this.childView({

                        model: object

                    });

                    this.jq.append(view.render().el);

                },

                render: function() {

                    this.collection.each(this.appendView);

                    // since this view is composed of other views, this is
                    // technically where the 'render' event should be triggered
                    this.trigger('render');

                }
 
            });


            var CategoryView = SingleActiveStateView.extend({

                tagName: 'span',

                className: 'tag',

                template: _.template([
                    '<div class="icon"></div>',
                    '<span><%= name %></span>'
                ].join('')),

                render: function() {

                    // dynamic `id' must be set if it does not exist
                    if (!this.el.id)
                        this.el.id = 'tab-' + this.model.get('name').toLowerCase();

                    return SingleActiveStateView.prototype.render.call(this);
                }    

            });

            var CategoryCollectionView = SingleActiveStateCollectionView.extend({

                jq: $('#categories'),

                childView: CategoryView,

                collection: models.CategoryCollection,

                initialize: function() {

                    _.bindAll(this, 'selectFirst');

                    this.bind('render', this.selectFirst);

                    SingleActiveStateCollectionView.prototype.initialize.call(this);
                },

                selectFirst: function() {

                    this.collection.queue.add(_.bind(function() {

                        this.changeActiveState(this.at(0).id);

                    }, this.collection));

                }

            });


            var CriterionView = SingleActiveStateView.extend({

                tagName: 'div',

                template: _.template([
                    '<div class="icon info"></div>',
                    '<span class="name"><%= name %></span>',
                    '<span class="description"><%= description %></span>',
                ].join('')),

                initialize: function() {
                    _.bindAll(this, 'toggleVisibleState');

                    this.model.bind('change:visible', this.toggleVisibleState);

                    SingleActiveStateView.prototype.initialize.call(this);

                },

                toggleVisibleState: function() {

                    if (this.model.get('visible'))
                        this.jq.show();
                    else
                        this.jq.hide();

                }

            });

            var CriterionCollectionView = SingleActiveStateCollectionView.extend({

                jq: $('#criteria'),

                childView: CriterionView,

                collection: models.CriterionCollection,

            });

            // invocations
            CategoryCollectionView = new CategoryCollectionView;

            setTimeout(function() {
                CriterionCollectionView = new CriterionCollectionView;
            }, 10000);

        }); 

    }
);


