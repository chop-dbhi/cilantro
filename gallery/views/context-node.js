define(['cilantro'], function(c) {
    return function(dom) {
        c.data.contexts.ready(function() {
            var model = c.data.contexts.getSession();
            var view = new c.ui.ContextNode({
                model: model.fetch({concept: 31})
            });

            view.render();
            dom.html(view.el);
        });
    }
});
