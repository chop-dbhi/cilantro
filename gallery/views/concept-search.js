define(['cilantro.ui'], function(c) {
    return function(dom) {
        var view = new c.ui.ConceptSearch();
        dom.html(view.el);
        view.render();
    }
});
