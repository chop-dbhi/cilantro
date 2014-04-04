/* global define, require */

define([
    'underscore',
    'marionette',
    'loglevel',
    '../core',
    '../base',
    '../welcome',
    '../config',
    './form'
], function(_, Marionette, loglevel, c, base, welcome, config, form) {

    var ConceptError = base.ErrorView.extend({
        template: 'concept/error'
    });


    // Some of the class properties here are mimicked after CollectionView
    // since it is managing the concept form views
    var ConceptWorkspace = Marionette.Layout.extend({
        className: 'concept-workspace',

        template: 'concept/workspace',

        itemView: form.ConceptForm,

        errorView: ConceptError,

        regions: {
            main: '.main-region'
        },

        regionViews: {
            main: welcome.Welcome
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.concepts = this.options.concepts)) {
                throw new Error('concept collection required');
            }

            if (!(this.data.context = this.options.context)) {
                throw new Error('context model required');
            }

            this.listenTo(c, c.CONCEPT_FOCUS, this.showItem);
        },

        _ensureModel: function(model) {
            if (!(model instanceof c.models.Concept)) {
                model = this.data.concepts.get(model);
            }
            return model;
        },

        showItem: function(model) {
            model = this._ensureModel(model);

            // Already being shown
            if (this.currentView && this.currentView.model.id === model.id) return;

            var options = {
                model: model,
                context: this.data.context
            };

            var result = config.resolveFormOptions(model, 'concepts');

            // Extend options
            options = _.extend(options, result.options);

            // Load external module, catch error if it doesn't exist
            if (result.module) {
                var _this = this;

                require([
                    result.module
                ], function(itemView) {
                    _this.createView(itemView, options);
                }, function(err) {
                    _this.showErrorView(model);
                    loglevel.debug(err);
                });

            }
            else {
                this.createView(result.view || this.itemView, options);
            }
        },

        createView: function(itemViewClass, options) {
            try {
                var view = new itemViewClass(options);
                this.setView(view);
            }
            catch (err) {
                this.showErrorView(options.model);

                // Rethrow error
                if (c.config.get('debug')) throw(err);
            }
        },

        showErrorView: function(model) {
            var view = new this.errorView({
                model: model
            });
            this.currentView = view;
            this.main.show(view);
        },

        setView: function(view) {
            this.currentView = view;
            this.main.show(view);
        },

        onRender: function() {
            var main = new this.regionViews.main();
            this.main.show(main);
        }
    });


    return {
        ConceptWorkspace: ConceptWorkspace
    };

});
