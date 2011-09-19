define [
        'common/utils'
        'common/views/collection'
    ],
            
    (utils, CollectionViews) ->

        class ReportEditor extends Backbone.View
            el: '<div id="report-editor">
                <input type="text" name="name" placeholder="Name...">
                <textarea name="description" placeholder="Description..."></textarea>
                <div class="controls">
                    <button class="delete">Delete</button>
                    <button class="cancel">Cancel</button>
                    <button class="save">Save</button>
                </div>
            </div>'

            initialize: ->
                @el.appendTo('body').dialog
                    dialogClass: 'ui-dialog-simple'
                    autoOpen: false
                    modal: true
                    resizable: false
                    draggable: true
                    position: ['center', 150]
                    width: 500

        class ReportItem extends Backbone.View
            el: '<div>
                    <strong role="name"></strong>
                    <span class="info">- <span role="unique-count"></span> unique patients</span>
                    <span class="info time" style="float: right">modified <span role="modified"></span><span role="timesince"></span></span>
                    <div role="description"></div>
                    <div class="controls"><button class="edit">Edit</button> <button class="copy">Copy</button></div>
                </div>'

            events:
                'click .time': 'toggleTime'
                'click .edit': 'edit'
                'click .copy': 'copy'
                'mouseenter': 'showControls'
                'mouseleave': 'hideControls'
                'click': 'toggleDescription'

            elements:
                '[role=name]': 'name'
                '[role=unique-count]': 'uniqueCount'
                '[role=modified]': 'modified'
                '[role=timesince]': 'timesince'
                '[role=description]': 'description'
                '.controls': 'controls'

            render: ->
                @name.text @model.get 'name'
                @modified.text @model.get 'modified'
                @timesince.text @model.get 'timesince'
                @description.text @model.get 'description'
                @uniqueCount.text @model.get 'unique_count'
                @

            toggleTime: (evt) ->
                @modified.toggle()
                @timesince.toggle()
                evt.stopPropagation()

            toggleDescription: (evt) ->
                if not evt.isPropagationStopped()
                    @description.toggle()

            showControls: (evt) ->
                @_controlsTimer = setTimeout =>
                    @controls.slideDown(300)
                , 300
                return false

            hideControls: (evt) ->
                clearTimeout @_controlsTimer
                @controls.slideUp(300)
                return false

            showEditor: (model=@model) ->
                @editor.el.find('[name=name]').val model.get 'name'
                @editor.el.find('[name=description]').val model.get 'description'
                @editor.el.dialog 'open'

            edit: (evt) ->
                @showEditor()
                return false

            copy: (evt) ->
                copy = @model.clone()
                copy.set 'name', copy.get('name') + ' (copy)'
                @showEditor copy
                @editor.el.find('[name=name]').select()
                return false


        class ReportList extends CollectionViews.View
            el: '#report-list'

            viewClass: ReportItem

            defaultContent: '<div class="info">You have no saved reports.
                <a id="open-report-help" href="#">Learn more</a>.</div>'

            initialize: ->
                @editor = new ReportEditor
                super

            add: (model) ->
                view = super
                view.editor = @editor
                return view

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
