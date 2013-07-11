define(['cilantro'], function(c) {
    return function(dom) {
        c.data.concepts.when(function() {
            var model = c.data.concepts.get(28)
            var view = new c.ui.ConceptWorkspace;
            view.render();
            dom.html(view.el);
            view.renderItem(model);
        });
    }
});
