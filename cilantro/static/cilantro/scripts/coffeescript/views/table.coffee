define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    class Table extends Backbone.View

        template: _.template '
            <div id="report-container">
                <div id="report-alert" class="alert alert-block">
                    <h4 class="alert-heading" data-alert-heading></h4>
                    <span data-alert-message></span>
                </div>
                <table id="report-table" class="table table-striped">
                    <div class="pinned-thead"></div>
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        '

        events:
            'scroll': 'togglePinnedThead'
            'click tbody tr': 'highlightRow'

        initialize: ->
            @setElement @template()

            @$table = @$ 'table'
            @$thead = @$ 'thead'
            @$tbody = @$ 'tbody'
            @$pinnedThead = @$ '.pinned-thead'

            $(window).on 'resize', =>
                @resizePinnedThead()

        setBody: (rows, append=false) ->
            html = []
            for row in rows
                html.push '<tr>'
                for data, i in row
                    # Skip the primary key
                    if i is 0 then continue
                    if not data then data = '<span class=no-data>(no data)</span>'
                    html.push "<td>#{ data }</td>"
                html.push '</tr>'
            if append
                @$tbody.append html.join ''
            else
                @$tbody.html html.join ''
            @resizePinnedThead()

        setHeader: (header) ->
            html = ['<tr>']
            pinned = []
            for data in header
                html.push "<th>#{ data }</th>"
                pinned.push "<div>#{ data }</div>"
            html.push '</tr>'

            @$thead.html html.join ''
            @$pinnedThead.html pinned.join ''

        # Due to the way table cells size themselves, there is no way
        # in CSS to mimic this sizing behavior. Therefore each time the
        # table data gets updated or the window is resized, this function
        # should be called.
        resizePinnedThead: ->
            theadWidth = @$thead.width()
            @$thead.find('th').each (i, elem) =>
                $elem = $(elem)
                $copy = $(@$pinnedThead.children()[i])
                $copy.css 'width', ($elem.width() / theadWidth * 100) + '%'

        # When not at the top, show the pinned header
        togglePinnedThead: (event) ->
            scrollTop = @$el.scrollTop()
            visible = @$pinnedThead.is(':visible')
            if scrollTop <= 0 and visible
                @$pinnedThead.hide()
            else if not visible
                @$pinnedThead.show()

        highlightRow: (event) ->
            target = $(event.target).parent()
            target.toggleClass 'highlight'

    return Table
