/* global define, describe, beforeEach, it, expect, waitsFor */

define(['cilantro', 'cilantro/structs'], function(c, structs) {

    describe('Structs', function() {
        var frame, series, datum;

		beforeEach(function() {
            frame = new structs.Frame(null, null);
            frame.url = c.config.get('url') + 'data/preview/';

            frame.fetch();

            waitsFor(function() {
                return frame.series.length > 0;
            });
		});

        describe('Frame', function() {
            it('should populate remote data on fetch', function() {
                expect(frame.width()).toEqual(3);
                expect(frame.size()).toEqual(20);
            });

            it('should be able to extract columns', function() {
                var column = frame.column(2);
                expect(column.width()).toEqual(1);
                expect(column.size()).toEqual(20);
                expect(column.isColumn()).toBe(true);
            });
        });

        describe('Series', function() {
            beforeEach(function() {
                series = frame.series.at(0);
            });

            it('should reference the frame indexes', function() {
                expect(series.indexes).toBe(frame.indexes);
            });

            it('should should have data', function() {
                expect(series.width()).toEqual(3);
                expect(series.size()).toEqual(1);
            });

            it('should be classified as a row', function() {
                expect(series.isRow()).toBe(true);
            });

        });


        describe('Datum', function() {
            beforeEach(function() {
                series = frame.series.at(0);
                datum = series.data.at(0);
            });

            it('should contain a value', function() {
                expect(datum.get('value')).toBeDefined();
            });

            it('should have the correct index from series', function() {
                expect(datum.index).toBe(series.indexes.at(0));
            });

        });

    });

});
