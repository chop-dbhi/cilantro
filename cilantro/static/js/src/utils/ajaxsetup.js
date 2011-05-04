/*
 * Sets the default behavior of detecting a temporary redirect and updating the
 * window location. This is mainly useful for session timeouts.
 */

$.ajaxSetup({
    statusCode: {
        302: function(xhr) {
            try {
                var json = $.parseJSON(xhr.responseText);
                window.location = json.redirect;
            } catch(e) {}
        }
    }
});
