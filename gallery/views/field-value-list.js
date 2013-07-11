define(['cilantro'], function(c) {
    var view = new c.ui.ValueList;
    view.render();
    return function(dom) {
        dom.html(view.el);
    }
});
