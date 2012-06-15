define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    class AppArea extends Backbone.View
        initialize: ->

        load: ->
            @$uniqueCount = $ '<span class=stat></span>'

            mediator.subscribe 'datacontext/change', @updateCount
            App.DataContext.when @updateCount

            $('#subnav .nav.pull-left:first').append $('<li>').html @$uniqueCount

            # Initialize modals
            $('.modal').modal show: false

        updateCount: =>
            count = App.DataContext.session.get 'count'
            pretty = App.utils.intword count
            @$uniqueCount.text(pretty).attr('title', App.utils.intcomma(count))


    App.register false, 'app', new AppArea
