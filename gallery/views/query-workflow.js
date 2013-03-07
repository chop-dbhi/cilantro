define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.QueryWorkflow;
    return function(dom, navigator) {
        navigator.hide(400, function(){ 
            dom.html(view.el);
            $("<div class=btn>Show Nav</div>").insertBefore(navigator).click(function(){
                $(this).remove();
                navigator.show(400, function(){});
            });
        });
    }
});
