define [
    '../core'
], (c) ->

    class Table extends c.Backbone.View

        template: c._.template '
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

            c.dom(window).on 'resize', =>
                @resizePinnedThead()
                @resizeBody()

        setBody: (objects, append=false) ->
            html = []
            for object in objects
                html.push '<tr>'
                for data in object.values
                    if not data then data = '<span class=no-data>(no data)</span>'
                    html.push "<td>#{ data }</td>"
                html.push '</tr>'
            if append
                @$tbody.append html.join ''
            else
                @$tbody.html html.join ''
            @resizeBody()
            @resizePinnedThead()

        setHeader: (header) ->
            html = []
            pinned = []
            for data in header
                th = c.dom "<th data-id=#{ data.id }>#{ data.name }</th>"
                div = c.dom "<div data-id=#{ data.id }>#{ data.name }</div>"
                if data.direction
                    if data.direction is 'desc'
                        th.append $("<i class=icon-chevron-down></i>")
                        div.append $("<i class=icon-chevron-down></i>")
                    else
                        th.append $("<i class=icon-chevron-up></i>")
                        div.append $("<i class=icon-chevron-up></i>")
                    th.data 'direction', data.direction
                    th.addClass data.direction
                    div.data 'direction', data.direction
                    div.addClass data.direction

                html.push th
                pinned.push div

            @$pinnedThead.empty()
            @$thead.html (row = c.dom('<tr>')).append.apply row, html
            @$pinnedThead.append.apply @$pinnedThead, pinned

        # Due to the way table cells size themselves, there is no way
        # in CSS to mimic this sizing behavior. Therefore each time the
        # table data gets updated or the window is resized, this function
        # should be called.
        resizePinnedThead: ->
            theadWidth = @$thead.width()
            @$thead.find('th').each (i, elem) =>
                $elem = c.dom(elem)
                $copy = c.dom(@$pinnedThead.children()[i])
                $copy.css 'width', ($elem.width() / theadWidth * 100) + '%'

        resizeBody: ->
            if (@$table.height() > $('#main-area').height())
                @$el.removeClass 'short'
            else
                @$el.addClass 'short'

        # When not at the top, show the pinned header
        togglePinnedThead: (event) ->
            scrollTop = @$el.scrollTop()
            visible = @$pinnedThead.is(':visible')
            if scrollTop <= 0 and visible
                @$pinnedThead.hide()
            else if not visible
                @$pinnedThead.show()

        highlightRow: (event) ->
            target = c.dom(event.target).parent()
            target.toggleClass 'highlight'

    return Table
