define(['cilantro', 'cilantro/ui'], function(c) {
    return function(dom) {
        c.data.concepts.when(function() {
            var view = new c.ui.views.ConceptForm({model:c.data.concepts.get(1)});
            view.render();
            dom.html(view.el);
        });
    }
});
