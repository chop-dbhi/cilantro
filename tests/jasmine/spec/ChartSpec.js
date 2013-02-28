define(['highcharts', 'cilantro/ui/charts', 'cilantro/models', 'text!../../mock/concepts.json'], 
    function (h, charts, models,  mocks) {

    describe("FieldDistributionChart", function(){
       var concepts = JSON.parse(mocks);
       var model;
       var chart = h.Chart;

       beforeEach(function () {
            window.Highcharts.Chart = h.Chart = jasmine.createSpy();
            model = new models.ConceptModel(concepts[0], { parse:true });
       });
       afterEach(function(){
            window.Highcharts.Chart = h.Chart = chart;
       });

       it("should only create one Highcharts.Chart object on calls to render", function(){
            var testChart = new charts.FieldDistributionChart({
                 editable: false,
                 model: model.fields[0],
                 data: {
                   context: null
                 }
            });

           var el = testChart.render();
           expect(h.Chart.calls.length).toEqual(1);
       });
    });

});
