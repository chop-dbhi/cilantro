define('define/bb/views',

    ['define/bb/models', 'lib/backbone', 'lib/clerk'],

    function(models) {            

        // template for CategoryView

        $(function() {


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


            /*
             * Class: CategoryView
             *
             * The corresponding view for CategoryModel.
             */
            var CategoryView = ActiveStateView.extend({

                tagName: 'span',

                className: 'tag',

                template: _.template('<div class="icon"></div><span><%= name %></span>'),

                render: function() {

                    // dynamic `id' must be set if it does not exist
                    if (!this.el.id)
                        this.el.id = 'tab-' + this.model.get('name').toLowerCase();

                    return ActiveStateView.prototype.render.call(this);
                }    

            });


            /*
             * Class: CategoryCollectionView
             *
             * A bootstrap feature has been added to this class to activate
             * the first category in this collection, so the user has a 
             * starting point.
             */
            var CategoryCollectionView = SingleActiveStateCollectionView.extend({

                jq: $('#categories'),

                modelView: CategoryView,

                initialize: function() {

                    this.bind('render', this.selectFirst);

                    SingleActiveStateCollectionView.prototype.initialize.call(this);
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


            /*
             * Class: CriterionView
             *
             * Adds UI components to handle the additional property 'visible'
             * on the CriterionModel.
             */
            var CriterionView = ActiveStateView.extend({

                tagName: 'div',

                template: _.template([
                    '<div class="icon info"></div>',
                    '<span class="name"><%= name %></span>',
                    '<span class="description"><%= description %></span>',
                ].join('')),

                initialize: function() {

                    this.model.bind('change:visible',
                        _.bind(this.toggleVisibleState, this));

                    ActiveStateView.prototype.initialize.call(this);

                },

                render: function() {

                    ActiveStateView.prototype.render.call(this);

                    this.toggleVisibleState();

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
            var CriterionCollectionView = SingleActiveStateCollectionView.extend({

                jq: $('#criteria'),

                modelView: CriterionView,

            });


            /*
             * Class: SearchInputView
             *
             * Represents the search input that delegates user input to a
             * search interface.
             */
            var SearchInputView = Backbone.View.extend({

                jq: $('#search'),

                focused: false,

                timer: null,

                events: {

                    'focus': 'focus',
                    'blur': 'blur',
                    'keyup': 'keyup'

                },

                initialize: function() {

                    this.render();

                },

                render: function() {

                    this.el = this.jq[0];
                    this.delegateEvents();

                },

                focus: function() {
                    this.focused = true;
                    this.trigger('focused');
                },

                blur: function() {
                    this.focused = false;
                    this.trigger('blurred');
                },

                keyup: function() {

                    clearTimeout(this.timer);

                    var ref = this;
                    this.timer = setTimeout(function() {

                        ref.trigger('query', [ref.jq.val()]);

                    }, 100);

                }

            });


            /*
             * Class: SearchResultsView
             *
             * Represents the filtered collection of criterion objects driven
             * by the interaction with the search input.
             */
            var SearchResultsView = Backbone.View.extend({

                id: 'search-results',

                tagName: 'div',

                empty: $('<p style="font-style:italic">No results found</p>'),

                collection: models.CriterionCollection,

                input: new SearchInputView,

                events: {

                    'mouseenter': 'enter',
                    'mouseleave': 'leave'
                
                },

                query: null,
                
                focused: false,

                initialize: function() {

                    this.input.bind('focused', _.bind(this.show, this));
                    this.input.bind('blurred', _.bind(this.hide, this));
                    this.input.bind('query', _.bind(this.query, this));

                    this.render();

                },

                render: function() {

                    this.jq = $(this.el);
                    this.jq.appendTo('body');

                },

                setPosition: function() {

                    var r = this.jq,            // results
                        s = this.input.jq;      // input

                    var rWidth = r.outerWidth(),
                        sOffset = s.offset(),
                        sHeight = s.outerHeight(),
                        sWidth = s.outerWidth();

                    r.css({

                        left: sOffset.left - (rWidth - sWidth) / 2.0,
                        top: sOffset.top + sHeight + 5

                    });

                },

                enter: function() {

                    this.focused = true;

                },

                leave: function() {

                    this.focused = false;

                    if (!this.input.focused)
                        this.hide();

                },

                show: function() {

                    this.setPosition();

                    if (this.query)
                        this.jq.show();

                },

                hide: function() {

                    if (!this.focused)
                        this.jq.fadeOut('fast');

                },


                query: function(value) {

                    var ref = this;

                    $.getJSON(this.collection.url, {'q': value}, function(resp) {



                    });

                }

            });


            SearchResultsView = new SearchResultsView({ });


            // instaniate the collection views which effectively kickstarts
            // the application
            CategoryCollectionView = new CategoryCollectionView({
                
                collection: models.CategoryCollection

            });

            CriterionCollectionView = new CriterionCollectionView({

                collection: models.CriterionCollection

            });


        }); 

    }
);


