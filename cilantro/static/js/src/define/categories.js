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

define('define/categories', ['define/events', 'rest/resource'],

    function(Events, Resource) {

        var template = [
            '<span id="tab-<%= this.name.toLowerCase() %>" ',
                'class="tab" data-id="<%= this.id %>">',
                '<div class="icon"></div>',
                '<span><%= this.name %></span>',
            '</span>'
        ].join('');

        var CategoryCollection, dom;

        $(function() {

            dom = {
                categories: $('#categories'),
                subcategories: $('#subcategories')
            };

            dom.categories.current = null;

            CategoryCollection = new Resource({

                url: dom.categories.data('uri'),
                template: template

            }).ready(function() {

                dom.categories.html(this.dom);
                this.dom.first().click();

            });

            /*
             * Handles doing the necessary processing for 'activating' the
             * defined category
             */ 
            dom.categories.bind(Events.ACTIVATE_CATEGORY,
                    
                function(evt, id) {

                    // test cache
                    if (dom.categories.current === id)
                        return false;
                    dom.categories.current = id;

                    CategoryCollection.ready(function() {

                        var target = this.store[id];
                        target.addClass('active');
                        target.siblings().removeClass('active');
                        
                        // check for associated criterion and trigger
                        var state = target.data('_state');
                        if (!!state && state.criterion)
                            dom.categories.trigger(Events.ACTIVATE_CRITERION,
                                [state.criterion]);

                    });

                }
            );

            /*
             * When a criterion is activated, the id gets cached to be
             * associated with the current category.
             */ 
            dom.categories.bind(Events.SYNC_CATEGORY,
                    
                function(evt, id, criterion_id) {

                    CategoryCollection.ready(function() {

                        var target = this.store[id];
                        // stored in a 'hidden' object to not be mistakingly
                        // associated with the actual data of the object
                        target.data('_state', {criterion: criterion_id});
                        dom.categories.trigger(Events.ACTIVATE_CATEGORY, [id]);

                    });

                    return false;
                }
            );

            /*
             * User-triggerable events
             */
            dom.categories.delegate('span.tab', 'click', function(evt) {

                $(evt.currentTarget).trigger(Events.ACTIVATE_CATEGORY,
                    [$(this).data('id')]);

            });

            dom.subcategories.delegate('span', 'click', function(evt) {

                var target = $(this);
                target.addClass('active').siblings().removeClass('active');
                return false;

            });

        }); 

        return CategoryCollection;

    }
);


