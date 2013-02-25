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
              $('#arena').html(form.el);
              setTimeout(function(){
                  var width1 = $("#arena .highcharts-container").css("width");
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

           xit("stays the same size when instantiated and rendered twice", function(){
              form.render();
              var el = form.chart.currentView.$el;
              $('#arena').html(form.el);
              var width1 = $(".highcharts-container",el).css("width");
              var model2 = new c.models.ConceptModel(concepts[0], { parse:true });
              var form2 = new c.ui.ConceptForm({ model:model });
              form2.render();
              $('#arena').html(form2.el);
              el = form2.chart.currentView.$el;
              var width2 = $(".highcharts-container",el).css("width");
              console.log(width2);
              expect(width1).toEqual(width2);
              form2.close()
           });
        });
    });
});
