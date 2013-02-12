define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.views.ConceptForm;
    return function(dom) {
        c.data.concepts.when(function() {
            view.model = c.data.concepts.get(1);
            view.render();
        });
        dom.html(view.el);
    }
});
