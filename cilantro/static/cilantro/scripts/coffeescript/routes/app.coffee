define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    # TODO these smaller components should really be broken out and named
    # appropriately.
    class AppArea extends Backbone.View
        load: ->
            @$uniqueCount = $ '<span class=stat></span>'

            mediator.subscribe 'datacontext/change', @updateCount
            App.DataContext.when @updateCount

            @$toolbar = $('<ul>')
                .addClass('nav pull-left')
                .appendTo '#subnav .container-fluid'

            @$toolbar.append $('<li>').html @$uniqueCount

            # Initialize modals
            $('.modal').modal show: false

        updateCount: =>
            count = App.DataContext.session.get 'count'
            pretty = App.utils.toSuffixedNumber count
            commaed = App.utils.toDelimitedNumber count
            @$uniqueCount.text(pretty).attr('title', commaed)
