define [
        'cilantro/utils/logging'
    ],

    (Logging) ->

        templates =
            UnsavedReportTemplate:
                '<div class="message-block warning">
                    <div class="content">
                        <strong role="name"><%= name %></strong> has unsaved changes<br>
                        <span class="info">To save it as a new Report, <a href="#">give it a new name</a>.</span>
                    </div><div class="action">Save Report</div>
                </div>'


        class UnsavedReport extends Logging.MessageView
            template: _.template templates.UnsavedReportTemplate

            elements:
                '[role=name]': 'name'

            events:
                'click .action': 'save'

            initialize: ->
                @render()

                @model.bind 'change:name', (model, value) =>
                    @el.find('[role=name]').text(value)

                @model.bind 'change:has_changed', (model, value) =>
                    if value
                        App.hub.publish 'log', @
                    else
                        App.hub.publish 'dismiss', @

            render: ->
                @el = $(@template @model.toJSON())
                @setLocalElements()
                @delegateEvents()
                return @

            save: ->
                @model.save(null, url: @model.get('permalink'))


        return {
            UnsavedReport: UnsavedReport
            templates: templates
        }
