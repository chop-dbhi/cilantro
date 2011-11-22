define ['jquery', 'underscore'], ($, _) ->
    return {
        columns: _.template '
            <div data-model="category" data-id="<%= id %>">
                <h4><%= name %> <a class="ht add-all" href="#<%= id %>">Add All</a></h4>
                <ul>
                    <% for (var e,k=0; k<columns.length; k++) { %>
                        <% e = columns[k]; %>
                        <li class="active" data-model="column" data-id="<%= e.id %>">
                            <a class="fr ht add-column" href="#<%= e.id %>">Add</a>
                            <%= e.name %>
                            <% if (e.description) { %><p class="ht mg"><%= e.description %></p><% } %>
                        </li>
                    <% } %>
                </ul>
            </div>
        '

        active_columns: _.template '
            <li data-model="column" data-id="<%= id %>">
                <a class="fr ht remove-column" href="#<%= id %>">Remove</a>
                <%= name %>
                <% if (description) { %><p class="ht mg"><%= description %></p><% } %>
            </li>
        '

        header: _.template '<th data-model="column" data-id="<%= id %>"
            class="header <%= direction %>"><span><%= name %></span></th>'

        row: _.template '
            <tr>
                <% for(var k=1; k < data.length; k++) { %>
                    <td><%= data[k] %></td>
                <% } %>
            </tr>
        '

        pages: _.template '
            <% if (page > 1) { %>
                <span>&laquo; <a href="#1">First</a></span>
                <% if (page > 2) { %>
                    <span>&lsaquo; <a href="#<%= page-1 %>">Previous</a></span>
                <% } %>
            <% } %>

            <% for (var e,k=0; k<pages.length;k++) { %>
                <% e = pages[k]; %>
                <% if (page == e) { %>
                    <strong><%= e %></strong>
                <% } else { %>
                    <% if (e) { %>
                        <a href="#<%= e %>"><%= e %></a>
                    <% } else { %>
                        <span>...</span>
                    <% } %>
                <% } %>
            <% } %>

            <% if (page < num_pages) { %>
                <% if (page < num_pages - 1) { %>
                    <span><a href="#<%= page+1 %>">Next</a> &rsaquo;</span>
                <% } %>
                <span><a href="#<%= num_pages %>">Last</a> &raquo;</span>
            <% } %>
        '
    }
