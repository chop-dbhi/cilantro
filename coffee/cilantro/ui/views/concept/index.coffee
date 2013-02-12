define ['../../core', './item'], (c, items) ->

    class ConceptIndexItem extends items.Concept
        events:
            'click a': 'click'

        subscribers:
            'conceptform/active': 'activate'
            'conceptform/inactive': 'inactivate'

        # Events
        click: (event) ->
            event.preventDefault()
            c.publish 'concept/active', @model.id

        # State changes
        activate: (id) =>
            if id is @model.id
                @$el.addClass 'active'
            else
                @$el.removeClass 'active'

        inactivate: (id) =>
            if id is @model.id then @$el.removeClass 'active'


    class ConceptIndex extends c.Marionette.CollectionView
        className: 'concept-index'
        itemView: ConceptIndexItem


    { ConceptIndex, ConceptIndexItem }

    ###
    id: 'data-filters-accordian'

    className: 'accordian'

    events:
        'click .accordian-toggle': 'toggleCaret'

    groupTemplate: c._.template '
        <div class=accordian-group>
            <div class=accordian-heading>
                <a class=accordian-toggle data-toggle=collapse href="#category-{{ id }}">{{ name }}</a>
                <b class="caret closed"></b>
            </div>
            <div id="category-{{ id }}" class="accordian-body collapse">
                <ul class="nav nav-list"></ul>
            </div>
        </div> 
    '

    initialize: ->
        @$el.addClass 'loading'

        @collection.when =>
            @$el.removeClass 'loading'
            @render()
            @collection.each (model, i) ->
                if model.get 'queryview'
                    new QueryView model: model

    render: ->
        tree = categories: []

        for model in @collection.models
            if not model.get 'queryview' then continue
            attrs = model.attributes

            cat = null
            sub = id: null

            if attrs.category
                if attrs.category.parent
                    cat = attrs.category.parent
                    sub = attrs.category
                else
                    cat = attrs.category
                
            if not (subtree = tree[cat.id])
                tree.categories.push cat
                subtree = tree[cat.id] = categories: []
            if not (models = subtree[sub.id])
                if sub.id then subtree.categories.push sub
                models = subtree[sub.id] = []

            # Models will be sorted relative to their groups later
            models.push model


        # Build the DOM tree
        cats = c._.sortBy tree.categories, 'order'
        if tree[null] then cats.push null

        # Process each category in the tree
        for cat in cats
            if not cat
                cat = id: null, name: 'Other'

            $group = c.dom @groupTemplate cat
            @$el.append $group
            $list = $group.find '.accordian-body ul'

            subtree = tree[cat.id]
            subcats = c._.sortBy subtree.categories, 'order'
            if subtree[null] then subcats.push null

            # Process each category in the subtree
            for sub in subcats
                if sub
                    id = sub.id
                    name = sub.name
                else
                    id = null
                    name = 'Other'

                # Add section header in group list
                $list.append "<li class=nav-header>#{ name }</li>"
                $list.append "<li class=divider>#{ name }</li>"

                models = subtree[id]

                for model in models
                    view = new ConceptItemView model: model
                    $list.append view.render()

            if subcats.length is 1
                $list.find('.nav-header').remove()
                $list.find('.divider').remove()
                
        # Single category items, hide the only group
        # heading for simplicity
        if cats.length is 1
            $group.find('.accordian-heading').remove()
            $group.find('.accordian-body').removeClass('collapse')

        return @$el

    toggleCaret: (event) ->
        target = c.dom(event.target)
        target.siblings('.caret').toggleClass('closed')
###
