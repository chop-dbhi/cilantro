define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'

    'views/columns'
    'views/table'
], (environ, mediator, $, _, Backbone, Columns, Table) ->

    modifyColumnsButton = _.template '<button class=btn title="Show/Hide Columns"><i class=icon-list alt="Show/Hide Columns"></i></button>'

    class ReviewArea extends Backbone.View
        id: '#review-area'

        initialize: ->
            @$el
                .hide()
                .appendTo('#main-area .inner')

            @$toolbar = $('<ul>')
                .addClass('nav pull-right')
                .hide()
                .appendTo '#subnav .container-fluid'

            @columns = new Columns
                collection: App.DataConcept

            @columns.$el
                .appendTo('body')

            $modifyColumns = $(modifyColumnsButton()).on 'click', (event) =>
                @columns.show()

            @$toolbar
                .append $modifyColumns

            @table = new Table
            @$el.append @table.el
            @loadData()

            mediator.subscribe 'dataview/change', @loadData
            mediator.subscribe 'datacontext/change', @loadData

        load: ->
            @$el.fadeIn 100
            @$toolbar.fadeIn 100

        unload: ->
            @$el.hide()
            @$toolbar.hide()

        loadData: =>
            @table.$el.addClass 'loading'
            @deferred = Backbone.ajax
                url: environ.absolutePath '/api/data/'

            @deferred
                .done (resp) =>
                    @table.setBody resp.rows
                    @table.setHeader resp.header
                .always =>
                    @table.$el.removeClass 'loading'


    App.register 'review/', 'review', new ReviewArea
