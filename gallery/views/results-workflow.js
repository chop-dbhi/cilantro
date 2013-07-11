define(['cilantro'], function(c) {

    var frame = new c.structs.Frame(null, null, {
          url: '/mock/data/preview.json'
      }),
      view = new c.ui.ResultsWorkflow({
          model: frame
      });

    return function(dom, navigator) {
        navigator.collapse();
        dom.html(view.el);
        view.render();
        frame.fetch();
    };
});
