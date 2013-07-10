define(['cilantro'], function(c) {
    return function(dom) {
        c.data.contexts.ready(function() {
            var model = c.data.contexts.getSession();
            var view = new c.ui.Context({model: model});
            view.render();
            dom.html(view.el);
        });
    }
});
