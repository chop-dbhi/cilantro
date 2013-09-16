define(['jquery'], function(jQuery) {

    var ajax = jQuery.ajax,
        requestQueue = [],
        requestPending = false;

    function sendRequest(options, promise, trigger) {
        if (trigger !== false) trigger = true;
        if (trigger) requestPending = true;

        promise
            .done(options.success)
            .fail(options.error)
            .always(options.complete);

        var params = {
            complete: function() {
                if (trigger) dequeueRequest();
            },
            success: function() {
                promise.resolveWith(this, arguments);
            },
            error: function() {
                promise.rejectWith(this, arguments);
            }
        };

        ajax(jQuery.extend({}, options, params));
    }

    function dequeueRequest() {
        var args, options, promise;
        if ((args = requestQueue.shift())) {
            options = args[0], promise = args[1];
            sendRequest(options, promise);
        } else {
            requestPending = false;
        }
    }

    function queueRequest(options) {
        var promise, type, queue;
        promise = jQuery.Deferred();
        type = (options.type || 'get').toLowerCase();
        queue = options.queue !== null ? options.queue : (type === 'get' ? false : true);

        if (queue && requestPending) {
            requestQueue.push([options, promise]);
        } else {
            sendRequest(options, promise, queue);
        }
        return promise;
    }

    jQuery.ajax = function(options, optional) {
        if (typeof(options) === "string"){
            optional.url = options;
            options = optional;
        }
        return queueRequest(options);
    };

    jQuery.hasPendingRequest = function() {
        return requestPending;
    };
});
