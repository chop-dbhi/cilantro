define [
    '../core'
    './notify'
    'bootstrap'
    'plugins/bootstrap-datepicker'
    'plugins/jquery-ui'
    'plugins/jquery-easing'
    'plugins/jquery-panels'
    'plugins/jquery-scroller'
    'plugins/jquery-stacked'
    'plugins/typeahead'
    'plugins/typeselect'
], (c, notify) ->

    # Initialize notification stream and append it to the main element
    stream = new notify.Notifications
        id: 'notifications'

    $(c.config.get('main'))
        .css('position', 'relative')
        .append(stream.render().el)

    # Attach primary method for creating notifications
    c.notify = stream.notify

    return c
