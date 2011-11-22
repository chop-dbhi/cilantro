// report/table

define(['jquery', 'cilantro/rest/datasource', 'cilantro/rest/renderer', 'cilantro/pages/report/templates'],

    function($, m_datasource, m_renderer, m_templates) {

        function init() {
            var firstRequest = true;

            var body = $('body'),                       // event binding
                content = $('#content'),                // resizing
                report = $('#report'),                  // event binding, resizing, unhiding
                info = $('#report-info'),               // unhiding
                actions = $('#actions'),
                details = $('#details'),         // unhiding
                toolbars = report.find('.toolbar'),     // unhiding
                table = $('#table'),                    // resizing, unhiding
                thead = table.find('thead tr'),         // event delegation, data loading
                tbody = table.find('tbody'),            // data loading
                per_page = $('.per-page'),              // data loading
                pages = $('.page-links'),               // data loading
                unique = $('#report-unique'),            // data loading
                count = $('#report-count'),                    // data loading
                noResults = $('#no-results');

            /*
             * The renderers necessary for rendering the response data into HTML
             * templates.
             *
             * ``table_header`` - renders the table header that displays column
             * names and the column ordering.
             *
             * ``table_rows`` - renders the table rows that displays the data.
             *
             * ``pages`` - renders the page links relative the entire result
             * set.
             */
            var rnd = {
                table_header: new m_renderer.template({
                    target: thead,
                    template: m_templates.header
//                    replace: 'append'
                }),
                table_rows: new m_renderer.template({
                    target: tbody,
                    template: m_templates.row
                }),
                pages: new m_renderer.template({
                    target: pages,
                    template: m_templates.pages
                })
            };


            /*
             * The data sources which make requests and handles the body of the
             * response.
             *
             * ``table_header`` - requests the latest header data.
             *
             * ``table_rows`` - requests the latest results for the report in
             * view.
             */
            var src = {
                scope_info: new m_datasource.ajax({
                    ajax: {
                        url: App.endpoints.session.scope,
                        success: function(json) {
                            if (json.conditions) {
                                var t = '';
                                if (typeof json.conditions === 'string') {
                                    t = '<li>' + json.text + '</li>';
                                } else {
                                    var conditions = json.conditions;
                                    for (var i=0; i < conditions.length; i++)
                                        t += '<li>' + conditions[i].condition + '</li>';
                                }
                                details.html(t);
                            }
                        }
                    }
                }),

                table_header: new m_datasource.ajax({
                    ajax: {
                        url: App.endpoints.session.perspective,
                        success: function(json) {
                            rnd.table_header.render(json.header);
                        }
                    }
                }),

                table_rows: new m_datasource.ajax({
                    ajax: {
                        url: App.endpoints.session.report,
                        data: {data: 1},
                        beforeSend: function() {
                            report.block();
                        },
                        complete: function() {
                            report.unblock();
                        },
                        success: function(json) {
                            if (json.unique !== null) {
                                if (json.unique.toString() !== unique.text())
                                    unique.parent().effect('highlight', 1000);
                                unique.text(json.unique);
                            }

                            if (json.count !== null) {
                                if (json.count.toString() !== count.text())
                                    count.parent().effect('highlight', 1000);
                                count.text(json.count);
                            }

                            if (json.count === 0) {
                                table.hide();
                                toolbars.hide();
                                noResults.show();
                                actions.hide();
                                return;
                            } else {
                                noResults.hide();
                                table.show();
                                actions.show();
                                toolbars.show();
                            }

                            rnd.table_rows.render(json.rows);

                            if (json.pages) {
                                rnd.pages.render(json.pages);
                                rnd.pages.target.show();
                            } else {
                                rnd.pages.target.hide();
                            }

                            if (json.per_page) {
                                per_page.val(json.per_page);
                            }

                            report.trigger('resize-report');
                        }
                    }
                })
            };

            /*
             * Make initial requests on initialization.
             */
            src.scope_info.get();
            src.table_header.get();
            src.table_rows.get();

            report.bind('resize-report', function(evt) {
                var minWidth = 900,
                    rInnerWidth = report.innerWidth(),
                    tOuterWidth = table.outerWidth(true) + 4; // padding is not usable

                // do not grow past window width. take into account the padding
                var nInnerWidth = Math.min(tOuterWidth, $(window).width() - 30);
                // do not shrink below the minimum width
                nInnerWidth = Math.max(minWidth, nInnerWidth);

                // determine the difference. half of it needs to be added
                // to the margin-right offset
                if (nInnerWidth == rInnerWidth)
                    return;

                content.animate({
                    width: nInnerWidth
                });

                report.animate({
                    width: nInnerWidth
                });
            });

            var resizeTimeOut;
            $(window).resize(function() {
                clearTimeout(resizeTimeOut);
                resizeTimeOut = setTimeout(function() {
                    report.trigger('resize-report');
                }, 200);
            });

             /*
             * Define primary event that handles fetching data.
             */
            body.bind('update.report', function(evt, params) {
                if (params)
                    params.data = 1
                var data = {data: params};
                src.table_rows.get(data, true);
                return false;
            });

            body.bind('update.perspective', function(evt, params) {
                if (params) {
                    params = {'replace': params}
                    $.patchJSON(App.endpoints.session.perspective, JSON.stringify(params), function() {
                        body.trigger('update.report');
                        if ('columns' in params.replace)
                            src.table_header.get(null, true);
                    });
                } else {
                    $.getJSON(App.endpoints.session.perspective, function() {
                        body.trigger('update.report');
                        src.scope_info.get(null, true);
                        src.table_header.get(null, true);
                    });
                }
                return false;
            });


            /*
             * Hook up the elements that change the number of rows per page.
             */
            report.delegate('.per-page', 'change', function(evt) {
                if (this.value)
                    body.trigger('update.report', {'size': this.value});
                return false;
            });

            /*
             * This implementation does *not* currently support multiple column
             * sorting. The only change needed is to grab all of the header
             * directions and pass it to the server.
             */
            thead.delegate('.header', 'click', function(evt) {
                var dir, target = $(this), id = target.attr('data-id'),
                    siblings = target.siblings();

                // reset siblings to no ordering
                siblings.removeClass('asc').removeClass('desc');

                if (target.hasClass('asc')) {
                    target.removeClass('asc').addClass('desc');
                    dir = 'desc';
                } else if (target.hasClass('desc')) {
                    target.removeClass('desc');
                    dir = '';
                } else {
                    target.addClass('asc');
                    dir = 'asc';
                }

                body.trigger('update.perspective', [{'ordering': [[id, dir]]}]);
                return false;
            });

            /*
             * Hook up the elements that change the page.
             */
            pages.delegate('a', 'click', function(evt) {
                body.trigger('update.report', {'page': this.hash.substr(1)});
                return false;
            });
        };

        return {init: init};
    }
);
