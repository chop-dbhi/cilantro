/* global define */

define({

    // The delay before trigging an event after a user enters text. This
    // includes standard input and textarea elements. In practice this
    // is generally like _.debounce(f, consts.INPUT_DELAY). The intent of
    // defining this is to ensure a consistent UX across inputs.
    INPUT_DELAY: 400,

    // The delay before triggering an event after a user clicks on a button
    // or anchor elements.
    CLICK_DELAY: 300,

    // The delay before triggering a new request. This is used to debounce
    // controls that make requests for new data(such as the paginator) so that
    // rapid input from the user doesn't result is an immediate request but
    // instead can be used to only respond to the users last request.
    REQUEST_DELAY: 250

});
