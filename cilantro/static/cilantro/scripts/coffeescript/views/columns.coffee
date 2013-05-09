define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    class Columns extends Backbone.View

        template: _.template '
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

        availableItemTemplate: _.template '
            <li data-id={{ id }}>
                {{ name }}
                <span class=controls>
                    <button class="btn btn-success btn-mini">+</button>
                </span>
            </li>
        '

        selectedItemTemplate: _.template '
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

        initialize: ->
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

            $.when App.DataView, @collection, =>
                if (json = App.DataView.session.get 'json')
                    @add id for id in json.concepts
                return

        render: =>
            availableHtml = []
            selectedHtml = []

            for model in @collection.filter((model) -> model.get('formatter'))
                availableHtml.push @availableItemTemplate model.attributes
                selectedHtml.push @selectedItemTemplate model.attributes

            @$available.html availableHtml.join ''
            @$selected.html selectedHtml.join ''
            return @

        showAvailableControls: (event) ->
            clearTimeout @_availableControlsTimer
            @$available.find('.controls').fadeIn 100

        hideAvailableControls: (event) ->
            clearTimeout @_availableControlsTimer
            @_availableControlsTimer = _.delay =>
                @$available.find('.controls').fadeOut 100
            , 300

        showSelectedControls: (event) ->
            clearTimeout @_selectedControlsTimer
            @$selected.find('.controls').fadeIn 100

        hideSelectedControls: (event) ->
            clearTimeout @_selectedControlsTimer
            @_selectedControlsTimer = _.delay =>
                @$selected.find('.controls').fadeOut 100
            , 300
        
        show: ->
            @$el.modal 'show'

        hide: ->
            @$el.modal 'hide'

        save: ->
            @hide()
            ids = $.map @$selected.children(), (elem) ->
                if (data = $(elem).data()).selected
                    return data.id

            json = App.DataView.session.get('json') or {}
            json.concepts = ids
            App.DataView.session.save 'json', json

        add: (id) =>
            @$available
                .find("[data-id=#{ id }]")
                .closest('li')
                .hide()

            # Re-append the item to the botton of the list
            @$selected
                .find("[data-id=#{ id }]")
                .detach()
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
            @add $(event.target).closest('li').data 'id'

        clickRemove: (event) ->
            event.preventDefault()
            @remove $(event.target).closest('li').data 'id'
