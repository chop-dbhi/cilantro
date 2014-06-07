/* global define, require */

define([
    'underscore',
    'marionette',
    'loglevel',
    '../../core',
    '../base',
    '../controls'
], function(_, Marionette, loglevel, c, base, controls) {

    // Sets up a two-way binding between the view and filter and
    // unbinds a previously bound filter
    var bindFilter = function(view, filter) {
        if (!filter) return;

        filter.listenTo(view, 'change', function(view, attrs) {
            filter.clear();
            filter.set(attrs);
        });

        view.listenTo(filter, 'change', function(filter) {
            view.set(filter.toJSON());
        });
    };

    var unbindFilter = function(view, filter) {
        filter.stopListening(view);
        view.stopListening(filter);
    };


    var FieldControlError = base.ErrorView.extend({
        message: 'Error rendering field control'
    });


    var LoadingFieldControls = base.LoadView.extend({
        message: 'Loading and rendering field controls...'
    });


    // Placeholder view that *eventually* renders the actual control since
    // the target control may need to load asynchronously.
    var FieldControl = Marionette.ItemView.extend({

        errorView: FieldControlError,

        template: function() {},

        // Get the class if it is registered, otherwise assume it is a module
        // name to be loaded. If loaded asynchronously, the view will be
        // rendered once loaded.
        initialize: function() {
            var viewClass = this.model.get('control');

            viewClass = controls.get(viewClass) || viewClass;

            if (_.isFunction(viewClass)) {
                this.viewClass = viewClass;
            }
            else {
                var _this = this;

                require([
                    viewClass
                ], function(viewClass) {
                    _this.viewClass = viewClass;
                    _this.render();
                }, function(err) {
                    _this.showErrorView();
                    loglevel.debug(err);
                });
            }
        },

        onRender: function() {
            if (!this.viewClass) return;

            this.view = new this.viewClass(this.model.toJSON());
            this.view.render();
            this.$el.html(this.view.el);

            // Before the control is declared ready, set the initial state of
            // the control and bind the filter for future changes.
            this.listenTo(this.view, {
                beforeready: this.onControlBeforeReady,
                error: this.onControlError
            });

            // Declare this view to be *conditionally* ready. Read more
            // in `cilantro/ui/controls/base`.
            this.view.ready(true);
        },

        // Clean up and unattach events on control
        onBeforeClose: function() {
            if (this.view) {
                var filter = this.model.get('filter');
                unbindFilter(this.view, filter);
                this.view.close();
            }
        },

        onControlBeforeReady: function() {
            var filter = this.model.get('filter');
            this.view.set(filter.toJSON());
            bindFilter(this.view, filter);
        },

        onControlError: function() {
            this.showErrorView();
        },

        showErrorView: function() {
            this.view = new this.errorView(this.model.toJSON());
            this.view.render();
            this.$el.html(this.view.el);
        }
    });


    // View of a collection of field controls
    var FieldControls = Marionette.CollectionView.extend({
        itemView: FieldControl,

        emptyView: LoadingFieldControls
    });


    return {
        FieldControls: FieldControls
    };

});
