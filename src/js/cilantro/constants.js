/* global define */

define({

    // The delay before trigging an event after a user enters text. This
    // includes standard input and textarea elements. In practice this
    // is generally like _.debounce(f, consts.INPUT_DELAY). The intent of
    // defining this is to ensure a consistent UX across inputs.
    INPUT_DELAY: 400,

    // The delay before triggering an event after a user clicks on a button
    // or anchor elements.
    CLICK_DELAY: 300

});
