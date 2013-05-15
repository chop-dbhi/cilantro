define(['cilantro.ui'], function(c) {

    var routes;

    beforeEach(function() {
        routes = [{
            id: 1,
            route: 'foo/',
            view: new c.Backbone.View,
            el: '.region1'
        }, {
            id: 2,
            route: 'foo/',
            view: '/spec/route-spec-mod.js',
            el: '.region2'
        }, {
            id: 3,
            route: 'foo/',
            view: new c.Backbone.View,
            el: '.region3'
        }, {
            id: 4,
            route: 'bar/',
            view: new c.ui.QueryWorkflow,
            el: '.region3'
        }];

        c.$('#arena')
            .append('<div class=region1></div>')
            .append('<div class=region2></div>')
            .append('<div class=region3></div>');

        c.router.options.el = '#arena';
        c.router.register(routes);
        c.Backbone.history.start({pushState: false, hashChange: true});
    });

    afterEach(function() {
        c.Backbone.history.navigate();
        c.Backbone.history.stop();
        c.Backbone.history.handlers = [];

        c._.each(c._.keys(c.router._registered), function(id) {
            c.router.unregister(id);
        });
        c.router._handlers = {};
        c.$('#arena').empty();
    });

    describe('Router', function() {

        describe('Register', function() {

            it('should register', function() {
                expect(c._.keys(c.router._registered).length).toEqual(4);
                expect(c.router._loaded.length).toEqual(0);
                expect(c._.keys(c.router._handlers).length).toEqual(2);
                expect(c._.keys(c.router._routes).length).toEqual(2);
            });

            it('should load non-route routes on register', function() {
                c.router.register({
                    id: 5,
                    view: new Backbone.View
                });
                expect(c._.keys(c.router._registered).length).toEqual(5);
                expect(c.router._loaded.length).toEqual(1);
                expect(c._.keys(c.router._handlers).length).toEqual(2);
                expect(c._.keys(c.router._routes).length).toEqual(2);
            });
        });

        describe('Unregister', function() {

            it('should unregister', function() {
                c.router.unregister(routes[0].id);

                expect(c._.keys(c.router._registered).length).toEqual(3);
                expect(c.router._loaded.length).toEqual(0);
            });

            it('should load non-route routes on register', function() {
                c.router.register({
                    id: 5,
                    view: new Backbone.View
                });

                expect(c._.keys(c.router._registered).length).toEqual(5);
                expect(c.router._loaded.length).toEqual(1);

                c.router.unregister(5);

                expect(c._.keys(c.router._registered).length).toEqual(4);
                expect(c.router._loaded.length).toEqual(0);
            });

        });

        describe('Routing', function() {

            it('should load views', function() {
                expect(c.Backbone.history.navigate('foo/', {trigger: true})).toBe(true);

                // First two are loaded immediately since they are local views
                expect(c.router._loaded.length).toEqual(2);

                // The third route is asynchronous
                waitsFor(function() {
                    return !!$('#arena .region2').children().length;
                }, 200);

                runs(function() {
                    expect(c.router._loaded.length).toEqual(3);
                });
            });

            it('should unload loaded modules', function() {
                expect(c.Backbone.history.navigate('bar/', {trigger: true})).toBe(true);
                expect(c.router._loaded.length).toEqual(1);

                children = $('#arena .region3').children();
                expect(children.length).toEqual(1);

                expect(c.Backbone.history.navigate('foo/', {trigger: true})).toBe(true);

                // New element is added, but only the new one is visible
                children = $('#arena .region3').children();
                expect(children.length).toEqual(2);
                expect(children.filter(':visible').length).toEqual(1);
                expect(children.filter(':visible').is(c.router._registered[3]._view.el)).toBe(true);
            });

            describe('Events', function() {
                var loaded;

                beforeEach(function() {
                    loaded = false;

                    routes[0].view.on('router:load', function(router, route) {
                        loaded = true;
                    });

                    routes[0].view.on('router:unload', function(router, route) {
                        loaded = false;
                    });
                });

                afterEach(function() {
                    routes[0].view.off('router:load');
                    routes[0].view.off('router:unload');
                });

                it('should trigger the load event', function() {
                    c.Backbone.history.navigate('foo/', {trigger: true});
                    expect(loaded).toBe(true);
                });

                it('should trigger the unload event', function() {
                    c.Backbone.history.navigate('foo/', {trigger: true});
                    c.Backbone.history.navigate('bar/', {trigger: true});
                    expect(loaded).toBe(false);
                });
            });

        });
    });
});
