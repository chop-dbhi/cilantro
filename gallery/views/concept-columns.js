define(['cilantro'], function(c) {
    var view = new c.ui.ConceptColumns({
        view: c.data.views.getSession(),
        collection: c.data.concepts.viewable
    });

    view.render();

    return function(dom) {
        dom.html(view.el);
    }
});
