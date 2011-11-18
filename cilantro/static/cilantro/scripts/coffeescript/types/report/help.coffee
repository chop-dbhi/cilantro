define [
    'backbone'
], (Backbone) ->

    class ReportHelpModal extends Backbone.View
        title: 'Learn about Reports'

        content: '<div class="content">
            <section>Hello World</section>
            </div>'

        loadContent: null

        initialize: (options) ->
            if @loadContent
                @el.load @loadContent
            else
                @el.html @content

            @el.dialog
                autoOpen: false
                modal: true
                resizable: false
                draggable: false
                title: @title

            if options.trigger
                @$(options.trigger).click =>
                    @el.dialog('open')
                    return false

    return {
        Modal: ReportHelpModal
    }
