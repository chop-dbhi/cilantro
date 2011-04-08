define('define/main', ['lib/underscore', 'lib/backbone'], function() {
    /*
     * The application namespace.
     */

    var App = window.App = {};



    /*
     * The storage area for shared state between models and collections. KVO
     * can be setup to watch for changes to this object. Each observer should
     * force their "onstatechange" behaviors on initialization to ensure they
     * "catch up" reflecting the correct application state.
     */

    Controller = new Backbone.Model({

        // objects that define a domain should set this property. this will only
        // ever be observed by the DomainCollection. the ``domain`` and
        // ``subdomain`` properties will be updated accordingly which all other
        // dependent objects should bind to.
        _domain: null,

        // represents the currently active domain. from an application viewpoint
        // there is no distinction between domains and sub-domains. this logic is
        // handled within the DomainCollection
        domain: null,

        // represents the current sub-domain that is active
        subdomain: null,

        // represents the currently active concept. this will not be set onload
        // unless a session is being refreshed.
        concept: null

    });



    /*
     * A Domain is a high-level organization for concepts. Only a single domain
     * can be active at any given time. A domain is considered a sub-domain if and
     * only if it has a parent domain defined. If this is the case, then a
     * sub-domain implies the parent domain is active.
     */ 

    var Domain = Backbone.Model.extend({

        // top-level domains must keep track of their last active sub-domain 
        // in order to correctly refresh the previous state.
        subdomain: null,

        // similar to the reasoning above, if this domain becomes inactive and
        // then active (explicitly) it must refresh the interface relative to
        // it's previous state
        concept: null,


        initialize: function() {
            _.bindAll(this, 'conceptBinding');

            Controller.bind('change:concept', this.conceptBinding);

            // if this is a top-level domain, we need to create a faux sub-domain
            // which encapsulates all concepts within this domain regardless of the
            // sub-domain

        },

        conceptBinding: function() {
            var domain = Controller.get('domain');
            if (this.id === domain)
                this.concept = Controller.get('concept');
        }

    });



    /*
     * The DomainCollection encapsulates cross-instance logic.
     */

    var DomainCollection = Backbone.Collection.extend({
        model: Domain,

        url: '/audgendb/api/categories/',

        initialize: function() {
            _.bindAll(this, '_domainBinding', 'domainBinding', 'subdomainBinding');

            // add observer to the shared state object. only this collection
            // should observe this state property since it acts as a proxy for
            // determining the domain and subdomain models
            Controller.bind('change:_domain', this._domainBinding);
            Controller.bind('change:domain', this.domainBinding);
            Controller.bind('change:subdomain', this.subdomainBinding);

        },

        domainBinding: function() {
            var domain = this.get(Controller.get('domain'));

            if (domain.subdomain && domain.subdomain !== Controller.get('subdomain')) {
                Controller.set({ subdomain: domain.subdomain });
            }

            if (domain.concept)
                Controller.set({ concept: domain.concept });
        },

        subdomainBinding: function() {

//            var subdomain = this.get(Controller.get('subdomain'));
//            var domain = this.get(subdomain.get('parent'));

//            domain.subdomain = subdomain.id;

        },

        // this handles any logic for 
        _domainBinding: function() {

            var domain, subdomain;
            // this may be domain or sub-domain
            var _domain = this.get(Controller.get('_domain'));

            // if has a parent, this is sub-domain
            if (_domain.get('parent')) {

                domain = this.get(_domain.get('parent')).id;
                subdomain = _domain.id;
                domain.subdomain = subdomain;

            // if this already is a top-level domain, then we must check to
            // see if a sub-domain had been previously set
            } else {

                domain = _domain.id;
                subdomain = !!domain.subdomain ? this.get(domain.subdomain).id : null;

            }

            Controller.set({ domain: domain, subdomain: subdomain });

        }

    });

    /*
     * Concepts are the data-driven entry points for constructing their
     * self-contained interfaces. Every concept must be "contained" within
     * a domain, thus when a concept becomes active, the associated domain
     * (or sub-domain) will become active as well.
     */

    var Concept = Backbone.Model.extend({ });



    /*
     * The ConceptCollection encapsulates cross-instance logic.
     */

    var ConceptCollection = Backbone.Collection.extend({
        model: Concept,

        url: '/audgendb/api/criteria/'
    });



    /*
     * The DomainView handles setting up DOM event handlers for each Domain
     * instance that exists.
     */

    var DomainView = Backbone.View.extend({

        tagName: 'span',

        template: _.template('<div class="icon"></div><span><%= name %></span>'),

        events: {
            'click': 'clickBinding'
        },

        initialize: function() {
            _.bindAll(this, 'domainBinding');
            
            Controller.bind('change:domain', this.domainBinding);
            this.render();
        },

        render: function() {
            var name = this.model.get('name');
            $(this.el).attr('id', 'tab-'+name.toLowerCase())
                .html(this.template({ name: name }));
        },

        domainBinding: function() {
            if (Controller.get('domain') === this.model.id)
                $(this.el).addClass('active');
            else
                $(this.el).removeClass('active');
        },

        clickBinding: function(event) {
            Controller.set({ domain: this.model.id });
            return false;
        }

    });


    var SubDomainView = DomainView.extend({

        tagName: 'span',

        className: 'subdomain',

        initialize: function() {

            _.bindAll(this, 'domainBinding', 'subdomainBinding');

            Controller.bind('change:domain', this.domainBinding);
            Controller.bind('change:subdomain', this.subdomainBinding);

            this.render();
        },

        render: function() {
            this.el.innerHTML = this.model.get('name');
            jQuery('#subdomains').append(this.el);
        },

        domainBinding: function() {
            if (Controller.get('domain') === this.model.get('parent'))
                jQuery(this.el).show();
            else
                jQuery(this.el).hide();

        },

        subdomainBinding: function() {
            if (Controller.get('subdomain') === this.model.id)
                jQuery(this.el).addClass('active');
            else
                jQuery(this.el).removeClass('active');
        },

        clickBinding: function(event) {
            Controller.set({ subdomain: this.model.id });
            return false;
        }

    });


    var ConceptView = Backbone.View.extend({

        template: _.template('<span class="name"><%= name %></span>' +
            '<span class="description"><%= description %></span>'),

        events: {
            'click': 'clickBinding'
        },

        initialize: function() {
            _.bindAll(this, 'conceptBinding', 'domainBinding',
                'subdomainBinding');
            
            Controller.bind('change:concept', this.conceptBinding);

            // this concept is either part of a top-level domain or a subdomain,
            // but not both
            if (!this.model.get('category').parent)
                Controller.bind('change:domain', this.domainBinding);
            else
                Controller.bind('change:subdomain', this.subdomainBinding);

            this.render();
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
        },

        // bind to the application state ``concept`` to reflect the change
        conceptBinding: function() {
            if (Controller.get('concept') === this.model.id)
                $(this.el).addClass('active');
            else
                $(this.el).removeClass('active');
        },

        domainBinding: function() {
            var domain = Controller.get('domain');
            // TODO need to update to new terms
            // this model belongs to this domain directly
            if (this.model.get('category').id === domain) {
                $(this.el).show();
            // check if this model is in the subdomain that is currently active
            } else {
                $(this.el).hide();
            }
        },

        subdomainBinding: function() {
            var subdomain = Controller.get('subdomain');
            var domain = Controller.get('domain');

            // this implies that no subdomain is specified, therefore all
            // concepts within the parent domain should be shown
            if (subdomain === null && this.model.get('category').parent === domain) {
                $(this.el).show();
            } else if (this.model.get('category').id === subdomain) {
                $(this.el).show();
            } else {
                $(this.el).hide();
            }
        },

        clickBinding: function(event) {

            Controller.set({
                concept: this.model.id,
                _domain: this.model.get('category').id
            });

            return false;
        }

    });




    /*
     * The ApplicationView itself. This drives the bootstrapping of the whole
     * application.
     */


    var AppView = Backbone.View.extend({

        initialize: function() {

            var domains = $('#categories');
            var concepts = $('#criteria');

            // initialize and fetch the domains
            App.Domains = new DomainCollection;

            App.Domains.fetch({
                success: function() {
                    App.Domains.each(function(model) {
                        var view;

                        if (!model.get('parent'))
                            view = new DomainView({ model: model });
                        else
                             view = new SubDomainView({ model: model });       
                        domains.append(view.el);
                    });
                }
            });


            App.Concepts = new ConceptCollection;

            App.Concepts.fetch({
                success: function() {
                    App.Concepts.each(function(model) {
                        var view = new ConceptView({ model: model });
                        concepts.append(view.el);
                    });
                }
            });

        }

    });



    $(function() {
        new AppView;
    });


});
