define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    class AppArea extends Backbone.View
        load: ->
            @$uniqueCount = $ '<span class=stat></span>'

            App.DataContext.when @updateCount

            @$toolbar = $('<ul>')
                .addClass('nav pull-left')
                .appendTo '#subnav .container-fluid'

            @$toolbar.append $('<li>').html @$uniqueCount

            mediator.subscribe 'datacontext/syncing', =>
                @$uniqueCount.addClass 'loading'

            mediator.subscribe 'datacontext/synced', @updateCount


        updateCount: =>
            @$uniqueCount.removeClass 'loading'
            count = App.DataContext.session.get 'count'
            if count?
                pretty = App.utils.toSuffixedNumber count
                commaed = App.utils.toDelimitedNumber count
                @$uniqueCount.text(pretty).attr('title', commaed)
            else
                @$uniqueCount.html('&infin;')
