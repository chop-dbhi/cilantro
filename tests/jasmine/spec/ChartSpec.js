define(['cilantro/ui/charts', 'cilantro/models', 'text!../../mock/concepts.json'], 
    function (charts, models,  mocks) {

    describe("FieldDistributionChart", function(){
       var async = new AsyncSpec(this);
       var concepts = JSON.parse(mocks);
       var model;
       var chart = window.Highcharts.Chart;

       async.beforeEach(function(done) {
            window.Highcharts.Chart = jasmine.createSpy();
            model = new models.ConceptModel(concepts[0], { parse:true });
            done();
       });

       async.afterEach(function(done){
            window.Highcharts.Chart = chart;
            done();
       });

       async.it("should only create one Highcharts.Chart object on calls to render", function(done){
            var testChart = new charts.FieldDistributionChart({
                 editable: false,
                 model: model.fields[0],
                 data: {
                   context: null
                 }
            });

           var el = testChart.render();

           setTimeout(function(){
               expect(window.Highcharts.Chart.calls.length).toEqual(1);
               done();
           }, 1000);
       });
    });
});
