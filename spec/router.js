define([
    'jquery',
    'underscore',
    'backbone',
    'cilantro',
    'cilantro/router'
], function($, _, Backbone, c, router) {

    describe('Router', function() {
        var r, routes;

        beforeEach(function() {
            $('#region1, #region2, #region3').remove();

            $('body')
                .append('<div id=region1 />')
                .append('<div id=region2 />')
                .append('<div id=region3 />');

            r = new router.Router({
                main: 'body'
            });

            routes = [{
                id: 1,
                route: 'foo/',
                view: new Backbone.View,
                el: '#region1'
            }, {
                id: 2,
                route: 'foo/',
                view: '/spec/route-spec-mod.js',
                el: '#region2'
            }, {
                id: 3,
                route: 'foo/',
                view: new Backbone.View,
                el: '#region3'
            }, {
                id: 4,
                route: 'bar/',
                view: new c.ui.QueryWorkflow,
                el: '#region3'
            }];

            r.register(routes);
            r.start();
        });

        afterEach(function() {
            Backbone.history.navigate();
            Backbone.history.stop();
            Backbone.history.handlers = [];
        });

        describe('Register', function() {

            it('should register', function() {
                expect(_.keys(r._registered).length).toEqual(4);
                expect(r._loaded.length).toEqual(0);
                expect(_.keys(r._handlers).length).toEqual(2);
                expect(_.keys(r._routes).length).toEqual(2);
            });

            it('should load non-route routes on register', function() {
                r.register({
                    id: 5,
                    view: new Backbone.View
                });
                expect(_.keys(r._registered).length).toEqual(5);
                expect(r._loaded.length).toEqual(1);
                expect(_.keys(r._handlers).length).toEqual(2);
                expect(_.keys(r._routes).length).toEqual(2);
            });
        });

        describe('Unregister', function() {

            it('should unregister', function() {
                r.unregister(routes[0].id);

                expect(_.keys(r._registered).length).toEqual(3);
                expect(r._loaded.length).toEqual(0);
            });

            it('should load non-route routes on register', function() {
                r.register({
                    id: 5,
                    view: new Backbone.View
                });

                expect(_.keys(r._registered).length).toEqual(5);
                expect(r._loaded.length).toEqual(1);

                r.unregister(5);

                expect(_.keys(r._registered).length).toEqual(4);
                expect(r._loaded.length).toEqual(0);
            });

        });

        describe('Routing', function() {

            it('should load views', function() {
                expect(Backbone.history.navigate('foo/', {trigger: true})).toBe(true);

                // First two are loaded immediately since they are local views
                expect(r._loaded.length).toEqual(2);

                // The third route is asynchronous
                waitsFor(function() {
                    return !!$('#region2').children().length;
                }, 200);

                runs(function() {
                    expect(r._loaded.length).toEqual(3);
                });
            });

            it('should unload loaded modules', function() {
                expect(Backbone.history.navigate('bar/', {trigger: true})).toBe(true);
                expect(r._loaded.length).toEqual(1);

                children = $('#region3').children();
                expect(children.length).toEqual(1);

                expect(Backbone.history.navigate('foo/', {trigger: true})).toBe(true);

                // New element is added, but only the new one is visible
                children = $('#region3').children();
                expect(children.length).toEqual(2);
                expect(children.filter(':visible').length).toEqual(1);
                expect(children.filter(':visible').is(r._registered[3]._view.el)).toBe(true);
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
                    Backbone.history.navigate('foo/', {trigger: true});
                    expect(loaded).toBe(true);
                });

                it('should trigger the unload event', function() {
                    Backbone.history.navigate('foo/', {trigger: true});
                    Backbone.history.navigate('bar/', {trigger: true});
                    expect(loaded).toBe(false);
                });
            });

        });
    });
});
