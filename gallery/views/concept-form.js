define(['cilantro', 'cilantro/ui'], function(c) {
    return function(dom) {
        c.data.concepts.when(function() {
            var view = new c.ui.ConceptForm({model:c.data.concepts.at(0)});
            view.render();
            dom.html(view.el);
        });
    }
});
