define(['cilantro/models/query'], function (query) {

    describe('QueryCollection', function() {
        var col;

        beforeEach(function() {
            col = new query.QueryCollection;
        });

        /* Disabled since this tested session-based functionality
           which was removed.

        it('should define a default session', function() {
            expect(col.getSession()).toBeDefined();
        });

        it('should merge session data on fetch', function() {
            col.url = '/mock/queries.json';
            runs(function() {
                col.fetch();
            });

            waitsFor(function() {
                return !!col.getSession().id;
            });

            runs(function() {
                expect(col.length).toBe(1);
            });
        });
        */
    });

});
