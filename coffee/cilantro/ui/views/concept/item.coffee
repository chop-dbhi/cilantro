define ['../../core'], (c) ->

    compiled = c._.template '
        <h4 class=name><%= data.name %>
        <% if (data.category) { %>
            <small><%= data.category.name %></small>
        <% } %>
        </h4>
        <% if (data.description) { %>
            <p class=description><%= data.description %></p>
        <% } %>
    ', null, variable: 'data'

    class Concept extends c.Marionette.ItemView
        className: 'concept'

        template: (data) ->
            if not data.description
                data.description = data.fields[0].description
            compiled data


    { Concept }
