define(['cilantro', 'cilantro/ui'], function(c) {
    var plain = new c.ui.FieldControl,
        contin = new c.ui.FieldControl,
        enumer = new c.ui.FieldControl,
        freetext = new c.ui.FieldControl;

    return function(dom) {
        c.data.fields.when(function() {
            plain.model = c.data.fields.get(59);
            contin.model = c.data.fields.get(30);
            enumer.model = c.data.fields.get(53);

            plain.render();
            contin.render();
            enumer.render();

            dom.html('<h3 class=preview-label>Vanilla</h3>');
            dom.append(plain.el);

            dom.append('<h3 class=preview-label>Continuous</h3>');
            dom.append(contin.el);

            dom.append('<h3 class=preview-label>Enumerable</h3>');
            dom.append(enumer.el);
        });
    }
});
