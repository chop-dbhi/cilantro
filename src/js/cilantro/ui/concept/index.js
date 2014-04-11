/* global define */

define([
    'backbone',
    '../core',
    '../base',
    '../accordian'
], function(Backbone, c, base, accordian) {


    var ConceptItem  = accordian.AccordianItem.extend({
        events: {
            'click a': 'click'
        },

        initialize: function() {
            this.listenTo(c, c.CONCEPT_FOCUS, this.toggleFocus);
        },

        click: function(event) {
            event.preventDefault();

            c.trigger(c.CONCEPT_FOCUS, this.model.id);
        },

        toggleFocus: function(id) {
            this.$el.toggleClass('active', id === this.model.id);
        }
    });


    var ConceptSection = accordian.AccordianSection.extend({
        itemView: ConceptItem,

        filter: function(query, models) {
            // If any children are visible, show this section, otherwise hide it
            var show = false;

            this.children.each(function(view) {
                if (!query || models[view.model.id]) {
                    view.$el.show();
                    show = true;
                }
                else {
                    view.$el.hide();
                }
            });

            this.$el.toggle(show);

            return show;
        }
    });


    var ConceptGroup = accordian.AccordianGroup.extend({
        itemView: ConceptSection,

        filter: function(query, models) {
            // If any sections are visible, show this group, otherwise hide it
            var show = false;

            this.children.each(function(view) {
                if (view.filter(query, models)) show = true;
            });

            if (!query) {
                this.$el.show();
                this.renderState();
            } else if (show) {
                this.$el.show();
                this.renderExpanded();
            } else {
                this.$el.hide();
            }

            return show;
        },

        find: function(model) {
            var cid, view, child;

            for (cid in this.children._views) {
                view = this.children._views[cid];

                if (view.children && (child = view.children.findByModel(model))) {
                    return child;
                }
            }
        }
    });


    var ConceptIndex = accordian.Accordian.extend({
        className: 'concept-index accordian',

        itemView: ConceptGroup,

        emptySearchView: base.EmptySearchView,

        // Override to create the parsed collection and render it
        showCollection: function() {
            this.resetGroups();

            var _this = this;

            this.groups.each(function(item, index) {
                _this.addItemView(item, _this.getItemView(item), index);
            });
        },

        getGroup: function(attrs) {
            if (attrs.category) {
                var group = attrs.category;

                // Roll up parents to top-level group
                while (group.parent) group = group.parent;

                return group;
            }

            // Return the default group 'Other'
            return {
                id: -1,
                name: 'Other'
            };
        },

        getSection: function(attrs) {
            if (attrs.category && attrs.category.parent) {
                return attrs.category;
            }

            // Return the default section 'Other'
            return {
                id: -1,
                name: 'Other'
            };
        },

        resetGroups: function() {
            if (!this.groups) {
                this.groups = new Backbone.Collection(null, {
                    comparator: 'order'
                });
            }
            else {
                this.groups.reset();
            }

            var _this = this;

            this.collection.each(function(model) {
                _this.groupModel(model);
            });
        },

        // Group by category and sub-category
        groupModel: function(model) {
            var groupAttrs = this.getGroup(model.attributes),
                sectionAttrs = this.getSection(model.attributes);

            // Get the top-level group for the model
            var group = this.groups.get(groupAttrs.id);

            if (!group) {
                group = new Backbone.Model(groupAttrs);

                group.sections = new Backbone.Collection(null, {
                    comparator: 'order'
                });

                this.groups.add(group);
            }

            // Get the section (sub-group) for the model
            var section = group.sections.get(sectionAttrs.id);

            if (!section) {
                section = new Backbone.Model(sectionAttrs);

                section.items = new Backbone.Collection(null, {
                    comparator: 'order'
                });

                group.sections.add(section);
            }

            section.items.add(model);
        },

        filter: function(query, resp) {
            var models = {};

            if (query) {
                var i, attrs, model;

                for (i = 0; i < resp.length; i++) {
                    attrs = resp[i];

                    if ((model = this.collection.get(attrs.id))) {
                        models[model.id] = model;
                    }
                }
            }

            var show = false;

            this.children.each(function(view) {
                if (view.filter(query, models)) show = true;
            });

            if (show) {
                this.closeEmptySearchView();
            } else {
                this.showEmptySearchView(query);
            }

            return show;
        },

        find: function(model) {
            var cid, view, child;

            for (cid in this.children._views) {
                view = this.children._views[cid];

                if ((child = view.find(model))) {
                    return child;
                }
            }
        },

        // Override show/close empty view to append and remove rather
        // than adding it to the internal children collection.
        showEmptySearchView: function(query) {
            this.closeEmptySearchView();

            this._emptyView = new this.emptySearchView({
                message: '<p>We could not find anything related to "' +
                         query + '"</p>'
            });

            this.$el.append(this._emptyView.render().el);
        },

        closeEmptySearchView: function() {
            if (this._emptyView) {
                this._emptyView.remove();
                delete this._emptyView;
            }
        }
    });


    return {
        ConceptIndex: ConceptIndex,
        ConceptGroup: ConceptGroup,
        ConceptSection: ConceptSection,
        ConceptItem: ConceptItem
    };

});
