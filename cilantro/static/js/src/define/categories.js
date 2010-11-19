/*
 * The categories, functionally, are proxies for the criterion objects that
 * are the main interactive component.
 *
 * Workflow:
 * - request categories
 * - populate criterion objects for each category
 *   - request only once, cache further requests
 *
 * Each category must keep state, that is, cache the last criterion that was
 * clicked for the given category.
 *
 * Events:
 * - activate
 * - deactivate
 *
 * The '#content' element will be used to delegate event triggers to the
 * categories. It has the following events as well:
 *
 * - activate <category-id>
 * - deactivate [<category-id1> [<category-id2>]]
 *
 * If no `id's are passed to 'deactivate', all categories will be triggered.
 *
 * All events are in the 'category' namespace.
 */

define(

    'define/categories',

    ['rest/datasource'],

    function(mod_datasource) {

        var tmpl = '<span id="tab-<%= this.name.toLowerCase() %>" ' +
            'class="tab" data-search="<%= this.name %>">' +
            '<div class="icon"></div><span><%= this.name %></span>' +
            '</span>';

        function init(content) {

            var dom = {
                content: content,
                categories: $('#categories')
            };

            var src = {
                categories: new mod_datasource.ajax({
                    // TODO convert `data' method for jQuery 1.4.4
                    uri: dom.categories.attr('data-uri'),
                    cache: true,
                    success: function(json) {
                        dom.categories.jqotesub(tmpl, json);
                    }
                })
            };

            src.categories.get();
        }; 

        return {init: init};
    }
);
