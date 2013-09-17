define [
    '../core'
    '../../models/query'
    'tpl!templates/query/dialog.html'
], (c, query, templates...) ->

    templates = c._.object ['dialog'], templates


    class ModalRegion extends c.Marionette.Region
        constructor: ->
            c.Marionette.Region.prototype.constructor.apply(this, arguments)

            @ensureEl()

            @$el.on 'hidden', {region:this}, (event) ->
                event.data.region.close()

        onShow: ->
            @$el.modal('show')

        onClose: ->
            @$el.modal('hide')


    class QueryDialog extends c.Backbone.View
        template: templates.dialog

        model: query.QueryModel

        initialize: ->
            @render()

        render: ->
            @$el.html(@template)

        onShow: =>
            if @model? and @model.name?
                $('#query-name').val(@model.name)
                $('#query-description').val(@model.description)
                $('#query-emails').val(@model.emails)

            else
                # Remove timezone info from the current date and then use it as
                # the suffix for new query title.
                fields = Date().toString().split(' ')
                name = "Query on #{fields[0]} #{fields[1]} #{fields[2]} #{fields[3]} #{fields[4]}"
                $('#query-name').val(name)

    {ModalRegion, QueryDialog}
