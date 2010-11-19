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

    ['rest/datasource', 'rest/renderer'],

    function(mod_datasource, mod_renderer) {

        var dom = {
            content: $('#content'),
            categories: $('#categories')
        };
    }
)
