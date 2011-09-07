define ['common/models/polling'], (polling) ->

    class Report extends polling.Model
        url: App.urls.session.report

        defaults:
            name: 'click to add a name...'
            description: 'click to add a description...'

        toJSON: ->
            attrs = super
            attrs.perspective = attrs.perspective?.id or null
            attrs.scope = attrs.scope?.id or null
            return attrs

        initialize: ->
            @bind 'change', ->
                @unbind 'change'
                @bind 'change', @save


    class ReportName extends Backbone.View
        el: '#report-name'

        events:
            'click span': 'edit'
            'blur [name=name]': 'show'
            'keypress [name=name]': 'enter'

        elements:
            'span': 'name'
            '[name=name]': 'nameInput'

        initialize: ->
            @model.bind 'change', @render

        render: =>
            if (name = @model.get 'name')
                @name.removeClass 'placeholder'
            else
                @name.addClass 'placeholder'
                name = @model.defaults.name

            @name.text name

        edit: =>
            # temporarily stop polling, so the user's input does not get overriden
            @model.stopPolling()

            @name.hide()
            @nameInput.show().select()

        show: (event) =>
            # ensure it's a non-empty, non-all whitespace value
            if (name = @nameInput.val()) and not /^\s*$/.test name
                @model.set name: name
                @render()

            @name.show()
            @nameInput.hide()

            # resume polling
            @model.startPolling()

        enter: (event) =>
            @show() if event.which is 13


    class ReportInfo extends Backbone.View
        el: '#report-info'

        events:
            'click p': 'editDescription'
            'blur [name=description]': 'showDescription'

        elements:
            'p': 'description'
            '[name=description]': 'descriptionInput'

        initialize: ->
            if @model.id and @model.get('has_changed') then @el.addClass 'unsaved'

        editDescription: =>
            @description.hide()
            @descriptionInput.show().select()

        showDescription: =>
            if not @model.get 'description'
                @model.set description: @model.defaults.description
                @description.addClass 'placeholder'
            else
                @description.removeClass 'placeholder'

            @description.show()
            @descriptionInput.hide()


    return {
        Model: Report
        NameView: ReportName
        InfoView: ReportInfo
    }
