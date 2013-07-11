define(['cilantro'], function(c) {

    var view = new c.ui.QueryWorkflow;

    return function(dom, navigator) {
        navigator.collapse();
        view.render();
        dom.html(view.el);
    }
});
