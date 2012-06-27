# General views

define [
    'environ'
    'jquery'
    'underscore'
    'backbone'
], (environ, $, _, Backbone) ->

    class Container extends Backbone.View
        template: _.template '
            <div class=area-container>
                <h3 class=heading></h3>
                <div class=content></div>
            </div>
        '

        initialize: ->
            @setElement @template()
            @heading = @$el.find '.heading'
            @content = @$el.find '.content'


    { Container }
