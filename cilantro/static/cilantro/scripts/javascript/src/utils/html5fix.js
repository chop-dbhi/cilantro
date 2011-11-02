/*
 * Utilizes Modernizr is certain features are supported. These fixes provide
 * support of the feature's behavior using JavaScript rather than natively.
 */

$(function() {

    if (!Modernizr.input.placeholder)
        $('input[placeholder]').placeholder();

    if (!Modernizr.input.autofocus)
        $('input[autofocus]').focus();

});