/* global define */

define([], function() {
    var defaults = {
        chart: {
            style: {
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
            }
        },

        title: {
            text: '',
            align: 'right'
        },

        subtitle: {
            align: 'right'
        },

        exporting: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        tooltip: {
            formatter: function () {
                if (this.point.values) {
                    var html = [];
                    html.push('<strong>' + this.series.xAxis.axisTitle.text +
                              '</strong>:');
                    html.push(this.point.values[0] + '<br>');
                    html.push('<strong>' + this.series.yAxis.axisTitle.text +
                              '</strong>:');
                    html.push(this.y);
                    return html.join('');
                }

                return this.key;
            },

            snap: 1,

            useHTML: true,

            borderWidth: 1,

            borderRadius: 3
        },

        plotOptions: {
            series: {
                cursor: 'pointer',

                shadow: false,

                borderWidth: 0,

                borderColor: '#4b8cf7',

                turboThreshold: 0,

                animation: {
                    duration: 400
                },

                color: '#777',

                states: {
                    select: {
                        color: '#0088cc'
                    },

                    hover: {
                        enabled: false
                    }
                }
            },

            area: {
                lineWidth: 1,

                shadow: false,

                stacking: 'normal',

                states: {
                    hover: {
                        lineWidth: 1
                    }
                },

                marker: {
                    enabled: false,

                    states: {
                        hover: {
                            enabled: true,

                            radius: 5
                        }
                    }
                },

                fillOpacity: 0.1
            },

            areaspline: {
                lineWidth: 1,

                shadow: false,

                states: {
                    hover: {
                        lineWidth: 1
                    }
                },

                marker: {
                    enabled: false,

                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },

                fillOpacity: 0.1
            },
            bar: {
                borderWidth: 0,

                minPointLength: 2
            },

            column: {
                borderWidth: 0,

                minPointLength: 2
            },

            pie: {
                allowPointSelect: true,

                cursor: 'pointer',

                showInLegend: true
            },

            scatter: {
                marker: {
                    radius: 5,

                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },

                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        }
    };

    var sparkline = {
        chart: {
            defaultSeriesType: 'areaspline',

            margin: [0, 0, 0, 0],

            height: 40
        },

        title: {
            text: '',

            align: 'left',

            y: 0,

            x: 0,

            style: {
                fontSize: '8px',

                color: '#333333'
            },
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        tooltip: {
            enabled: false
        },

        xAxis: {
            startOnTick: true,

            labels: {
                enabled: false
            }
        },

        yAxis: {
            endOnTick: true,

            labels: {
                enabled: false
            }
        },

        plotOptions: {
            series: {
                lineWidth: 1,

                shadow: false,

                states: {
                    hover: {
                        enabled: false
                    }
                },

                marker: {
                    enabled: false
                }
            },

            areaspline: {
                fillOpacity: 0.1
            },

            area: {
                fillOpacity: 0.1
            }
        }
    };

    return {
        defaults: defaults,
        sparkline: sparkline
    };

});
