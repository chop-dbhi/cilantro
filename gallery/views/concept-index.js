define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.views.ConceptIndex({
        collection: c.data.concepts
    });
    return function(dom) {
        view.render();
        dom.html(view.el);
    }
});
