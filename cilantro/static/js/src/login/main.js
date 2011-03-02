/*
 * Adds logic to restrict form submission unless both fields are filled out.
 */

define(

    'login/main',

    function() {
        $(function() {
            var submit = $('[type=submit]'),
                username = $('[name=username]'),
                password = $('[name=password]');

            function check() {
                var valid = (username.val() && password.val()) ? true : false;
                submit.attr('disabled', !valid);
            };
            // check on page load since browser may autofill the form fields
            check();

            username.keyup(check);
            password.keyup(check);
        });
    }
);
