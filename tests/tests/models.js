define(['cilantro'], function(c) {
    module('models');

    // Requires running server..
    test('models', function() {
        // Ensure the session is closed prior to testing initial state
        c.closeSession();

        // Collections are initialized
        ok(c.data.concepts, 'concept collection');
        ok(c.data.fields, 'field collection');
        ok(c.data.contexts, 'context collection');
        ok(c.data.views, 'view collection');

        equal(c.data.concepts.models.length, 0, 'empty');
    });
});
