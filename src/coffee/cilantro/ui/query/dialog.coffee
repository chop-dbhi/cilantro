define [
    '../core'
    '../../models/query'
    'tpl!templates/query/dialog.html'
], (c, query, templates...) ->

    templates = c._.object ['dialog'], templates


    class QueryDialog extends c.Marionette.ItemView
        template: templates.dialog

        className: 'modal hide'

        events:
            'click [data-save]': 'saveQuery'

        ui:
            nameGroup: '.query-name-group'
            nameText: '.query-name'
            nameHelp: '.query-name-group .help-inline'
            descriptionText: '.query-description'
            emailText: 'query-emails'

        saveQuery: ->
            # Make sure the name is valid, everything else can be left blank
            if not @ui.nameText.val()
                @ui.nameHelp.show()
                @ui.nameGroup.addClass('error')
                return

            @ui.nameHelp.hide()
            @ui.nameGroup.removeClass('error')

            @$el.modal('hide')

            if not @model?
                @model = new query.QueryModel

            @collection.add(@model)
            @model.save({
                name: @ui.nameText.val(),
                description: @ui.descriptionText.val(),
                usernames_or_emails: @ui.emailText.val(),
                context_json: c.data.contexts.getSession().toJSON().json,
                view_json: c.data.views.getSession().toJSON().json
            })

        onRender: =>
            if @model?
                @ui.nameText.val(@model.get('name'))
                @ui.descriptionText.val(@model.get('description'))
                @ui.emailText.val(@model.get('usernames_or_emails'))

            if @ui.nameText.val() == ""
                # Remove timezone info from the current date and then use it as
                # the suffix for new query title.
                fields = Date().toString().split(' ')
                name = "Query on #{fields[0]} #{fields[1]} #{fields[2]} #{fields[3]} #{fields[4]}"
                @ui.nameText.val(name)

            @$el.modal
                show: false
                keyboard: false
                backdrop: 'static'

    {QueryDialog}
