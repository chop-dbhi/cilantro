/* global define, require */

define([
    'underscore',
    'marionette',
    '../../logger',
    '../../core',
    '../base',
    '../controls'
], function(_, Marionette, logger, c, base, controls) {

    // Sets up a two-way binding between the view and context and
    // unbinds a previously bound context
    var bindContext = function(view, context) {
        if (!context) return;

        context.listenTo(view, 'change', function(view, attrs) {
            context.set(attrs);
        });

        view.listenTo(context, 'change', function(context) {
            if (!this._changing) view.set(context.toJSON());
        });
    };


    var FieldControlError = base.ErrorView.extend({
        message: 'Error rendering field control'
    });


    var LoadingFieldControls = base.LoadView.extend({
        message: 'Loading and rendering field controls...'
    });


    // View of a collection of field controls
    var FieldControls = Marionette.View.extend({
        emptyView: LoadingFieldControls,

        errorView: FieldControlError,

        render: function() {
            var _this = this;

            this.collection.each(function(model, index) {
                _this.initControl(model, index);
            });

            return this.el;
        },

        // Initializes and then renders the control
        initControl: function(model, index) {
            var context = model.get('context');

            var options = _.extend({}, {
                model: model.get('model'),
            }, model.get('options'));

            // Get the registered control view is one exists
            var control = model.get('control'),
                controlView = controls.get(control);

            // Constructor, create item otherwise assume `control` is a
            // module name
            if (_.isFunction(controlView)) {
                this.renderControl(controlView, context, index, options);
            } else {
                var _this = this;
                // If control view is not defined, fallback to using the
                // control id as the module path
                require([controlView || control], function(controlView) {
                    _this.renderControl(controlView, context, index, options);
                }, function(err) {
                    _this.showErrorView();
                    logger.debug(err);
                });
            }
        },

        renderControl: function(viewClass, context, index, options) {
            var _this = this,
                view = new viewClass(options);

            view.render();

            // Before the control is declared ready, set the initial state of
            // the control and bind the context for future changes.
            view.on({
                'beforeready': function() {
                    this.set(context.toJSON());
                    bindContext(this, context);
                },
                'error': function() {
                    this.showErrorView();
                }
            });

            // Declare this view is conditionally ready
            view.ready(true);

            // Perform DOM operation as the last step in case the above
            // deferred resolves immediately.
            c.dom.insertAt(_this.$el, index, view.el);
        },

        showErrorView: function() {
            var view = new this.errorView();
            view.render();
            this.$el.html(view.el);
        }
    });


    return {
        FieldControls: FieldControls
    };

});
