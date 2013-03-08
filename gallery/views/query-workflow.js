define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.QueryWorkflow;
    return function(dom, navigator) {
        navigator.collapse();
        dom.html(view.el);
    }
});
