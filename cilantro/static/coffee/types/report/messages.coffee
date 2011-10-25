define [
        'cilantro/utils/logging'
    ],

    (Logging) ->

        templates =
            UnsavedReportTemplate:
                '<div class="message-block warning">
                    <div class="content">
                        <strong role="name"><%= name %></strong> has unsaved changes
                    </div>
                    <button class="revert">Revert</button>
                    <button class="save">Save</button>
                </div>'


        class UnsavedReport extends Logging.MessageView
            template: _.template templates.UnsavedReportTemplate

            elements:
                '[role=name]': 'name'

            events:
                'click .save': 'save'
                'click .revert': 'revert'

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
                @model.push()

            revert: ->
                @model.revert()


        return {
            UnsavedReport: UnsavedReport
            templates: templates
        }
