define(['cilantro', 'text!/mock/data/preview.json'], function(c, dataJSON) {


    describe('Structures', function() {
        var data;

        beforeEach(function() {
            data = JSON.parse(dataJSON);
        });

        describe('Frame', function() {

            it('should populate local data', function() {
                var frame = new c.structs.Frame(data);
                expect(frame.indexes.length).toEqual(6);
                expect(frame.series.length).toEqual(30);
            });

            it('should populate remote data on fetch', function() {
                var frame = new c.structs.Frame(null, null, {
                    url: '/mock/data/preview.json'
                });

                runs(function() {
                    frame.fetch();
                });

                waitsFor(function() {
                    return !!frame.series.length;
                });

                runs(function() {
                    expect(frame.width()).toEqual(6);
                    expect(frame.size()).toEqual(30);
                });
            });

            it('should be able to extract columns', function() {
                var frame = new c.structs.Frame(data);
                var column = frame.column(2);
                expect(column.width()).toEqual(1);
                expect(column.size()).toEqual(30);
                expect(column.isColumn()).toBe(true);
            });
        });

        describe('Series', function() {
            var frame, series;

            beforeEach(function() {
                frame = new c.structs.Frame(data);
                series = frame.series.at(0);
            });

            it('should reference the frame indexes', function() {
                expect(series.indexes).toBe(frame.indexes);
            });

            it('should should have data', function() {
                expect(series.width()).toEqual(6);
                expect(series.size()).toEqual(1);
            });

            it('should be classified as a row', function() {
                expect(series.isRow()).toBe(true);
            });

        });


        describe('Datum', function() {
            var frame, series, datum;

            beforeEach(function() {
                frame = new c.structs.Frame(data);
                series = frame.series.at(0);
                datum = series.data.at(0);
            });

            it('should contain a value', function() {
                expect(datum.get('value')).toEqual('<a href="/demo/patient/39/">MR00000039</a>');
            });

            it('should have the correct index from series', function() {
                expect(datum.index).toBe(series.indexes.at(0));
            });

        });

    });

});
