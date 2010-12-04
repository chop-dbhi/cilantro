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
                categories: $('#categories')
            };

            var src = {
                categories: new mod_datasource.ajax({
                    uri: dom.categories.data('uri'),
                    cache: true,
                    success: function(json) {
                        dom.categories.jqotesub(tmpl, json);
                    }
                })
            };

            src.categories.get();

            /*
             * Setup listeners for events.
             */
            dom.categories.bind('activate.category', function(evt, id) {
                var target = dom.categories.children('[data-id='+id+']');
                // stop futher propagation since this category is already
                // active
                if (target.hasClass('active'))
                    return false;
                target.addClass('active');
                target.siblings().removeClass('active');
            });

            /*
             * Bind user-triggered events
             */
            dom.categories.delegate('span.tab', 'click', function(evt) {
                dom.categories.trigger('activate.category',
                    [$(this).data('id')]);
            });
        }); 
    }
);
