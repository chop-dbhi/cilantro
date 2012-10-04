define [
    'jquery'
    'backbone'
], ($, Backbone) ->

    # Handle a few common cases if the server if there are still pending
    # requests or if the max attempts have been made.
    $(window).on 'beforeunload', ->
        if Backbone.ajax.pending
            if App.stats.ajaxAttempts is App.ajax.maxAttempts
                return "Unfortunately, your data hasn't been saved. The server
                    or your Internet connection is acting up. Sorry!"
            return "Wow, you're quick! Your stuff is being saved.
                It will only take a moment."
