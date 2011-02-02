define('define/views/search', ['lib/backbone'],

    function() {

        /*
         * Class: SearchInputView
         *
         * Represents the search input that delegates user input to a
         * search interface.
         */
        var SearchInputView = Backbone.View.extend({

            jq: '#search',

            focused: false,

            timer: null,

            events: {

                'focus': 'focus',
                'blur': 'blur',
                'keyup': 'keyup'

            },

            initialize: function() {

                this.render();

            },

            render: function() {

                this.jq = $(this.jq);
                this.el = this.jq[0];
                this.delegateEvents();

            },

            focus: function() {
                this.focused = true;
                this.trigger('focused');
            },

            blur: function() {
                this.focused = false;
                this.trigger('blurred');
            },

            keyup: function() {

                clearTimeout(this.timer);

                var ref = this;
                this.timer = setTimeout(function() {

                    ref.trigger('query', [ref.jq.val()]);

                }, 100);

            }

        });


        /*
         * Class: SearchResultsView
         *
         * Represents the filtered collection of criterion objects driven
         * by the interaction with the search input.
         */
        var SearchResultsView = Backbone.View.extend({

            id: 'search-results',

            tagName: 'div',

            empty: $('<p style="font-style:italic">No results found</p>'),

            events: {

                'mouseenter': 'enter',
                'mouseleave': 'leave'
            
            },

            query: null,
            
            focused: false,

            initialize: function() {

                this.render();

            },

            render: function() {

                this.jq = $(this.el);
                this.jq.appendTo('body');

            },

            enter: function() {

                this.focused = true;

            },

            leave: function() {

                this.focused = false;

                if (!this.input.focused)
                    this.hide();

            },

            show: function() {

                this.jq.fadeIn('fast');

            },

            hide: function() {

                this.jq.fadeOut('fast');

            }

        });


        var SearchView = Backbone.View.extend({

            query: null,

            initialize: function() {

                this.input = new SearchInputView;
                this.results = new SearchResultsView({
                    input: this.input
                });

                this.input.bind('focused', _.bind(this.show, this));
                this.input.bind('blurred', _.bind(this.hide, this));
                this.input.bind('query', _.bind(this.query, this));

            },

            show: function() {

                // only show the results if there was an existing query,
                // otherwise it would just be showing all results (or none).
                if (this.query) {

                    this.setPosition();
                    this.results.show();

                }

            },

            hide: function() {

                if (!this.results.focused)
                    this.results.hide();

            },


            setPosition: function() {

                var r = this.results.jq,
                    s = this.input.jq;

                var rWidth = r.outerWidth(),
                    sOffset = s.offset(),
                    sHeight = s.outerHeight(),
                    sWidth = s.outerWidth();

                r.css({

                    left: sOffset.left - (rWidth - sWidth) / 2.0,
                    top: sOffset.top + sHeight + 5

                });

            },

            query: function(value) {

                var ref = this;

                $.getJSON(this.collection.url, {'q': value}, function(resp) {

                    ref.query = value;
                    ref.show();

                });

            }

        
        });

        return {
            SearchView: SearchView
        };
    }
);
