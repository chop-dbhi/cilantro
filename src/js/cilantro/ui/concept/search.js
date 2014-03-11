/* global define */

define([
    'underscore',
    '../search'
], function(_, search) {


    var ConceptSearch = search.Search.extend({
        className: 'concept-search search',

        options: function() {
            return _.extend({}, search.Search.prototype.options, {
                placeholder: 'Search by name, description, or data...'
            });
        },

        search: function(query) {
            var handler = this.options.handler;

            if (!handler) throw new Error('no search handler defined');

            if (query) {
                this.collection.search(query, function(resp) {
                    handler(query, resp);
                });
            } else {
                handler(null, []);
            }
        }
    });


    return {
        ConceptSearch: ConceptSearch
    };
});
