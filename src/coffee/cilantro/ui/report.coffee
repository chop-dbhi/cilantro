define [
    '../core'
    '../models/query'
    'tpl!templates/report/dialog.html'
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


    class ReportDialog extends c.Backbone.View
        template: templates.dialog

        model: query.QueryModel

        initialize: ->
            @render()

        render: ->
            @$el.html(@template)

        onShow: =>
            if @model? and @model.name?
                $('#report-name').val(@model.name)
                $('#report-description').val(@model.description)
                $('#report-emails').val(@model.emails)

            else
                # Remove timezone info from the current date and then use it as
                # the suffix for new report title.
                fields = Date().toString().split(' ')
                name = "Report on #{fields[0]} #{fields[1]} #{fields[2]} #{fields[3]} #{fields[4]}"
                $('#report-name').val(name)

    {ModalRegion, ReportDialog}
