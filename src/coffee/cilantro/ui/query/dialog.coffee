define [
    '../core'
    '../../models/query'
    'tpl!templates/query/dialog.html'
], (c, query, templates...) ->

    templates = c._.object ['dialog'], templates


    class QueryDialog extends c.Marionette.ItemView
        template: templates.dialog

        model: query.QueryModel

        className: 'modal hide'

        events:
            'click [data-save]': 'saveQuery'

        initialize: (options) ->
            if options.model?
                @model = @options.model
            else
                @model = new query.QueryModel

            @collection = options.collection

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

            # This class is not the actual modal window, only the contents
            # of the modal itself. The parent is a ModalRegion which is what
            # contains the modal wrapper so we need to hide the modal via this
            # class's parent.
            @$el.modal('hide')

            @collection.add(@model)
            @model.save({
                name: @ui.nameText.val(),
                description: @ui.descriptionText.val(),
                usernames_or_emails: @ui.emailText.val(),
                context_json: c.data.contexts.getSession().attributes.json,
                view_json: c.data.views.getSession().attributes.json
            })

        onShow: =>
            if @model? and @model.name?
                @ui.nameText.val(@model.name)
                @ui.descriptionText.val(@model.description)
                @ui.emailText.val(@model.emails)

            else
                # Remove timezone info from the current date and then use it as
                # the suffix for new query title.
                fields = Date().toString().split(' ')
                name = "Query on #{fields[0]} #{fields[1]} #{fields[2]} #{fields[3]} #{fields[4]}"
                @ui.nameText.val(name)

            @$el.modal
                show: true
                keyboard: false
                backdrop: 'static'

    {QueryDialog}
