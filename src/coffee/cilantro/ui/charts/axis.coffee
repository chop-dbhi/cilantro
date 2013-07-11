define [
    '../core'
], (c) ->

    # Represents a list of possible fields for use with a distribution chart
    class FieldAxis extends c.Marionette.ItemView
        tagName: 'select'

        options:
            enumerableOnly: false

        initialize: ->
            @collection.when @render

        render: =>
            @$el.append '<option value=>---</option>'

            for model in @collection.models
                # No good way to represent large string-based yet
                if model.get 'searchable' then continue
                if @options.enumerableOnly and not model.get 'enumerable'
                    continue
                @$el.append "<option value=\"#{ model.id }\">#{ model.get 'name' }</option>"
            return @$el

        getSelected: ->
            @collection.get parseInt @$el.val()


    { FieldAxis }
