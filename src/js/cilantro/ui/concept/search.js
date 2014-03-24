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

        initialize: function() {
            // Track last request so the handler only gets the latest
            this._request = null;

            if (!this.options.handler) {
                throw new Error('no search handler defined');
            }
        },

        search: function(query) {
            // Abort the last request
            if (this._request) this._request.abort();

            var handler = this.options.handler;

            if (query) {
                this._request = this.collection.search(query, function(resp) {
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
