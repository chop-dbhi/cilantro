/* global define, beforeEach, describe, it, expect */

define(['jquery'], function($) {

    function parsePixelString(string) {
        var match = string.match(/(\d*(?:\.\d+)?)px/);
        if (match) {
            return parseFloat(match[1]);
        }
    }

    function makeChildren() {
        var className, num, children = [], heights;

        if (typeof arguments[0] == 'string') {
            className = arguments[0];
            num = arguments[1];
            heights = [].slice.call(arguments, 2);
        } else {
            className = '';
            num = arguments[0];
            heights = [].slice.call(arguments, 1);
        }

        for (var c, i = 0; i < num; i++) {
            c = $('<div />').addClass(className);
            if (heights[i] !== null) {
                c.height(heights[i]);
            }
            children.push(c);
        }
        return children;
    }

    function getChildrenPositions(elem) {
        var positions = [];
        elem.children().each(function(i, child) {
            child = $(child);
            positions.push({
                top: parsePixelString(child[0].style.top),
                bottom: parsePixelString(child[0].style.bottom),
                margin: {
                    top: parsePixelString(child.css('marginTop')),
                    bottom: parsePixelString(child.css('marginBottom'))
                },
                padding: {
                    top: parsePixelString(child.css('paddingTop')),
                    bottom: parsePixelString(child.css('paddingBottom'))
                }
            });
        });
        return positions;
    }

    var column;

    beforeEach(function() {
        $('#arena').remove();
        $('body').append('<div id=arena />');

        column = $('<div />').css({
            maxHeight: 200
        });

        $('#arena').html(column);
    });

    describe('Stacked Column', function() {

        it('no margin, no padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 50,
                    bottom: 20,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 0,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);

        });

        it('no margin, child padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.children().css({padding: 10});
            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                {
                    top: 70,
                    bottom: 40,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                {
                    top: undefined,
                    bottom: 0,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            ]);
        });

        it('no margin, stack padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.css({padding: 10});
            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 10,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 60,
                    bottom: 30,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 10,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);
        });

        it('child margin, no padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.children().css({margin: 10});
            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 10,
                    bottom: undefined,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 80,
                    bottom: 50,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 10,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);
        });

        it('stack margin, no padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.css({margin: 10});
            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 50,
                    bottom: 20,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 0,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);
        });

        it('both margin, both padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.css({margin: 10, padding: 10});
            column.children().css({margin: 10, padding: 10});
            column.stacked({fluid: '.fluid'});

            expect(column.height()).toEqual(200);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 20,
                    bottom: undefined,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                {
                    top: 110,
                    bottom: 80,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                {
                    top: undefined,
                    bottom: 20,
                    margin: {
                        top: 10,
                        bottom: 10
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            ]);
        });
    });


    describe('Changing column height', function() {

        it('increase', function() {
            // Same as above
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));
            column.stacked({fluid: '.fluid', animate: false});

            // Increase height
            column.css({maxHeight: 300});
            column.stacked('restack');

            expect(column.height()).toEqual(300);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 50,
                    bottom: 20,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 0,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);
        });

        it('decrease', function() {
            // Same as above
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));
            column.stacked({fluid: '.fluid', animate: false});

            // Decrease height
            column.css({maxHeight: 100});
            column.stacked('restack');

            expect(column.height()).toEqual(100);

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: 50,
                    bottom: 20,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                },
                {
                    top: undefined,
                    bottom: 0,
                    margin: {
                        top: 0,
                        bottom: 0
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            ]);
        });
    });
});
