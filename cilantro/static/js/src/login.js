/*
 * Adds logic to restrict form submission unless both fields are filled out.
 */

define(

    'login',

    function() {
        $(function() {
            var submit = $('[type=submit]'),
                username = $('[name=username]'),
                password = $('[name=password]');

            function check() {
                var t = (username.val() && password.val()) ? false : true;
                submit.attr('disabled', t);
            };
            // check on page load since browser may autofill the form fields
            check();

            username.keyup(check);
            password.keyup(check);
        });
    }
);
