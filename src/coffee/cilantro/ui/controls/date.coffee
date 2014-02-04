define [
    'underscore'
    './range'
], (_, range) ->


    class DateControl extends range.RangeControl
        # Add the change event from the datepickers to existing range events
        _events:
            'changeDate .range-lower,.range-upper': '_change'

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
            @ui.lowerBound.datepicker('getFormattedDate')

        # Convert the upper bound to a date for use in the getValue() method
        getUpperBoundValue: ->
            @ui.upperBound.datepicker('getFormattedDate')

        # The date string parser apparently has issues with dashes. If we
        # leave the dashes in, a date of 2009-06-21 will be parsed as
        # June 20th 2009 so we replaces the dashes with slashes to get the
        # date to parse it as we expect it to, that is, June 21st 2009.
        _parseDate: (value) ->
            if value? then value.replace(/-/g, '/')

        parseMinStat: (value) ->
            @_parseDate(value)

        parseMaxStat: (value) ->
            @_parseDate(value)

        # Sets the placeholder value on the supplied element to the date value
        _setPlaceholder: (element, value) ->
            date = new Date(value)

            # We want to display the date in mm/dd/yyyy format. Also, since
            # months are 0 based, we need to add one there when formatting the
            # date string for placeholder use.
            dateStr = "#{date.getMonth() + 1}/#{date.getDate()}/#{date.getFullYear()}"
            element.attr('placeholder', dateStr)

        # Override the default behavior so the date is formatted correctly
        # for use in the placeholder.
        setLowerBoundPlaceholder: (value) ->
            @_setPlaceholder(@ui.lowerBound, value)

        # Override the default behavior so the date is formatted correctly
        # for use in the placeholder.
        setUpperBoundPlaceholder: (value) ->
            @_setPlaceholder(@ui.upperBound, value)

        # Sets the value of the supplied element to the date value or clears
        # the value of the element if the value or the call to val() is
        # null or empty.
        _setValue: (element, value) ->
            # Since the changeDate event is causing this method to receive a
            # query object we need to read the value of the date here. The
            # setValue method is always getting an array with the .range-lower
            # and .range-upper jquery objects in it so checking for empty
            # values is done here to keep setValue generic.
            dateString = value?.val()

            if dateString? and dateString != ""
                element.datepicker('setDate', new Date(dateString))
            else
                element.datepicker('_clearDate', this)

        # We need to override the default behavior here so that the value is
        # applied to the datepicker rather than the textbox. The datepicker
        # will handle the updating of the textbox.
        setLowerBoundValue: (value) ->
            @_setValue(@ui.lowerBound, value)

        # We need to override the default behavior here so that the value is
        # applied to the datepicker rather than the textbox. The datepicker
        # will handle the updating of the textbox.
        setUpperBoundValue: (value) ->
            @_setValue(@ui.upperBound, value)


    { DateControl }
