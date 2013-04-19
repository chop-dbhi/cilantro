define(['cilantro.ui'], function(c) {
    var view = new c.ui.ResultsWorkflow;

    return function(dom, navigator) {
        navigator.collapse();
        view.render();
        dom.html(view.el);
    }
});
