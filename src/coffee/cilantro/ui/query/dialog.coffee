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

        initialize: ->
            @render()

        saveQuery: ->
            # Make sure the name is valid, everything else can be left blank
            if not $('#query-name').val()
                $('#query-name-group .help-inline').show()
                $('#query-name-group').addClass('error')
                return

            $('#query-name-group .help-inline').hide()
            $('#query-name-group').removeClass('error')

            # This class is not the actual modal window, only the contents
            # of the modal itself. The parent is a ModalRegion which is what
            # contains the modal wrapper so we need to hide the modal via this
            # class's parent.
            @$el.parent().modal('hide')

            @model.save({
                name: $('#query-name').val(),
                description: $('#query-description').val(),
                usernames_or_emails: $('#query-emails').val(),
                context_json: c.data.contexts.getSession().attributes.json,
                view_json: c.data.views.getSession().attributes.json
            })

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

            @$el.modal
                show: true
                keyboard: false
                backdrop: 'static'

    {QueryDialog}
