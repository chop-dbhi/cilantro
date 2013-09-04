define [
    '../core'
    'tpl!templates/report/dialog.html'
], (c, templates...) ->

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


        render: ->
            @$el.html(@template)


    {ModalRegion, ReportDialog}
