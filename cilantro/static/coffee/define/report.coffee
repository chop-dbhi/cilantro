    class Report extends Backbone.Model
        url: App.urls.session.report

        defaults:
            description: 'Add a description...'

        initialize: ->
            @defaults.name = @generateReportName()
            if not @get 'name'
                @set 'name', @defaults.name

        generateReportName: ->
            now = new Date()
            "#{now.toLocaleDateString()} @ #{now.toLocaleTimeString()}"



    class ReportView extends Backbone.View
        el: '#report-info'

        events:
            'dblclick h2': 'editName'
            'blur [name=name]': 'showName'
            'dblclick em': 'editDescription'
            'blur [name=description]': 'showDescription'

        elements:
            'h2': 'name'
            '[name=name]': 'nameField'
            'em': 'description'
            '[name=description]': 'descriptionField'

        initialize: ->
            Synapse(@nameField)
                .sync(@model)
                .notify(@name)

            Synapse(@descriptionField)
                .sync(@model)
                .notify(@description)


        editName: =>
            @name.hide()
            @nameField.show().select()

        showName: =>
            @name.show()
            @nameField.hide()

            if not @model.get 'name'
                @model.set name: @model.defaults.name

        editDescription: =>
            @description.hide()
            @descriptionField.show().select()

        showDescription: =>
            @description.show()
            @descriptionField.hide()

            if not @model.get 'description'
                @model.set description: @model.defaults.description


