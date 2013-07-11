define(['cilantro'], function(c) {
    return function(dom) {
        c.data.concepts.when(function() {
            var view = new c.ui.ConceptForm({model:c.data.concepts.at(2)});
            view.render();
            dom.html(view.el);
        });
    }
});
