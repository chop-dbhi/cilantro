define(['cilantro.ui'], function(c) {
    var view = new c.ui.ConceptColumns({
        collection: c.data.concepts.viewable
    });

    view.render();

    return function(dom) {
        dom.html(view.el);
    }
});
