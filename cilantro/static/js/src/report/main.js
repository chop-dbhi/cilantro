// report/main

define(['cilantro/report/table', 'cilantro/report/columns'],

    function(m_table, m_columns) {

        $(function() {

            m_columns.init();
            m_table.init();

            var e = $('#export-data');

            e.bind('click', function() {
                e.attr('disabled', true);
                window.location = API_URLS.report + '?f=csv';
                setTimeout(function() {
                    e.attr('disabled', false);
                }, 5000);
                return false;
            });
        });

    }
);
