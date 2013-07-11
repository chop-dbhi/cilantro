define(['cilantro'], function(c) {

    var frame = new c.structs.Frame(null, null, {
          url: '/mock/data/preview.json'
      }),
      table = new c.ui.Table({
          model: frame
      });

    return function(dom, navigator) {
        dom.html(table.el);
        table.render();
        frame.fetch();
    };
});
