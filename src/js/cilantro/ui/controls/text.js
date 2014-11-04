/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../../core',
    '../search',
    '../base',
    './base'
], function(_, Backbone, Marionette, c, search, base, controls) {

    // Stop words are considered too common in search strings and are removed
    // to prevent false positive results. Stop words present in quote strings
    // will be untouched.
    var stopwords = {
        'a': true,
        'about': true,
        'above': true,
        'across': true,
        'after': true,
        'afterwards': true,
        'again': true,
        'against': true,
        'all': true,
        'almost': true,
        'alone': true,
        'along': true,
        'already': true,
        'also': true,
        'although': true,
        'always': true,
        'am': true,
        'among': true,
        'amongst': true,
        'amoungst': true,
        'amount': true,
        'an': true,
        'and': true,
        'another': true,
        'any': true,
        'anyhow': true,
        'anyone': true,
        'anything': true,
        'anyway': true,
        'anywhere': true,
        'are': true,
        'around': true,
        'as': true,
        'at': true,
        'back': true,
        'be': true,
        'became': true,
        'because': true,
        'become': true,
        'becomes': true,
        'becoming': true,
        'been': true,
        'before': true,
        'beforehand': true,
        'behind': true,
        'being': true,
        'below': true,
        'beside': true,
        'besides': true,
        'between': true,
        'beyond': true,
        'bill': true,
        'both': true,
        'bottom': true,
        'but': true,
        'by': true,
        'call': true,
        'can': true,
        'cannot': true,
        'cant': true,
        'co': true,
        'con': true,
        'could': true,
        'couldnt': true,
        'cry': true,
        'de': true,
        'describe': true,
        'detail': true,
        'do': true,
        'does': true,
        'done': true,
        'down': true,
        'due': true,
        'during': true,
        'each': true,
        'eg': true,
        'eight': true,
        'either': true,
        'eleven': true,
        'else': true,
        'elsewhere': true,
        'empty': true,
        'enough': true,
        'etc': true,
        'even': true,
        'ever': true,
        'every': true,
        'everyone': true,
        'everything': true,
        'everywhere': true,
        'except': true,
        'few': true,
        'fifteen': true,
        'fify': true,
        'fill': true,
        'find': true,
        'fire': true,
        'first': true,
        'five': true,
        'for': true,
        'former': true,
        'formerly': true,
        'forty': true,
        'found': true,
        'four': true,
        'from': true,
        'front': true,
        'full': true,
        'further': true,
        'get': true,
        'give': true,
        'go': true,
        'had': true,
        'has': true,
        'hasnt': true,
        'have': true,
        'he': true,
        'hence': true,
        'her': true,
        'here': true,
        'hereafter': true,
        'hereby': true,
        'herein': true,
        'hereupon': true,
        'hers': true,
        'herself': true,
        'him': true,
        'himself': true,
        'his': true,
        'how': true,
        'however': true,
        'hundred': true,
        'ie': true,
        'if': true,
        'in': true,
        'inc': true,
        'indeed': true,
        'interest': true,
        'into': true,
        'is': true,
        'it': true,
        'its': true,
        'itself': true,
        'keep': true,
        'last': true,
        'latter': true,
        'latterly': true,
        'least': true,
        'less': true,
        'ltd': true,
        'made': true,
        'many': true,
        'may': true,
        'me': true,
        'meanwhile': true,
        'might': true,
        'mill': true,
        'mine': true,
        'more': true,
        'moreover': true,
        'most': true,
        'mostly': true,
        'move': true,
        'much': true,
        'must': true,
        'my': true,
        'myself': true,
        'name': true,
        'namely': true,
        'neither': true,
        'never': true,
        'nevertheless': true,
        'next': true,
        'nine': true,
        'no': true,
        'nobody': true,
        'none': true,
        'noone': true,
        'nor': true,
        'not': true,
        'nothing': true,
        'now': true,
        'nowhere': true,
        'of': true,
        'off': true,
        'often': true,
        'on': true,
        'once': true,
        'one': true,
        'only': true,
        'onto': true,
        'or': true,
        'other': true,
        'others': true,
        'otherwise': true,
        'our': true,
        'ours': true,
        'ourselves': true,
        'out': true,
        'over': true,
        'own': true,
        'part': true,
        'per': true,
        'perhaps': true,
        'please': true,
        'put': true,
        'rather': true,
        're': true,
        'same': true,
        'see': true,
        'seem': true,
        'seemed': true,
        'seeming': true,
        'seems': true,
        'serious': true,
        'several': true,
        'she': true,
        'should': true,
        'show': true,
        'side': true,
        'since': true,
        'sincere': true,
        'six': true,
        'sixty': true,
        'so': true,
        'some': true,
        'somehow': true,
        'someone': true,
        'something': true,
        'sometime': true,
        'sometimes': true,
        'somewhere': true,
        'still': true,
        'such': true,
        'system': true,
        'take': true,
        'ten': true,
        'than': true,
        'that': true,
        'the': true,
        'their': true,
        'them': true,
        'themselves': true,
        'then': true,
        'thence': true,
        'there': true,
        'thereafter': true,
        'thereby': true,
        'therefore': true,
        'therein': true,
        'thereupon': true,
        'these': true,
        'they': true,
        'thickv': true,
        'thin': true,
        'third': true,
        'this': true,
        'those': true,
        'though': true,
        'three': true,
        'through': true,
        'throughout': true,
        'thru': true,
        'thus': true,
        'to': true,
        'together': true,
        'too': true,
        'top': true,
        'toward': true,
        'towards': true,
        'twelve': true,
        'twenty': true,
        'two': true,
        'un': true,
        'under': true,
        'until': true,
        'up': true,
        'upon': true,
        'us': true,
        'very': true,
        'via': true,
        'was': true,
        'way': true,
        'we': true,
        'well': true,
        'were': true,
        'what': true,
        'whatever': true,
        'when': true,
        'whence': true,
        'whenever': true,
        'where': true,
        'whereafter': true,
        'whereas': true,
        'whereby': true,
        'wherein': true,
        'whereupon': true,
        'wherever': true,
        'whether': true,
        'which': true,
        'while': true,
        'whither': true,
        'who': true,
        'whoever': true,
        'whole': true,
        'whom': true,
        'whose': true,
        'why': true,
        'will': true,
        'with': true,
        'within': true,
        'without': true,
        'would': true,
        'yet': true,
        'you': true,
        'your': true,
        'yours': true,
        'yourself': true,
        'yourselves': true,
        'didnt': true,
        'doesnt': true,
        'dont': true,
        'isnt': true,
        'wasnt': true,
        'youre': true,
        'hes': true,
        'ive': true,
        'theyll': true,
        'whos': true,
        'wheres': true,
        'whens': true,
        'whys': true,
        'hows': true,
        'whats': true,
        'shes': true,
        'im': true,
        'thats': true
    };

    var removeStopWords = function(words) {
        var keywords = [], word;

        for (var i = 0; i < words.length; i++) {
            word = words[i];

            // Only filter non-literal strings
            if (!/^[+-]?["']/.test(word)) {
                word = word.toLowerCase().replace(/[^a-zA-Z]/, '');
                if (stopwords[word]) continue;
            }

            keywords.push(words[i]);
        }

        return keywords;
    };

    // Parse string to include -/+ prefix and preserve quoted text
    var searchRegex = /[+-]?(?:[^\s"']+|"([^"]*)"|'([^']*)')/g;

    var parseString = function(text) {
        var toks = text.match(searchRegex) || [];
        if (toks.length) toks = removeStopWords(toks);
        return toks;
    };

    var stripPrefixAndQuotes = function(text) {
        return text.replace(/^[\-\+]?["']?/, '').replace(/["']?$/, '');
    };

    var ELEMENT_NODE = 1,
        TEXT_NODE = 3,
        ENTER_KEY = 13;

    // Find text that matches `regexp` and inject span elements with the
    // provided className. This enables wrapping text with a `highlight` class
    // for example.
    var innerHighlight = function(node, regexp, className) {
        if (node.nodeType === TEXT_NODE) {
            var pos = node.data.search(regexp);

            if (pos >= 0 && node.data.length > 0) {
                var match = node.data.match(regexp),
                    span = document.createElement('span');

                // Split the text node at the start position of the matched text.
                var middle = node.splitText(pos);

                // Split again leaving the middle text node to only contain the
                // matched text.
                middle.splitText(match[0].length);

                // Insert the text node in the span
                span.appendChild(middle.cloneNode(true));
                span.className = className;

                // Replace the middle text node with the span
                middle.parentNode.replaceChild(span, middle);

                // Successful creation of text node
                return true;
            }
        }
        // Recursive element nodes to find text nodes
        else if (node.nodeType === ELEMENT_NODE && node.childNodes &&
                   !/(script|style)/i.test(node.tagName)) {

            var i = 0;

            while (i < node.childNodes.length) {
                // Successful hightlight, increment the counter to account for
                // the newly created text node
                if (innerHighlight(node.childNodes[i], regexp, className)) i++;
                i++;
            }
        }
    };

    var highlightText = function(obj, pattern, className) {
        if (!_.isRegExp(pattern)) {
            pattern = new RegExp(pattern, 'ig');
        }

        obj.each(function() {
            return innerHighlight(this, pattern, className);
        });
    };

    var PreviewItem = Marionette.ItemView.extend({
        tagName: 'p',

        template: 'controls/text/preview-item'
    });

    var PreviewList = Marionette.CompositeView.extend({
        template: 'controls/text/preview-list',

        itemView: PreviewItem,

        itemViewContainer: '.items',

        onRender: function() {
            var toks = _.map(parseString(this.options.query), function(tok) {
                return stripPrefixAndQuotes(tok);
            });

            var children = this.$(this.itemViewContainer).children();
            highlightText(children, toks.join('|'), 'highlight');
        }
    });

    var PreviewCollection = Backbone.Collection.extend({
        parse: function(resp) {
            return resp.items;
        }
    });


    // Single text input that converts the input into a multiple-facted
    // search. Operators are supported including:
    //
    // Prefixing a search term with "+" requires the term, while
    // the "-" symbol requires the exclusion of the term.
    //
    // Strings can be quoted for exact matches. This is only necessary when
    // a string has spaces or special characters.
    var TextControl = controls.ControlLayout.extend({
        template: 'controls/text/layout',

        options: {
            preview: false
        },

        regions: {
            search: '[data-target=search-region]',
            preview: '[data-target=preview-region]'
        },

        regionViews: {
            search: search.Search,
            preview: PreviewList
        },

        collectionEvents: {
            request: 'showPreviewLoading',
            error: 'showPreviewError',
            sync: 'showPreview'
        },

        events: {
            'keyup [data-target=search-region] input': 'triggerPreview'
        },

        constructor: function(options) {
            options.collection = new PreviewCollection();
            options.collection.url = function() {
                return options.model.links.values;
            };
            controls.ControlLayout.prototype.constructor.call(this, options);
        },

        onRender: function() {
            var searchView = new this.regionViews.search();
            this.listenTo(searchView, 'search', this.change);
            this.search.show(searchView);
        },

        triggerPreview: function(event) {
            // Preview endpoint
            if (!this.options.preview) return;

            if (event && event.which === ENTER_KEY) {
                event.preventDefault();
                event.stopPropagation();

                this.showPreviewLoading();

                // Reference on view and locally to compare once the response
                // comes back to prevent late queries from rendering.
                var data = this.get(),
                    query = this.previewQuery = data.query;

                // Create temporary context. This is needed due to the limitations of the
                // Serrano API for getting a set of values relative to some context.
                if (!this.context) {
                    this.context = c.data.contexts.add({'json': data});
                } else {
                    this.context.set({'json': data});
                }

                var _this = this;

                this.context.save()
                    .fail(function() {
                        _this.showPreviewError();
                    })
                    .done(function() {
                        if (_this.previewQuery !== query) return;

                        // Reset values using current filter as the context
                        _this.collection.fetch({
                            reset: true,
                            data: {
                                aware: 1,
                                limit: 5,
                                context: _this.context.id
                            }
                        });
                    });
            }
        },

        showPreviewLoading: function() {
            this.preview.show(new base.LoadView({
                message: 'Loading preview...'
            }));
        },

        showPreviewError: function() {
            this.preview.show(new base.ErrorView({
                message: 'There was an error loading the preview.'
            }));
        },

        showPreview: function() {
            var previewRegion = new this.regionViews.preview({
                query: this.previewQuery,
                collection: this.collection
            });

            this.preview.show(previewRegion);
        },

        validate: function(attrs) {
            if (!attrs.children && !attrs.value) {
                return 'At least one keyword must be entered';
            }
        },

        get: function() {
            var query = this.search.currentView.ui.input.val();

            var toks = parseString(query);

            if (!toks.length) return;

            var field = this.model.id;

            var filter = {
                field: field,
                type: 'and',
                children: []
            };

            var required = [],
                excluded = [],
                optional = [];

            _.each(toks, function(tok) {
                var prefix = tok.charAt(0);

                if (prefix === '+') {
                    required.push(stripPrefixAndQuotes(tok));
                }
                else if (prefix === '-') {
                    excluded.push(stripPrefixAndQuotes(tok));
                }
                else {
                    optional.push(stripPrefixAndQuotes(tok));
                }
            });

            if (required.length === 1) {
                filter.children.push({
                    field: field,
                    operator: 'icontains',
                    value: required[0]
                });
            }
            else if (required.length > 1) {
                filter.children.push({
                    field: field,
                    type: 'and',
                    children: _.map(required, function(value) {
                        return {
                            field: field,
                            operator: 'icontains',
                            value: value
                        };
                    })
                });
            }

            if (excluded.length === 1) {
                filter.children.push({
                    field: field,
                    operator: '-icontains',
                    value: excluded[0]
                });
            }
            else if (excluded.length > 1) {
                filter.children.push({
                    field: field,
                    type: 'and',
                    children: _.map(excluded, function(value) {
                        return {
                            field: field,
                            operator: '-icontains',
                            value: value
                        };
                    })
                });
            }

            if (optional.length === 1) {
                filter.children.push({
                    field: field,
                    operator: 'icontains',
                    value: optional[0]
                });
            }
            else if (optional.length > 1) {
                filter.children.push({
                    field: field,
                    operator: 'iregex',
                    value: '(' + optional.join('|') + ')'
                });
            }

            // Remove single nested condition
            if (filter.children.length === 1) {
                filter = filter.children[0];
            }

            // The original query is preserved since reconstructing the original
            // string from the parsed tokens above may be ambiguous. Further, the
            // semantics of the tokenization may change resulting in a different
            // query representation.
            filter.query = query;

            return filter;
        },

        set: function(attrs) {
            if (this._changing) return;

            if (attrs.query) {
                this.search.currentView.ui.input.val(attrs.query);
            }
        }
    });


    return {
        TextControl: TextControl
    };

});
