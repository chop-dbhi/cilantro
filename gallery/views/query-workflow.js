define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.QueryWorkflow;
    return function(dom) {
        dom.html(view.el);
    }
});
