/* global define, describe, waitsFor, runs, expect, jasmine, it */

define(['jquery'], function($) {

    // This function returns an function that is a jasmine test for the specified
    // ajax VERB against the local node endpoint
    var ajaxVerbJasmineTest = function(verb) {
        return function(){
            var completed = function() { return false; };

            runs(function(){
                var successSpy = jasmine.createSpy(),
                    completed = false,
                    promise = $.ajax({
                        url: 'http://localhost:8000/api/',
                        type: verb,
                        success: successSpy,
                        error: function(promise, statusText){
                            expect(successSpy).not.toHaveBeenCalled();
                            expect(statusText).toEqual('abort');
                            completed = true;
                        }
                    });

                promise.abort();
            });

            waitsFor(function() {
                return completed;
            });
        };
    };

    describe('Abort', function() {

        var verbs = {
            GET: 'should not call success when a GET call is aborted',
            POST: 'should not call success wehn a POST call is aborted'
        };

        for (var verb in verbs) {
            var message = verbs[verb];
            it(message, ajaxVerbJasmineTest(verb));
        }
    });
});
