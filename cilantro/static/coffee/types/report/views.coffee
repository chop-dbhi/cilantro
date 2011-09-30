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

            elements:
                '[name=name]': 'name'
                '[name=description]': 'description'
                '.save': 'saveButton'
                '.delete': 'deleteButton'
                '.cancel': 'cancelButton'

            events:
                'click .save': 'save'
                'click .delete': 'delete'
                'click .cancel': 'cancel'

            initialize: ->
                @el.appendTo('body').dialog
                    dialogClass: 'ui-dialog-simple'
                    autoOpen: false
                    modal: true
                    resizable: false
                    draggable: true
                    position: ['center', 150]
                    width: 500

            save: ->
                @activeModel.set
                    name: @name.val()
                    description: @description.val()
                @activeModel.save()
                delete @activeModel
                @el.dialog('close')

            cancel: ->
                delete @activeModel
                @el.dialog('close')

            delete: ->
                @activeModel.destroy()
                delete @activeModel
                @el.dialog('close')


        ReportEditorMixin =
            showEditor: (model=@model) ->
                if not model.id then @editor.deleteButton.hide() else @editor.deleteButton.show()
                @editor.name.val model.get 'name'
                @editor.description.val model.get 'description'
                @editor.activeModel = model
                @editor.el.dialog 'open'

            edit: (evt) ->
                @showEditor()
                return false



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
                    @controls.slideDown(200)
                , 300
                return false

            hideControls: (evt) ->
                clearTimeout @_controlsTimer
                @controls.slideUp(300)
                return false

            copy: (evt) ->
                copy = @model.clone()
                copy.set('id', null)
                copy.set 'name', copy.get('name') + ' (copy)'
                @showEditor copy
                @editor.name.select()
                return false


        class ReportList extends CollectionViews.View
            el: '#report-list'

            viewClass: ReportItem

            defaultContent: '<div class="info">You have no saved reports.
                <a id="open-report-help" href="#">Learn more</a>.</div>'

            initialize: (options) ->
                @editor = options.editor
                super

            add: (model) ->
                view = super
                view.editor = @editor
                return view

        # view representing primary element for the session's report name
        class ReportName extends Backbone.View
            el: '#report-name'

            events:
                'click': 'edit'
                'mouseover': 'hover'
                'mouseout': 'hover'

            initialize: (options) ->
                @editor = options.editor
                @model.bind 'change:name', @render
                @hoverText = $('<span class="info">click to edit</span>');

            render: =>
                if (name = @model.get 'name')
                    @el.removeClass 'placeholder'
                    @el.append(@hoverText.hide())
                else
                    @el.addClass 'placeholder'
                    name = @model.defaults.name
                    @hoverText.detach()

                # add a space between the hover text and the name
                @el.prepend name + ' '

            hover: -> @hoverText.toggle()

        # include various mixins into defined classes...
        utils.include ReportItem, ReportEditorMixin
        utils.include ReportList, CollectionViews.ExpandableListMixin
        utils.include ReportName, ReportEditorMixin

        return {
            Name: ReportName
            Item: ReportItem
            List: ReportList
            Editor: ReportEditor
        }
