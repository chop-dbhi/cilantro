define(['cilantro.ui','text!/mock/concepts.json'], function (c, mocks) {
    var concepts = JSON.parse(mocks);

    describe('ConceptForm', function () {
        var form, model;

        beforeEach(function () {
            model = new c.models.ConceptModel(concepts[0], {
                parse: true
            });
            form = new c.ui.ConceptForm({
                model: model
            });
        });

        it('should have a model', function () {
            expect(form.model).toEqual(model);
        });

        it('should have a fields array on its model', function(){
            expect(form.model.fields).toEqual(jasmine.any(Array));
        });

        describe('Chart', function() {
           var async = new AsyncSpec(this);

           async.beforeEach(function (done) {
               c.data.contexts.when(function(){
                   model = new c.models.ConceptModel(concepts[0], {
                       parse: true
                   });
                   form = new c.ui.ConceptForm({
                       model: model
                   });
                   done();
               });
           });

           async.it('maintains size across renderings when removed from dom', function(done){
                form.render();
                var el = form.chart.currentView.$el;
                $('#arena').html(form.el);

                setTimeout(function(){
                    var width1 = $('.highcharts-container', el).css('width');
                    expect(width1).toBeDefined();
                    form.close();
                    form.render();
                    $('#arena').html(form.el);
                    el = form.chart.currentView.$el;

                    setTimeout(function(){
                        var width2 = $('.highcharts-container', el).css('width');
                        expect(width2).toBeDefined();
                        expect(width1).toEqual(width2);
                        form.close()
                        done();
                    }, 1000);
                }, 1000);
           });
        });
    });

    describe('ConceptIndex', function() {
        var view, collection;

        beforeEach(function() {
            collection = new c.models.ConceptCollection(concepts);
            view = new c.ui.ConceptIndex({
                collection: collection
            });
        });

        it('should not define the groups on init', function() {
            expect(view.groups).toBeUndefined();
        });

        it('should group by category and order', function() {
            view.resetGroups();
            expect(view.groups).toBeDefined();
            expect(view.groups.length).toEqual(4);
            expect(view.groups.pluck('order')).toEqual([2, 3, 4, 5]);
        });

        it('should have sections per group', function() {
            view.resetGroups();
            var group = view.groups.at(0);
            expect(group.sections.length).toEqual(1);
            expect(group.sections.pluck('name')).toEqual(['Other']);
            expect(group.sections.pluck('id')).toEqual([-1]);
        });

        it('should have items per section', function() {
            view.resetGroups();
            var section = view.groups.at(0).sections.at(0);
            expect(section.items.length).toEqual(1);
        });
    });
});
