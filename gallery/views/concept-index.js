define(['cilantro'], function(c) {
    var view = new c.ui.ConceptIndex({
        collection: c.data.concepts
    });

    var emptyView = new c.ui.ConceptIndex;

    return function(dom) {
        view.render();
        emptyView.render();

        dom.html('<h3 class=preview-label>Populated</h3>')
        dom.append(view.el);

        dom.append('<h3 class=preview-label>Empty</h3>')
        dom.append(emptyView.el);
    }
});
