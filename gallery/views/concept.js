define(['cilantro.ui'], function(c) {
    var view = new c.ui.Concept;
    return function(dom) {
        c.data.concepts.when(function() {
            view.model = c.data.concepts.models[0];
            view.render();
            dom.html(view.el);
        });
    }
});
