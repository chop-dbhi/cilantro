define(['jquery', 'cilantro.ui'], function($, c) {

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
            if (heights[i] != null) {
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
                top: parsePixelString(child.css('top')),
                bottom: parsePixelString(child.css('bottom'))
            });
        });
        return positions;
    }

    var column,
        arena = $('#arena');

    beforeEach(function() {
        column = $('<div />').css({
            maxHeight: 200
        });
        arena.html(column);
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
                    bottom: undefined
                },
                {
                    top: 50,
                    bottom: 20
                },
                {
                    top: undefined,
                    bottom: 0
                }
            ]);

        });

        it('no margin, padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.children().css({padding: 10});
            column.stacked({fluid: '.fluid'});

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined
                },
                {
                    top: 70,
                    bottom: 40
                },
                {
                    top: undefined,
                    bottom: 0
                }
            ]);
        });


        it('margin, no padding', function() {
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));

            column.children().css({margin: 10});
            column.stacked({fluid: '.fluid'});

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined
                },
                {
                    top: 70,
                    bottom: 40
                },
                {
                    top: undefined,
                    bottom: 0
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
            column.stacked({fluid: '.fluid'});

            // Increase height
            column.css({maxHeight: 300});
            column.stacked('restack');

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined
                },
                {
                    top: 50,
                    bottom: 20
                },
                {
                    top: undefined,
                    bottom: 0
                }
            ]);
        });

        it('decrease', function() {
            // Same as above
            column.append.apply(column, makeChildren(1, 50));
            column.append.apply(column, makeChildren('fluid', 1));
            column.append.apply(column, makeChildren(1, 20));
            column.stacked({fluid: '.fluid'});

            // Decrease height
            column.css({maxHeight: 100});
            column.stacked('restack');

            expect(getChildrenPositions(column)).toEqual([
                {
                    top: 0,
                    bottom: undefined
                },
                {
                    top: 50,
                    bottom: 20
                },
                {
                    top: undefined,
                    bottom: 0
                }
            ]);
        });
    });
});
