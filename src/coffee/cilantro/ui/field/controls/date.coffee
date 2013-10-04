define [
    'underscore'
    './range'
], (_, range) ->

    class DateControl extends range.RangeControl
        # Add the change event from the datepickers to existing range events
        _events:
            'changeDate .datepicker': 'change'

        initialize: ->
            super

            @events = _.extend({}, @_events, @events)

        onRender: ->
            super
            # Initialize the datepickers and make them close automatically
            @ui.lowerBound.datepicker({'autoclose': true})
            @ui.upperBound.datepicker({'autoclose': true})

        # Convert the lower bound to a date for use in the getValue() method
        getLowerBoundValue: ->
            return @ui.lowerBound.datepicker('getFormattedDate')

        # Convert the upper bound to a date for use in the getValue() method
        getUpperBoundValue: ->
            return @ui.upperBound.datepicker('getFormattedDate')

        parseMinStat: (value) ->
            return @parseMaxStat(value)
        parseMaxStat: (value) ->
            # The date string parser apparently has issues with dashes. If we
            # leave the dashes in, a date of 2009-06-21 will be parsed as
            # June 20th 2009 so we replaces the dashes with slashes to get the
            # date to parse it as we expect it to, that is, June 21st 2009.
            return value.replace(/-/g, "/")

        # Override the default behavior so the date is formatted correctly
        # for use in the placeholder.
        setLowerBoundPlaceholder: (value) ->
            date = new Date(value)

            # We want to display the date in mm/dd/yyyy format. Also, since
            # months are 0 based, we need to add one there when formatting the
            # date string for placeholder use.
            dateStr = "#{date.getMonth() + 1}/#{date.getDate()}/#{date.getFullYear()}"

            @ui.lowerBound.attr('placeholder', dateStr)

        # We need to override the default behavior here so that the value is
        # applied to the datepicker rather than the textbox. The datepicker
        # will handle the updating of the textbox.
        setLowerBoundValue: (value) ->
            @ui.lowerBound.datepicker('setDate', new Date(value))

        # Override the default behavior so the date is formatted correctly
        # for use in the placeholder.
        setUpperBoundPlaceholder: (value) ->
            date = new Date(value)

            # We want to display the date in mm/dd/yyyy format. Also, since
            # months are 0 based, we need to add one there when formatting the
            # date string for placeholder use.
            dateStr = "#{date.getMonth() + 1}/#{date.getDate()}/#{date.getFullYear()}"

            @ui.upperBound.attr('placeholder', dateStr)

        # We need to override the default behavior here so that the value is
        # applied to the datepicker rather than the textbox. The datepicker
        # will handle the updating of the textbox.
        setUpperBoundValue: (value) ->
            @ui.upperBound.datepicker('setDate', new Date(value))


    {DateControl}
