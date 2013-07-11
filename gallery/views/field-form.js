define(['cilantro'], function(c) {
    var view1 = new c.ui.FieldForm,
        view2 = new c.ui.FieldForm;

    return function(dom) {
        c.data.fields.when(function() {
            view1.model = c.data.fields.models[0];
            view2.model = c.data.fields.models[1];
            view1.render();
            view2.render();

            dom.html('<h3 class=preview-label>Number</h3>');
            dom.append(view1.el);

            dom.append('<h3 class=preview-label>String</h3>');
            dom.append(view2.el);
        });
    }
});
