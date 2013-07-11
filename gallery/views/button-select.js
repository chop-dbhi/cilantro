define(['cilantro'], function(c) {

    var empty = new c.ui.ButtonSelect;

    var selected = new c.ui.ButtonSelect({
        size: 'small',
        collection: [
            {value: 'Less Than'},
            {value: 'Less Than or Equal To'},
            {value: 'Between', selected: true},
            {value: 'Equal To'}
        ]
    });

    var labels = new c.ui.ButtonSelect({
        size: 'large',
        placeholder: '<i class=icon-compass> Select...',
        collection: [
            {value: 'north', label: '<i class=icon-hand-up></i> North'},
            {value: 'south', label: '<i class=icon-hand-down></i> South'},
            {value: 'east', label: '<i class=icon-hand-right></i> East'},
            {value: 'west', label: '<i class=icon-hand-left></i> West'},
        ]
    });

    var unselected = new c.ui.ButtonSelect({
        size: 'mini',
        collection: ['Less Than', 'Less Than or Equal To', 'Between', 'Equal To']
    });

    return function(dom) {
        empty.render();
        unselected.render();
        selected.render();
        labels.render();

        dom.html('<h3 class=preview-label>Empty</h3>');
        dom.append(empty.el);

        dom.append('<h3 class=preview-label>No Selection</h3>');
        dom.append(unselected.el);

        dom.append('<h3 class=preview-label>Selection</h3>');
        dom.append(selected.el);

        dom.append('<h3 class=preview-label>Labels</h3>');
        dom.append(labels.el);
    }
});
