/* global define, require */

define([
    'underscore',
    'backbone',
    'marionette',
    'loglevel',
    '../../core',
    '../base',
    '../charts',
    '../config',
    './info',
    './stats',
    './controls'
], function(_, Backbone, Marionette, loglevel, c, base, charts,
            config, info, stats, controls) {


    var LoadingFields = base.LoadView.extend({
        message: 'Loading fields...'
    });


    // Contained within the ConceptForm containing views for a single FieldModel
    var FieldForm = Marionette.Layout.extend({
        className: 'field-form',

        getTemplate: function() {
            if (this.options.condensed) {
                return 'field/form-condensed';
            }

            return 'field/form';
        },

        options: {
            info: true,
            chart: false,
            stats: true,
            controls: true,
            condensed: false
        },

        ui: {
            apply: '[data-action=apply]',
            update: '[data-action=update]',
            state: '[data-target=state]'
        },

        events: {
            'click @ui.apply': 'applyFilter',
            'click @ui.update': 'applyFilter'
        },

        filterEvents: {
            'applied': 'renderFilter',
            'unapplied': 'renderFilter',
            'change': 'renderFilter'
        },

        regions: {
            info: '.info-region',
            stats: '.stats-region',
            chart: '.chart-region',
            controls: '.controls-region'
        },

        regionViews: {
            info: info.FieldInfo,
            stats: stats.FieldStats,
            chart: charts.FieldChart,
            controls: controls.FieldControls
        },

        initialize: function(options) {
            this.data = {};

            if (!(this.data.concept = options.concept)) {
                throw new Error('concept required');
            }

            if (!(this.data.context = options.context)) {
                throw new Error('context required');
            }

            if (!options.filter) {
                options.filter = this.data.context.define({
                    concept: this.data.concept.id,
                    field: this.model.id
                });
            }

            this.data.filter = options.filter;

            Marionette.bindEntityEvents(this, this.data.filter,
                Marionette.getOption(this, 'filterEvents'));
        },

        onRender: function() {
            // Set id for anchoring
            this.$el.attr('id', this.data.filter.id);
            if (this.options.condensed) this.$el.addClass('condensed');

            if (this.options.info) this.renderInfo();
            if (this.options.stats && this.model.stats) this.renderStats();
            if (this.options.controls) this.renderControls();
            if (this.options.chart && this.model.links.distribution) this.renderChart();

            this.renderFilter();
        },

        renderInfo: function() {
            var options = {model: this.model};

            if (_.isObject(this.options.info)) {
                _.extend(options, this.options.info);
            }

            this.info.show(new this.regionViews.info(options));
        },

        renderStats: function() {
            var options = {
                model: this.model,
                collection: this.model.stats
            };

            if (_.isObject(this.options.stats)) {
                _.extend(options, this.options.stats);
            }

            this.stats.show(new this.regionViews.stats(options));
        },

        renderControls: function() {
            var controls = [];

            _.each(this.options.controls, function(options) {
                var attrs = {
                    model: this.model,
                    filter: this.data.filter
                };

                if (_.isObject(options)) {
                    _.extend(attrs, options);
                } else {
                    attrs.control = options;
                }

                controls.push(attrs);
            }, this);

            if (controls.length > 0) {
                var region = new this.regionViews.controls({
                    collection: new Backbone.Collection(controls)
                });

                this.controls.show(region);
            }
        },

        renderChart: function() {
            var options;

            // Append a chart if the field supports a distribution
            if (this.options.condensed) {
                options = {
                    chart: {
                        height: 100
                    }
                };
            } else {
                options = {
                    chart: {
                        height: 200
                    }
                };
            }

            options.context = this.context;
            options.model = this.model;

            if (_.isObject(this.options.chart)) {
                _.extend(options, this.options.chart);
            }

            this.chart.show(new this.regionViews.chart(options));
        },

        renderFilter: function() {
            this.ui.apply.prop('disabled', false);
            this.ui.update.prop('disabled', true);
            this.ui.state.hide();

            if (this.data.context.isFilterApplied(this.data.filter)) {
                this.ui.apply.hide();
                this.ui.update.show();

                // Collect the relevant keys across controls that need to be compared
                // between the current and applied filter. This ensures server
                // annotations and other attributes not represented in UI are not
                // influencing the state.
                var keys = [];

                this.controls.currentView.children.each(function(proxy) {
                    if (!proxy.view) return;
                    keys = keys.concat(_.keys(proxy.view.get()));
                });

                if (this.data.context.hasFilterChanged(this.data.filter, keys)) {
                    this.ui.update.prop('disabled', false);
                }
            }
            else {
                this.ui.apply.show();
                this.ui.update.hide();
            }
        },

        validateFilter: function() {
            var message,
                messages = [],
                attrs = this.data.filter.toJSON();

            // Children are proxies to the control..
            this.controls.currentView.children.each(function(proxy) {
                if (proxy.view) {
                    message = proxy.view.validate(attrs);
                    if (message) messages.push(message);
                }
            });

            if (messages.length) {
                this.validationErrors = messages;
                this.ui.state.html(messages.join('<br>')).show();
                return false;
            }

            this.validationErrors = null;
            this.ui.state.text('').hide();
            return true;
        },

        applyFilter: function(event) {
            event.preventDefault();
            if (this.validateFilter()) {
                this.data.filter.apply();
            }
        }
    });


    var FieldError = base.ErrorView.extend({});


    var FieldFormCollection = Marionette.View.extend({
        itemView: FieldForm,

        emptyView: LoadingFields,

        errorView: FieldError,

        collectionEvents: {
            'reset': 'render'
        },

        initialize: function() {
            this.data = {};

            if (!(this.data.concept = this.options.concept)) {
                throw new Error('concept required');
            }

            if (!(this.data.context = this.options.context)) {
                throw new Error('context required');
            }
        },

        render: function() {
            if (this.collection.length) {
                var _this = this;

                this.collection.each(function(model, index) {
                    _this.renderItem(model, index);
                });
            }

            return this;
        },

        // Renders an item.
        renderItem: function(model, index) {
            var options = _.extend({}, this.options, {
                model: model,
                context: this.data.context,
                concept: this.data.concept,
                index: index
            });

            // This collection is used by a concept, therefore if only one
            // field is present, the concept name and description take
            // precedence
            if (this.collection.length < 2) {
                options.info = false;
            }

            // The condense option causes all fields after the first to render
            // in a condensed view by default.
            else if (index > 0 && this.options.condense) {
                options.condensed = true;
            }

            var result = config.resolveFormOptions(model, 'fields');

            _.extend(options, result.options);

            if (result.module) {
                var _this = this;

                require([
                    result.module
                ], function(viewClass) {
                    _this.createView(viewClass, options);
                }, function(err) {
                    _this.showErrorView(model);
                    loglevel.debug(err);
                });
            }
            else {
                this.createView(result.view || this.itemView, options);
            }
        },

        createView: function(viewClass, options) {
            try {
                var view = new viewClass(options);
                view.render();
                c.dom.insertAt(this.$el, options.index, view.el);
            }
            catch (err) {
                this.showErrorView(options.model);
                if (c.config.get('debug')) throw err;
            }
        },

        showErrorView: function(model) {
            var view = new this.errorView({model: model});
            view.render();
            this.$el.html(view.el);
        }
    });


    var FieldLink = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'field/link',

        ui: {
            anchor: 'a'
        },

        serializeData: function() {
            return {
                name: this.model.get('alt_name') || this.model.get('name')
            };
        }
    });


    var FieldLinkCollection = Marionette.CompositeView.extend({
        template: 'field/links',

        itemView: FieldLink,

        itemViewContainer: '[data-target=links]',

        onAfterItemAdded: function(view) {
            // Add anchor href to link to anchor
            var concept = this.options.concept;
            var id = 'c' + concept.id + 'f' + view.model.id;
            view.ui.anchor.attr('href', '#' + id);
        }
    });


    return {
        FieldForm: FieldForm,
        FieldFormCollection: FieldFormCollection,
        FieldLinkCollection: FieldLinkCollection
    };

});
