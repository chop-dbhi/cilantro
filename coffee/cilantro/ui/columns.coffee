define [
    './core'
], (c) ->

    class Columns extends c.Backbone.View

        template: c._.template '
            <div id=columns-modal class="modal fade">
                <div class=modal-header>
                    <a class=close data-dismiss=modal>×</a>
                    <h3>Data Columns</h3>
                </div>
                <div class=modal-body>
                    <ul class="available-columns span5"></ul>
                    <ul class="selected-columns span5"></ul>
                </div>
                <div class=modal-footer>
                    <button data-save class="btn btn-primary">Save</button>
                    <button data-close class=btn>Close</button>
                </div>
            </div>
        '

        availableItemTemplate: c._.template '
            <li data-id={{ id }}>
                {{ name }}
                <span class=controls>
                    <button class="btn btn-success btn-mini">+</button>
                </span>
            </li>
        '

        selectedItemTemplate: c._.template '
            <li data-id={{ id }}>
                {{ name }}
                <span class=controls>
                    <button class="btn btn-danger btn-mini">-</button>
                </span>
            </li>
        '

        events:
            'click [data-close]': 'hide'
            'click [data-save]': 'save'
            'click .available-columns button': 'clickAdd'
            'click .selected-columns button': 'clickRemove'

        deferred:
            'add': false
            'remove': false

        initialize: ->
            super

            @setElement @template()

            @$available = @$ '.available-columns'
            @$selected = @$('.selected-columns').sortable
                cursor: 'move'
                forcePlaceholderSize: true
                placeholder: 'placeholder'

            @$el.addClass 'loading'
            @collection.when =>
                @$el.removeClass 'loading'
                @render()
                @resolve()

            c.subscribe Serrano.VIEW_SYNCED, (model) =>
                if model.isSession() and (json = model.get('json'))
                    @add id for id in json.columns
                return

        render: =>
            availableHtml = []
            selectedHtml = []

            for model in @collection.filter((model) -> model.get('formatter_name'))
                availableHtml.push @availableItemTemplate model.attributes
                selectedHtml.push @selectedItemTemplate model.attributes

            @$available.html availableHtml.join ''
            @$selected.html selectedHtml.join ''
            return @

        show: ->
            @$el.modal 'show'

        hide: ->
            @$el.modal 'hide'

        save: ->
            @hide()
            ids = c.dom.map @$selected.children(), (elem) ->
                if (data = c.dom(elem).data()).selected and data.id
                    return data.id

            c.publish Serrano.VIEW_COLUMNS, ids

        add: (id) =>
            @$available
                .find("[data-id=#{ id }]")
                .closest('li')
                .hide()

            # Re-append the item to the botton of the list
            @$selected
                .find("[data-id=#{ id }]")
                .appendTo(@$selected)
                .show()
                .data('selected', true)

        remove: (id) =>
            @$selected
                .find("[data-id=#{ id }]")
                .hide()
                .data('selected', false)

            @$available
                .find("[data-id=#{ id }]")
                .closest('li')
                .show()

        clickAdd: (event) ->
            event.preventDefault()
            @add c.dom(event.target).closest('li').data 'id'

        clickRemove: (event) ->
            event.preventDefault()
            @remove c.dom(event.target).closest('li').data 'id'
