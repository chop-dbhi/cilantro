/* global define, describe, it, expect */

define(['cilantro/ui/notify'], function(notify) {

    var stream = new notify.Notifications();
    stream.render();

    stream.$el.appendTo('body').css({
        position: 'fixed',
        right: 0,
        top: 0
    });

    describe('Notifications', function() {
        it('should initialize with a collection', function() {
            expect(stream.collection).toBeDefined();
        });

        it('should create messages via notify', function() {
            stream.notify({
                message: 'Dismissable and Ephemeral'
            });

            stream.notify({
                message: 'Ephemeral',
                dismissable: false
            });

            stream.notify({
                message: 'Dismissable',
                timeout: 0
            });

            stream.notify({
                message: 'Fixed',
                timeout: 0,
                dismissable: false
            });

            expect(stream.collection.length).toEqual(4);
        });

    });

});
