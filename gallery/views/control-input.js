define(['cilantro'], function(c) {
    var text = new c.ui.TextInput,
        select = new c.ui.SelectInput,
        typeahead = new c.ui.TypeaheadInput;

    return function(dom) {
        dom.html('<h3 class=preview-label>Text</h3>');
        dom.append(text.el);

        dom.append('<h3 class=preview-label>Select</h3>');
        dom.append(select.el);

        dom.append('<h3 class=preview-label>Typeahead</h3>');
        dom.append(typeahead.el);

        text.render();
        select.render();
        typeahead.render();
    }
});
