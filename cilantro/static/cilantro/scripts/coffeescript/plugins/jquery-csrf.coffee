# Adds a pre-filter to Ajax requests to ensure non-safe requests contain
# the CSRF token.
define [
    'jquery'
], ($) ->

    # Determines if a URL is of the same origin
    sameOrigin = (url) ->
        host = document.location.host
        protocol = document.location.protocol
        sr_origin = '//' + host
        origin = protocol + sr_origin
        (url is origin or url.slice(0, origin.length + 1) is origin + '/') or (url is sr_origin or url.slice(0, sr_origin.length + 1) is sr_origin + '/') or not (/^(\/\/|http:|https:).*/.test(url))

    # Simple check for whether a request method is safe
    safeMethod = (method) ->
        /^(GET|HEAD|OPTIONS|TRACE)$/.test method

    $.ajaxPrefilter (settings, origSettings, xhr) ->
        # For all same origin, non-safe requests add the X-CSRFToken header
        if not safeMethod(settings.type) and sameOrigin(settings.url)
            xhr.setRequestHeader 'X-CSRFToken', App.CSRF_TOKEN
