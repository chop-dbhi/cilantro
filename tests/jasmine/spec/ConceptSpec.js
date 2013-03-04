define(['cilantro', 'cilantro/ui','text!../../mock/concepts.json'], function (c, ui, mocks) {
    describe("ConceptForm", function () {
        var concepts = JSON.parse(mocks);
        var form, model;

        beforeEach(function () {
            model = new c.models.ConceptModel(concepts[0], { parse:true });
            form = new c.ui.ConceptForm({ model:model });
        });

        it("should have a model", function () {
            expect(form.model).toEqual(model);
        });

        it("should have a fields array on its model", function(){
            expect(form.model.fields).toEqual(jasmine.any(Array));
        });

        describe('Chart', function() {
           var async = new AsyncSpec(this);
           
           async.beforeEach(function (done) {
               model = new c.models.ConceptModel(concepts[0], { parse:true });
               form = new c.ui.ConceptForm({ model:model });
               done();
           });
           
           async.it("maintains size across renderings when removed from dom", function(done){
              form.render();
              var el = form.chart.currentView.$el;
              $('#arena').html(form.el);
              setTimeout(function(){
                  var width1 = $(".highcharts-container", el).css("width");
                  expect(width1).toBeDefined();
                  form.close();
                  form.render();
                  $('#arena').html(form.el);
                  el = form.chart.currentView.$el;
                  setTimeout(function(){
                      var width2 = $(".highcharts-container", el).css("width");
                      expect(width2).toBeDefined();
                      expect(width1).toEqual(width2);
                      form.close()
                      done();
                  }, 1000);
              }, 1000);
           });
        });
    });
});
