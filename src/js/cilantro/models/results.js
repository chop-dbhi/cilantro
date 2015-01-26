/* global define */

define([
    'underscore',
    'backbone',
    '../core',
    '../constants',
    '../structs',
    './paginator'
], function(_, Backbone, c, constants, structs, paginator) {

    var ResultsPage = structs.Frame.extend({
        idAttribute: 'page_num',

        url: function() {
            var url = _.result(this.collection, 'url');

            return c.utils.alterUrlParams(url, {
                page: this.id,
                per_page: this.collection.perPage   // jshint ignore:line
            });
        }
    });

    // Array of result frames (pages). The first fetch sets the state of the
    // collection including the frame size, number of possible frames, etc. A
    // refresh resets the collection as well as changes to the frame size.
    var Results = structs.FrameArray.extend({
        initialize: function() {
            _.bindAll(this, 'fetch', 'markAsDirty', 'onWorkspaceUnload',
                      'onWorkspaceLoad', 'refresh');

            // We start in a dirty state because initially, we have not
            // retrieved the results yet so the view and context are
            // technically out of sync with this results collection since the
            // collection is empty and the server may have results.
            this.isDirty = true;
            this.isWorkspaceOpen = false;

            // Debounce refresh to ensure changes are reflected up to the last
            // trigger. This is specifically important when the context and
            // view are saved simultaneously. The refresh will trigger after
            // the second.
            this._refresh = _.debounce(this.refresh, constants.CLICK_DELAY);

            c.on(c.VIEW_SYNCED, this.markAsDirty);
            c.on(c.CONTEXT_SYNCED, this.markAsDirty);

            this.on('workspace:load', this.onWorkspaceLoad);
            this.on('workspace:unload', this.onWorkspaceUnload);
        },

        onWorkspaceLoad: function() {
            this.isWorkspaceOpen = true;
            this._refresh();
        },

        onWorkspaceUnload: function() {
            this.isWorkspaceOpen = false;
        },

        markAsDirty: function() {
            this.isDirty = true;
            this._refresh();
        },

        cancel: function() {
            // Abort the request so handlers are not triggered.
            if (this.pending) {
                if (this.pending.abort) this.pending.abort();
                delete this.pending;
            }

            // Send a DELETE request to the server to cancel the backend process.
            return Backbone.ajax({
                type: 'delete',
                url: _.result(this, 'url'),
                contentType: 'application/json'
            });
        },

        fetch: function(options) {
            if (!options) options = {};

            var data;
            if ((data = c.config.get('session.defaults.data.preview'))) {
                options.type = 'POST';
                options.contentType = 'application/json';
                options.data = JSON.stringify(data);
            }

            if (this.isDirty && this.isWorkspaceOpen) {
                // Since we are making the fetch call immediately below, the
                // data will be synced again to the current view/context to
                // mark the results as clean for the time being.
                this.isDirty = false;

                if (options.cache === undefined) {
                    options.cache = false;
                }

                return structs.FrameArray.prototype.fetch.call(this, options);
            }
            else {
                // If the results aren't dirty or the workspace isn't open then
                // we simply abort this fetch call and remove the pending flag.
                // If we do not include this done method then calls from
                // refresh() to fetch that don't actually result in a call to
                // the server will never call the done() handler in the
                // refresh() call to fetch().
                var _this = this;
                return {
                    done: function() {
                        return delete _this.pending;
                    }
                };
            }
        }
    });

    // Mix-in paginator functionality for results.
    _.extend(Results.prototype, paginator.PaginatorMixin);

    // Override the default getPage behavior to respect the preview config
    // options. Without this, requests for different pages will not use the
    // view set in the config option and will use the session view instead
    // resulting in disparity between the first page and all other pages.
    Results.prototype.getPage = function(num, options) {
        if (!options) options = {};

        if (!this.hasPage(num)) return;

        var model = this.get(num);
        if (!model && options.load !== false) {
            model = new this.model({
                page_num: num       // jshint ignore:line
            });

            model.pending = true;
            this.add(model);

            var fetchOptions = {},
                data;
            if ((data = c.config.get('session.defaults.data.preview'))) {
                fetchOptions.type = 'POST';
                fetchOptions.contentType = 'application/json';
                fetchOptions.data = JSON.stringify(data);
            }
            model.fetch(fetchOptions).done(function() {
                delete model.pending;
            });
        }

        if (model && options.active !== false) {
            this.setCurrentPage(num);
        }

        return model;
    };

    // Set the custom model for this Paginator.
    Results.prototype.model = ResultsPage;

    return {
        Results: Results
    };

});
