/* global define, expect, describe, beforeEach, it */

define(['cilantro'], function(c) {

    describe('SessionCollection', function() {
        var collection;

        beforeEach(function() {
            collection = new c.models.SessionCollection();
        });

        it('should define the session', function() {
            expect(collection.session).toBeDefined();
            expect(collection.session.get('session')).toBe(true);
        });

        it('should get by session', function() {
            expect(collection.get('session')).toBe(collection.session);
        });

        it('should keep the reference on reset', function() {
            var session = collection.session;
            collection.reset();
            expect(collection.get('session')).toBe(session);
        });

        it('should only have one session on reset', function() {
            var session = collection.session;
            collection.reset([{'session': true, 'foo': 1}]);
            expect(collection.get('session')).toBe(session);
            expect(collection.session.get('foo')).toEqual(1);
        });
    });

});
