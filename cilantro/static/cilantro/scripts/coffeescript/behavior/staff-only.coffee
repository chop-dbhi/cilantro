define [
    'jquery'
    'plugins/bootstrap'
], ($) ->

    $('body').tooltip
        title: 'This is unpublished content and viewable only by staff'
        selector: '.staff-only'
        placement: ->
            @$element.attr('data-placement') or 'top'
        
