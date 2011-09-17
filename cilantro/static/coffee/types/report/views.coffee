define [
        'common/utils'
        'common/views/collection'
    ],
            
    (utils, CollectionViews) ->

        class ReportItem extends Backbone.View
            el: '<div><strong role="name"></strong>
                <span class="info">- modified <span role="modified"></span>
                <span role="timesince"></span></span></div>'

            events:
                'click .info': 'toggleTime'

            elements:
                '[role=name]': 'name'
                '[role=modified]': 'modified'
                '[role=timesince]': 'timesince'

            render: ->
                @name.text @model.get 'name'
                @modified.text @model.get 'modified'
                @timesince.text @model.get 'timesince'
                @

            toggleTime: ->
                @modified.toggle()
                @timesince.toggle()


        class ReportList extends CollectionViews.View
            el: '#report-list'

            viewClass: ReportItem

            defaultContent: '<div class="info">You have no saved reports.
                <a id="open-report-help" href="#">Learn more</a>.</div>'

        # include the expandable list functionality..
        utils.include ReportList, CollectionViews.ExpandableListMixin


        # view representing primary element for the session's report name
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

        # view representing primary element for the session's report name
#        class ReportInfo extends Backbone.View
#            el: '#report-info'
#
#            events:
#                'click p': 'editDescription'
#                'blur [name=description]': 'showDescription'
#
#            elements:
#                'p': 'description'
#                '[name=description]': 'descriptionInput'
#
#            initialize: ->
#                if @model.id and @model.get('has_changed') then @el.addClass 'unsaved'
#
#            editDescription: =>
#                @description.hide()
#                @descriptionInput.show().select()
#
#            showDescription: =>
#                if not @model.get 'description'
#                    @model.set description: @model.defaults.description
#                    @description.addClass 'placeholder'
#                else
#                    @description.removeClass 'placeholder'
#
#                @description.show()
#                @descriptionInput.hide()

        return {
            Name: ReportName
            Item: ReportItem
            List: ReportList
        }
