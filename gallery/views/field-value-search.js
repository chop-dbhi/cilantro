define(['cilantro', 'text!/mock/fields/string.json'], function(c, fieldJSON) {
    var view = new c.ui.FieldValueSearch({
        model: new c.models.FieldModel(JSON.parse(fieldJSON), {
            parse: true
        })
    });
    window.valuesearch = view;
    view.render();
    return function(dom) {
        dom.html(view.el);
    }
});
