((root, factory) ->
    if typeof define is 'function' and define.amd
        define ['underscore'], factory
    else
        root.grouper = factory root._
) @, (_) ->

    sortedGroupBy = (list, groupBy, sortBy) ->
        if _.isArray(groupBy)
            groupByIter = (obj) ->
                _.map groupBy, (key, value) -> obj[key]
        else
            groupByIter = groupBy

        if _.isArray(sortBy)
            sortByIter = (obj) ->
                _.map sortBy, (key, value) -> obj[key]
        else
            sortByIter = sortBy

        groups = _.groupBy list, groupByIter

        if sortByIter
            _.each groups, (value, key, list) ->
                list[key] = _.sortBy value, sortByIter

        return groups

    renderTable = (groups, keys, sep) ->
        html = []
        sep = sep or ','
        _.each groups, (list, groupKey) ->
            group = $('<div>').addClass('group')
            label = $('<span>').addClass('group-label')
            table = $('<table>').addClass('group-table')
            header = $('<tr>')
            tbody = $('<tbody>')

            if _.isString(groupKey)
                _.each groupKey.split(sep), (tok) ->
                    label.append '<span class=group-key>' + $.trim(tok) + '</span>'
            else
                label.append '<span class=group-key>' + groupKey + '</span>'

            _.each list, (obj, i) ->
                tr = $('<tr>')
                _.each obj, (value, key) ->
                    if keys.indexOf(key) >= 0
                        i is 0
                    else
                        header.append '<th>' + key + '</th>'    if i is 0
                        tr.append '<td>' + value + '</td>'

                tbody.append tr

            $('<thead>').appendTo(table).append header
            table.append tbody
            group.append label, table
            html.push group

        return html

    { sortedGroupBy, renderTable}
