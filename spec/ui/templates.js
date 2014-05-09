/* global define, describe, afterEach, it, expect, waitsFor, runs */

define(['cilantro', 'underscore', 'marionette'], function(c, _, Marionette) {

    describe('Templates', function() {

        afterEach(function() {
            // Clear custom templates
            c.templates.clear();
        });

        it('should be ready by default', function() {
            expect(c.templates.ready()).toBe(true);
        });

        it('should be populated', function() {
            expect(c.templates).toBeDefined();
            expect(c.templates.get('welcome')).toBeDefined();
        });

        it('should allow override', function() {
            var newfunc = _.template('<h1>Hello!</h1>');
            c.templates.set('welcome', newfunc);
            expect(c.templates.get('welcome')).toBe(newfunc);
        });

        it('marionette should use custom cache', function() {
            expect(c.templates.get('welcome'))
                .toBe(Marionette.TemplateCache.get('welcome'));

            c.templates.set('foobar', _.template('<h1>Foobar</h1>'));

            var View = Marionette.ItemView.extend({
                template: 'foobar'
            });

            var view = new View();
            view.render();
            expect(view.$('h1').text()).toEqual('Foobar');
        });

        it('should allow for remote templates', function() {
            c.templates.set('remote', '/spec/custom-template.js');
            expect(c.templates.ready()).toBe(false);
            waitsFor(c.templates.ready);

            runs(function() {
                expect(c.templates.get('remote')({name: 'World'})).toEqual('Hello World');
            });
        });

        it('should allow for remote templates via tpl!', function() {
            c.templates.set('tpl!/spec/custom-template.html');
            waitsFor(c.templates.ready);

            runs(function() {
                expect(c.templates.get('spec/custom-template')({name: 'World'}))
                    .toEqual('Hello World\n');  // trailing newline from text! plugin
            });
        });

        it('should support an array', function() {
            c.templates.set(['tpl!/spec/custom-template.html']);
            waitsFor(c.templates.ready);

            runs(function() {
                expect(c.templates.get('spec/custom-template')).toBeDefined();
            });
        });

        it('should support an object', function() {
            c.templates.set({
                foobar: 'tpl!/spec/custom-template.html'
            });
            waitsFor(c.templates.ready);

            runs(function() {
                expect(c.templates.get('foobar')).toBeDefined();
            });
        });
    });

});
