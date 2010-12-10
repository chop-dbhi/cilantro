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

define(

    'define/categories',

    ['rest/datasource'],

    function(mod_datasource) {

        var tmpl = [
            '<span id="tab-<%= this.name.toLowerCase() %>" class="tab" data-id="<%= this.id %>">',
                '<div class="icon"></div>',
                '<span><%= this.name %></span>',
            '</span>'
        ].join('');

        $(function() {

            var dom = {
                categories: $('#categories'),
                subcategories: $('#subcategories')
            };
            dom.categories.current = null;
            dom.subcategories.current = null;

            var src = {
                categories: new mod_datasource.ajax({
                    decode: function(json) {
                        var map = {};
                        $.each(json, function(i, e) {
                            var elem = jQuery($.jqote(tmpl, e)).data(e);
                            map[e.id] = elem;
                        });
                        return map;
                    },

                    ajax: {
                        url: dom.categories.data('uri'),
                        cache: true,
                        success: function(json, decoded) {
                            $.each(json, function(i, e) {
                                dom.categories.append(decoded[e.id]);
                            });
                        }
                    }
                })
            };

            src.categories.get();

            /*
             * Setup listeners for events.
             */
            dom.categories.bind({
                /*
                 * Handles doing the necessary processing for 'activating' the
                 * defined category
                 */
                'activate-category': function(evt, id) {
                    // test cache
                    if (dom.categories.current === id)
                        return false;
                    dom.categories.current = id

                    var target = src.categories.get()[id];
                    target.addClass('active');
                    target.siblings().removeClass('active');
                    
                    // check for associated criterion and trigger
                    var state = target.data('_state');
                    if (!!state && state.criterion)
                        dom.categories.trigger('activate-criterion',
                            [state.criterion]);
                },

                /*
                 * When a criterion is activated, the id gets cached to be
                 * associated with the current category.
                 */
                'sync-category': function(evt, id, criterion_id) {
                    var category = src.categories.get()[id];
                    // stored in a 'hidden' object to not be mistakingly
                    // associated with the actual data of the object
                    category.data('_state', {criterion: criterion_id});
                    dom.categories.trigger('activate-category', [id]);
                    return false;
                }
            });

            /*
             * User-triggerable events
             */
            dom.categories.delegate('span.tab', 'click', function(evt) {
                $(evt.currentTarget).trigger('activate-category',
                    [$(this).data('id')]);
            });

            dom.subcategories.delegate('span', 'click', function(evt) {
                var target = $(this);
                target.addClass('active').siblings().removeClass('active');
                return false;
            });
        }); 
    }
);
