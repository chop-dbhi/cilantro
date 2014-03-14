/* global define, describe, it, expect */

define(['cilantro', 'underscore', 'marionette'], function(c, _, Marionette) {

    describe('Templates', function() {

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

    });

});
