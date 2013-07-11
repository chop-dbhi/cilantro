define(['cilantro'], function(c) {
    var view = new c.ui.ConceptInfo;
    return function(dom) {
        c.data.concepts.when(function() {
            view.model = c.data.concepts.at(0);
            view.render();
            dom.html(view.el);
        });
    }
});
