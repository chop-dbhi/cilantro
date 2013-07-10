define(['cilantro'], function(c) {
    var base = new c.ui.FieldControl,
        number = new c.ui.NumberControl,
        string = new c.ui.StringControl;
//string = new c.ui.Typeahead;

    return function(dom) {
        c.data.fields.when(function() {
            base.model = c.data.fields.get(59);
            number.model = c.data.fields.get(30);
            string.model = c.data.fields.get(53);

            base.render();
            number.render();
            string.render();

            dom.html('<h3 class=preview-label>Base</h3>');
            dom.append(base.el);

            dom.append('<h3 class=preview-label>Number</h3>');
            dom.append(number.el);

            dom.append('<h3 class=preview-label>String</h3>');
            dom.append(string.el);
        });
    }
});
