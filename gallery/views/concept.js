define(['cilantro', 'cilantro/ui'], function(c) {
    var view = new c.ui.views.Concept({
        model: c.data.concepts.get(2)
    });
    return view;
});
