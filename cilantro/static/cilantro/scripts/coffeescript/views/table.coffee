define [
    'environ'
    'mediator'
    'jquery'
    'underscore'
    'backbone'
], (environ, mediator, $, _, Backbone) ->

    class Table extends Backbone.View

        template: _.template '
            <div id=report-container>
                <div id=report-alert class="alert alert-block">
                    <h4 class=alert-heading data-alert-heading></h4>
                    <span data-alert-message></span>
                </div>
                <table id=report-table class="table table-striped">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        '

        events:
            'click tbody tr': 'highlightRow'

        initialize: ->
            @setElement @template()

            @$table = @$ 'table'
            @$thead = @$ 'thead'
            @$tbody = @$ 'tbody'

        setBody: (rows) ->
            html = []
            for row in rows
                html.push '<tr>'
                for data, i in row
                    # Skip the primary key
                    if i is 0 then continue
                    html.push "<td>#{ data }</td>"
                html.push '</tr>'
            @$tbody.html html.join ''

        setHeader: (header) ->
            html = ['<tr>']
            for data in header
                html.push "<th>#{ data }</th>"
            html.push '</tr>'
            @$thead.html html.join ''

        highlightRow: (event) ->
            target = $(event.target).parent()
            target.toggleClass 'highlight'

    return Table
