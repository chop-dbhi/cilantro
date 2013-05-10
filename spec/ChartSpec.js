define(['cilantro.ui', 'text!/mock/concepts.json'], function (c, mocks) {

    describe("Spy FieldChart", function(){
       var async = new AsyncSpec(this);
       var concepts = JSON.parse(mocks);
       var model;
       var chart = window.Highcharts.Chart;

       async.beforeEach(function(done) {
            window.Highcharts.Chart = jasmine.createSpy();
            window.Highcharts.Chart.prototype.series = [{points:[]}];
            model = new c.models.ConceptModel(concepts[0], { parse:true });
            if (model.fields.length){
               context = new c.models.ContextNodeModel({id:model.fields.at(0).id});
               done();
            }else{
               model.fields.once('reset', function() {
                  context = new c.models.ContextNodeModel({id:model.fields.at(0).id});
                  done();
               });
            }
            model.fields.fetch({reset:true});
       });

       async.afterEach(function(done){
            window.Highcharts.Chart = chart;
            done();
       });

       async.it("should only create one Highcharts.Chart object on calls to render", function(done){
            var testChart = new c.ui.FieldChart({
                 editable: false,
                 model: model.fields.at(0),
                 context: null
            });
           var el = testChart.render();

           setTimeout(function(){
               expect(window.Highcharts.Chart.calls.length).toEqual(1);
               done();
           }, 1000);
       });
    });

    describe("FieldChart", function(){
        var async = new AsyncSpec(this);
        var concept = JSON.parse(mocks)[2];
        var model;
        var context;

        async.beforeEach(function(done){
            model = new c.models.ConceptModel(concept, {parse: true});
            if (model.fields.length){
               context = new c.models.ContextNodeModel({id:model.fields.at(0).id});
               done();
            }else{
               model.fields.once('reset', function() {
                  context = new c.models.ContextNodeModel({id:model.fields.at(0).id});
                  done();
               });
            }
            model.fields.fetch({reset:true});
        });

        async.it("should update when it's context changes", function(done){

           var testChart = new c.ui.FieldChart({
                 editable: true,
                 model: model.fields.at(0),
                 context: context
           });

           var el = testChart.render();

           setTimeout(function(){
               points = testChart.chart.series[0].points;
               expect(c._.filter(points, function(point){return point.category == "ABNORMAL"; })[0].selected).toBeUndefined();
               context.set({value:["ABNORMAL"]});
               expect(c._.filter(points, function(point){return point.category == "ABNORMAL"; })[0].selected).toBeTruthy();
               done();
           }, 1000);
        });
    });
});
