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
                    <button class="cancel">Cancel</button>
                    <button class="save">Save</button>
                </div>
            </div>'

            elements:
                '[name=name]': 'name'
                '[name=description]': 'description'
                '.save': 'saveButton'
                '.cancel': 'cancelButton'

            events:
                'click .save': 'save'
                'click .cancel': 'cancel'

            initialize: ->
                App.hub.subscribe 'report/edit', @editHandler

                @el.appendTo('body').dialog
                    dialogClass: 'ui-dialog-simple'
                    autoOpen: false
                    modal: true
                    resizable: false
                    draggable: true
                    position: ['center', 150]
                    width: 500

            editHandler: (model) =>
                @name.val model.get 'name'
                @description.val model.get 'description'
                @activeModel = model
                @el.dialog 'open'

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


        ReportEditorMixin =
            edit: (evt, model=@model) ->
                App.hub.publish 'report/edit', model
                return false



        class ReportItem extends Backbone.View
            el: '<section class="report">
                    <a role="name"></a>
                    <span class="info">- <span role="unique-count"></span> unique patients</span>
                    <span class="info time" style="float: right">modified <span role="modified"></span><span role="timesince"></span></span>
                    <div role="description"></div>
                    <div class="controls">
                        <button class="delete">Delete</button>
                        <button class="edit">Edit</button>
                        <button class="copy">Copy</button>
                    </div>
                </section>'

            events:
                'click .time': 'toggleTime'
                'click .edit': 'edit'
                'click .copy': 'copy'
                'click .delete': 'delete'
                'mouseenter': 'showControls'
                'mouseleave': 'hideControls'

            elements:
                '[role=name]': 'name'
                '[role=unique-count]': 'uniqueCount'
                '[role=modified]': 'modified'
                '[role=timesince]': 'timesince'
                '[role=description]': 'description'
                '.controls': 'controls'

            render: ->
                @name.text @model.get 'name'
                @name.attr 'href', @model.get 'url'
                @modified.text @model.get 'modified'
                @timesince.text @model.get 'timesince'
                if not (description = @model.get 'description')
                    description = 'No description provided'
                @description.text description
                @uniqueCount.text @model.get 'unique_count'
                @

            toggleTime: (evt) ->
                @modified.toggle()
                @timesince.toggle()
                evt.stopPropagation()

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
                # set a 'hidden' id of the reference
                copy.set '_id', @model.id
                # XXX a bit of a hack to get the ``url`` method
                copy.collection = @model.collection
                @edit evt, copy
                return false

            delete: -> @model.destroy()


        class ReportList extends CollectionViews.View
            el: '#report-list'

            viewClass: ReportItem

            defaultContent: '<section class="info">You have no saved reports.</section>'
            # Temporarily removed this: <a id="open-report-help" href="#">Learn more</a>


        # view representing primary element for the session's report name
        class ReportName extends Backbone.View
            el: '#report-name'

            events:
                'click': 'edit'
                'mouseover': 'hover'
                'mouseout': 'hover'

            initialize: (options) ->
                @model.bind 'change:name', @render
                @hoverText = $('<span class="info">click to edit</span>')

            render: =>
                @el.text ''
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
