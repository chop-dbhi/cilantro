/* global define */

define([
  'jquery'
], function($) {

    function sameOrigin(url) {
        var host = document.location.host,
            protocol = document.location.protocol,
            srOrigin = '//' + host,
            origin = protocol + srOrigin;

        return (url === origin || url.slice(0, origin.length + 1) === origin + '/') || (url === srOrigin || url.slice(0, srOrigin.length + 1) === srOrigin + '/') || !(/^(\/\/|http:|https:).*/.test(url));     // jshint ignore:line
    }

    function safeMethod(method) {
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    }

    function apply(header, token) {
        $.ajaxPrefilter(function(settings, origSettings, xhr) {
            if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                return xhr.setRequestHeader(header, token);
            }
        });
    }

    return {
        apply: apply
    };
});
