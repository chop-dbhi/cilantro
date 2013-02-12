define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.views.Concept;
    return function(dom) {
        c.data.concepts.when(function() {
            view.model = c.data.concepts.get(2);
            view.render();
            dom.html(view.el);
        });
    }
});
