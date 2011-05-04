/*
 * Load this module and it will look for the '#templates' div. All child
 * elements will be iterated over and will be parsed as jQote templates.
 *
 * An example:
 *
 * <div id="templates">
 *      <script data-name="blog_entry" type="text/x-jqote">
 *          <h2><%= this.title %></h2>
 *          <div><%= this.body %></div>
 *      </script>
 *
 *      <script data-name="comment" type="text/x-jqote">
 *          <p><b><%= this.username %> said:</b><%= this.comment %></p>
 *      </script>
 * </div>
 */

define(
    function() {
        $(function() {
            var templates = {},
                dom = $('#templates').children(),
                len = dom.length;

            for (var t, n, i = 0; i < len; i++) {
                t = $(dom[i]);
                templates[t.attr('data-name')] = $.jqotec(t);
            }
            return templates;
        });
    }
);
