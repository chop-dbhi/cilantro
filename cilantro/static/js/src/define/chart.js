require.def(['define/form', 'define/viewelement', 'lib/highcharts'], function(Form, ViewElement) {
    // Base Class for all charts
    var Chart = ViewElement.extend({
        gainedFocus: function(){
            this.chart.xAxis[0].isDirty = true;
            this.chart.yAxis[0].isDirty = true;
            this.chart.isDirty = true;
            this.chart.series[0].isDirty = true;
            this.updateChart();
            this.chart.redraw();
        },
        updateChart : function(){},
        // HighCharts configuration object
        options : {
             chart: {
                 marginBottom:50,
                 renderTo : null,
                 defaultSeriesType: 'pie',
                 zoomType:'',
                 events:{}
             },
             tooltip:{
                 formatter: null
             },
             events:{},
             plotOptions:{
                 series:{
                     point : {
                         events:{}
                     },
                     events: {
                         click : null
                     }
                 },
                 line:{
                     animation: true
                 },
                 pie:{
                     dataLabels: {
                         enabled: true,
                         formatter: function() {
                             return this.point.name;
                         }
                     },
                     borderColor: "#000000",
                     borderWidth: 2,
                     allowPointSelect: false,
                     cursor: "pointer",
                     enableMouseTracking: true,
                     stickyTracking: false,
    
                     states:{
                         hover:{
                             brightness: -.1,
                             enabled:true
                         }
                     },
                     point:{
                         events:{
                             mouseOver : function(){},
                             mouseOut : function(){}
                         }
                     }
                 },
                 column:{
                     dataLabels: {
                         enabled: true
                     },
                     allowPointSelect:false,
                     cursor:"pointer",
                     enableMouseTracking:true,
                     stickyTracking:false,
                     states:{
                          hover:{
                              brightness: -.1,
                              enabled:true
                          }
                     }
                 } 
             },
    
             credits:{
                 enabled: false
             },
             legend:{
                 enabled: false
             },
             title: {
                  text: null
             },
             series: [{
                name:null,
                data:null
             }]
        }
    },
    {   // Colors used by all graphs
        UNSELECTED_COLOR: "#C5C5C5",
        SELECTED_COLOR: "#99BDF1",
        EXCLUDE_COLOR: "#EE3A43",
        INCLUDE_COLOR: "#99BDF1",
        ALTERNATE_GRID_COLOR: "#FDFFD5",
        MINIMUM_SLICE: 0.04,
        // Utility functions
        map_data_to_display: function(choices){
            var map = {};
            $.each(choices, function(index,element){
                map[element[0]]=element[1];
            });
            return map;
        },
        map_display_to_data: function(choices){
            var map = {};
            $.each(choices, function(index,element){
                map[element[1]]=element[0];
            });
            return map;
        },
        // Utility maps used to convert array operators for the null boolean type
        nb_plural_to_singular_map: {"in":"exact", "-in":"-exact"},
        nb_singular_to_plural_map: {"exact":"in", "-exact":"-in"} 
    });
    
    // Base class for charts displaying discrete bins of data
    var ChoiceChart = Chart.extend({
        constructor:function(viewset, concept_pk){
            // HighCharts cannot handle boolean values in the coordinates
            this.selected = [];
            this.map = Chart.map_data_to_display(viewset.data.choices);
            this.unmap = Chart.map_display_to_data(viewset.data.choices);
            this.negated = false;
            this.range_form = new Form({fields:[{ datatype: "string",
                                                  name: viewset.data.name,
                                                  choices:viewset.data.choices,
                                                  pk: viewset.data.pk}]}, concept_pk);
            this.range_form = this.range_form.dom;
            // The graph serves the purpose of multiple selector.
            this.range_form.find('select[multiple]').hide();
            this.range_form.find("input").css("margin","10px"); //TODO should not be here
            // Highcharts does not let us pass in null and true and false for coords
            $.each(viewset.data.coords, function(index,element){
                            viewset.data.coords[index][0] = this.map[viewset.data.coords[index][0]];
            });
            console.log(viewset);
            debugger;
            this.base(viewset, concept_pk);
        },
        notify: function(){
             this.dom.trigger("ElementChangedEvent", [{name:this.concept_pk+"_"+this.viewset.data.pk, value:this.selected}]);
        },
        elementChanged: function(evt, value){
                 // We don't care about null values here because it means
                 // the item was hidden
                 // TODO i don't think this matters anymore ssince we removed negation
                 if (value.value === null) return;
                 if (value.value === "in"){
                     this.negated = false;
                 }else{
                     this.negated = true;
                 }
                 this.updateChart();
        },
        updateDS: function(evt, ds){
               this.selected = ds[this.concept_pk +  "_" + this.viewset.data.pk];
               if (this.selected === undefined){
                   this.selected = [];
               } else if (!($.isArray(this.selected))){
                   this.selected = [this.selected];
               }
               this.negated = ds[this.concept_pk + "_"+this.viewset.data.pk + "_operator"] === "-in";
               this.range_form.triggerHandler(evt,[ds]);
        },
        updateElement: function(evt, element){
               if (element.name === this.concept_pk+"_"+this.viewset.data.pk){
                    this.selected = element.value;
                } else { 
                    if (element.name === this.concept_pk+"_"+this.viewset.data.pk+"_operator" && element.value==="in"){
                        this.negated = false;
                    }else{
                        this.negated = true;
                    }
                }
                // Gain focus will take care of updating graph
                // Tell embedded form
                this.range_form.triggerHandler(evt,[element]);
        },
        seriesClick: function(event) {
            debugger;
             var category = event.point.category || event.point.name;               
             var index = $.inArray(this.unmap[category], this.selected);
             if (index === -1) {
                 if (this.negated){
                     event.point.update({color:ChoiceChart.EXCLUDE_COLOR});
                 }else{
                     event.point.update({color:ChoiceChart.SELECTED_COLOR});
                 }
                 this.selected.push(this.unmap[category]);
             }else{
                 event.point.update({color:ChoiceChart.UNSELECTED_COLOR});
                 this.selected.splice(index,1);
             }
             this.notify();
             this.chart.hoverPoint = event.point;
             this.chart.hoverSeries = event.series; // Will this work?
        }
    });
    
    var PieChart = ChoiceChart.extend({
        constructor: function(viewset, concept_pk){
           // We only use pie charts for series with <= 3 choices.
           // Verify that no one piece is less than MINIMUM_SLICE of
           // the whole thing 
           // TODO this should be replaced with lines and labels in the more recent version of highcharts
           var coords = viewset.data.coords;
           this.data_store = {};
           $.each(coords, function(index,element){
               this.data_store[element[0]] = element[1];
           });
           
           var sum = 0;
           $.each(coords, function(index, element){
              sum = sum + element[1];
           });
           var min_slice_width = sum * MINIMUM_SLICE;
           $.each(coords, function(index,element){
              if (element[1] < min_slice_width){
                  element[1] = min_slice_width;
              }
           });
           this.base(viewset, concept_pk);
        },
        render: function(){
            // Add this instance's details
            this.dom = $('<div class="chart"></div>');
            this.options.chart.renderTo = this.dom.get(0);
            this.options.tooltip.formatter = function(){
                return "" + data_store[this.point.name];
            };
            this.options.series[0].name = this.viewset.data.title;
            this.options.series[0].data = this.viewset.data.coords;
            this.options.title.text = this.viewset.data.title;
            this.options.plotOptions.series.events.click = $.proxy(this.seriesClick, this);
            
            this.chart = new Highcharts.Chart(this.options);
        },       
        updateChart: function(){
            // Rotated text does not show up without this in 
            // ie 8 and ie 7
            $.map(this.chart.series[0].data, function(element,index){
                   var category = element.name || element.category;
                   if ($.inArray(this.unmap[category], this.selected) !==-1){
                       if (this.negated){
                           element.update({color:PieChart.EXCLUDE_COLOR});
                       }else{
                           element.update({color:PieChart.SELECTED_COLOR});
                       }
                   }else{
                       element.update({color:PieChart.UNSELECTED_COLOR});
                   }
                  $(element.tracker.element).mouseover();
                  $(element.tracker.element).mouseout();
             });
        },
        gainedFocus: function(evt){
            this.base();
            this.negated = false;  // is this even used anymore??
        }
    });
 
     var BarChart = ChoiceChart.extend({
         render: function(){
             var objRef = this;
             this.dom = $('<div class="chart"></div>');
             this.options.chart.marginBottom = this.viewset.data.coords.length > 6 ? 100 : 50;
             this.options.chart.renderTo =  this.dom.get(0);
             this.options.chart.defaultSeriesType = 'column';
             this.options.chart.events.redraw = $.proxy(this.redraw,this);
             this.options.chart.events.load = $.proxy(this.load,this);
             this.options.plotOptions.series.events.click = $.proxy(this.seriesClick,this);
             this.options.title = this.viewset.data.title;
             this.options.series[0].name = this.viewset.data.title;
             this.options.series[0].data = $.map(this.viewset.data.coords, function(element, index){
                    return element[1]; 
             });
             // TODO Can this go in the general data structure?
             this.options.tooltip = {
                    formatter:function(){
                        return this.point.category + ", " + this.y;
                    }
             };
             this.options.xAxis = {
                categories: $.map(this.viewset.data.coords, function(element, index){
                   return objRef.map[element[0]]; 
                }),
                title: {
                    text: this.viewset.data.xaxis,
                    margin: this.viewset.data.coords.length > 6 ? 90 : 50
                },
                labels:{
                    align: this.viewset.data.coords.length > 6 ? 'left' : 'center',
                    y: this.viewset.data.coords.length > 6 ? 10 : 20,
                    rotation: this.viewset.data.coords.length > 6 ? 50 : 0,
                    formatter: function(){
                        // Make words appear on separate lines unless they are rotated
                        var value = this.value;
                        
                        // If there are more than 6 categories, they will be rotated
                        // TODO this closure is not good
                        if (objRef.viewset.data.coords.length > 6) { 
                            if (value.length > 20){
                                value = value.substr(0,18)+"..";
                            }
                        }else {
                            // Values aren't rotated, put one word per line
                            value = this.value.split(" ").join("<br/>");
                        }
                        return value;
                    }
                }
             };
             this.options.yAxis = {
                min:0,
                title: {
                   text: this.viewset.data.yaxis
                },
                labels:{
                     rotation: 45
                }
             
             };
            
             this.chart = new Highcharts.Chart(this.options);
         },
         updateChart: function(){
                var objRef = this;
                $.map(this.chart.series[0].data, function(element,index){
                    if ($.inArray(objRef.unmap[element.category], objRef.selected) !==-1){
                        if (objRef.negated){
                            element.update({color:Chart.EXCLUDE_COLOR});
                        }else{
                            element.update({color:Chart.SELECTED_COLOR});    
                        }
                    }else{
                        element.update({color:Chart.UNSELECTED_COLOR});
                    }
                    // This is a hack to fix a bug in ie7 where bars that
                    // have been moused over, vanish if the view is taken off
                    // screen and then put back.
                    $(element.tracker.element).mouseover();
                    $(element.tracker.element).mouseout();
                 });
         },
         redraw: function(event){
               for (var index = 0; index < this.chart.series[0].data.length; index++){
                    var col = this.chart.series[0].data[index];

                    $(col.dataLabel.element).attr("fill", col.color);//chrome/firefox
                    $(col.dataLabel.element).css("color", col.color);//ie
                    $(col.dataLabel.element).hover(function(event){
                        $(this).css("cursor","pointer");
                    }, function(event){
                        $(this).css("cursor","");
                    });
                    var objRef = this;
                    $(col.dataLabel.element).click(function(c){
                        return (function(event){
                                 c.series.chart.hoverPoint = c;
                                 c.series.chart.isDirty = true;
                                 var index = $.inArray(objRef.unmap[c.category], objRef.selected);
                                 if (index === -1) {
                                     if (objRef.negated){
                                         c.update({color:BarChart.EXCLUDE_COLOR});
                                     }else{
                                         c.update({color:BarChart.SELECTED_COLOR});
                                     }
                                     objRef.selected.push(objRef.unmap[c.category]);
                                 }else{
                                     c.update({color:BarChart.UNSELECTED_COLOR});
                                     objRef.selected.splice(index,1);
                                 }
                                 objRef.notify();
                            });            
                    }(col));
               }
          },
          load: function(evt){
               var chart = evt.target;
               for (var index = 0; index < chart.series[0].data.length; index++){
                   var col = chart.series[0].data[index];
                   $(col.dataLabel.element).hover(function(event){
                       $(this).css("cursor","pointer");
                   }, function(event){
                       $(this).css("cursor","");
                   });
                   var objRef = this;
                   $(col.dataLabel.element).click(function(c){
                       return (function(event){
                              c.series.chart.hoverPoint = c;
                              c.series.chart.isDirty = true;
                              var index = $.inArray(objRef.unmap[c.category], objRef.selected);
                              if (index === -1) {
                                  if (objRef.negated){
                                      $(c.dataLabel.element).css("color", BarChart.EXCLUDE_COLOR);
                                      c.update({color:EXCLUDE_COLOR});
                                  }else{
                                      $(c.dataLabel.element).css("color", BarChart.SELECTED_COLOR);
                                      c.update({color:SELECTED_COLOR});
                                  }
                                  objRef.selected.push(objRef.unmap[c.category]);
                              }else{
                                  $(c.dataLabel.element).css("color", BarChart.UNSELECTED_COLOR);
                                  c.update({color:BarChart.UNSELECTED_COLOR});
                                  objRef.selected.splice(index,1);
                              }
                         });                       
                   }(col));
              }
          }
     });    
     // We have an embedded form in this chart, which is really
     // the only thing that changes the datasource. The graph 
     // monitors and changes the form
     var LineChart = Chart.extend({
         constructor: function(viewset, concept_pk){
             this.range_form = new Form({fields:[viewset.data]}, concept_pk).dom;
             this.base();
             this.extremes = this.chart.xAxis[0].getExtremes();
             // Listen for changes in the form and make the chart reflect
             this.range_form.bind("ElementChangedEvent", manual_field_handler);
             // By default select the middle 1/3 of the chart
             var xrange = extremes.max - extremes.min;
             var third = (1/3) * xrange;
             
             // Set the initial middle selected range in the form and in the graph.
             // TODO Set these using events so as not to need to know internals.
             $("input[name*=input0]", $range_form).val((extremes.min+third).toFixed(1));
             $("input[name*=input1]", $range_form).val((extremes.min+2*third).toFixed(1));
         },
         render: function(){
             this.range_form.find("input").css("margin","10px");
             this.dom = $('<div class="chart"></div>');
             
             this.options.chart.renderTo = dom.get(0);
             this.options.chart.defaultSeriesType = 'line';
             this.options.chart.zoomType = 'x';
             this.options.title = this.viewset.data.title;
             // User selects range in chart
             this.options.chart.events.selection = chartSelection;
             // User selects single spot in chart;
             this.options.chart.events.click = chartClick;
             // User clicks on a point on the line
             this.options.plotOptions.series.point.events.click = pointClick;
             
             this.options.series[0].name = this.viewset.data.title;
             this.options.series[0].data = this.viewset.data.coords;
             
             this.options.tooltip.formatter = function() {
                return "" + this.y;
             };
             this.options.xAxis =  {
                 maxPadding:.05,
                 startOnTick:false,
                 title: {
                     text: this.viewset.data.xaxis
                 },
                 labels:{
                       align:"center",
                       y:20
                 }
             };
             this.options.yAxis = {
                 min:0, 
                 title: {
                    style: {
                        fontWeight: 'bold'
                    },
                    text:  this.viewset.data.yaxis,
                    rotation : 270
                 },
                 labels:{
                    rotation:45
                 }
             };
             this.chart = new Highcharts.Chart(this.options);
             
             // Add the form to the bottom of this chart widget
             this.dom.append(this.range_form);
         },
         
         // Create handler for updating graph whnen user changes min and max values
         // in the form
         manual_field_handler : function(event){
             var color = null;
             // Depending on the value of the operator, clicking on the graph
             // will have a different behavior
             // For example, range and exclude:range will allow 
             // selecting a region of the graph.
             // All other operators will insert a line on click.
             // the lt,gt,lte,gte, will insert a box after the user 
             // clicks to indicate the selected region.
             // The exact operators will insert a line.
             var options = this.chart.options;
             var min = parseFloat($("input[name*=input0]", this.range_form).val()).toFixed(1);
             var max = parseFloat($("input[name*=input1]", this.range_form).val()).toFixed(1);
             
             switch($range_form.find("select[name*=operator]").val()) {
                 case "range": 
                     color = LineChart.INCLUDE_COLOR;
                 case "-range":
                     color =  color || LineChart.EXCLUDE_COLOR; // did we drop through from range?
                     if (options.chart.zoomType !== "x"){
                             this.range_form.detach();
                             this.chart.destroy();
                             options.chart.zoomType = "x";
                             options.plotOptions.line.animation = false;
                             this.chart = new Highcharts.Chart(options);
                             this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     if (min && max){     
                            this.chart.xAxis[0].addPlotBand({
                              from: min,
                              to: max,
                              color:color
                            });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "lt":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotLine({
                              value: min,
                              color: LineChart.EXCLUDE_COLOR,
                              width: 3
                         });
                         chart.xAxis[0].addPlotBand({
                              from: extremes.min,
                              to: min,
                              color:color
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "gt":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotLine({
                                     value: min,
                                     color: LineChart.EXCLUDE_COLOR,
                                     width: 3
                         });
                         this.chart.xAxis[0].addPlotBand({
                              from: min,
                              to: this.extremes.max,
                              color:color
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "lte":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotBand({
                              from: this.extremes.min,
                              to: min,
                              color:color
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "gte":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotBand({
                              from: min,
                              to: this.extremes.max,
                              color:color
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "exact":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotLine({
                                     value: min,
                                     color: LineChart.INCLUDE_COLOR,
                                     width: 3
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "-exact":
                     color = LineChart.INCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     
                     if (min){
                         this.chart.xAxis[0].addPlotLine({
                                     value: min,
                                     color: LineChart.EXCLUDE_COLOR,
                                     width: 3
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "isnull":
                     color = LineChart.EXCLUDE_COLOR;
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append(this.range_form);
                     }
                     this.chart.xAxis[0].removePlotBand();
                     this.chart.xAxis[0].addPlotLine({
                                from: extremes.min,
                                to: extremes.max,
                                color:color
                     });
                     this.dom.trigger("HideDependentsEvent");
                     break;
                 case "-isnull":
                     if (options.chart.zoomType !== ""){
                         this.range_form.detach();
                         this.chart.destroy();
                         options.chart.zoomType = "";
                         options.plotOptions.line.animation = false;
                         this.chart = new Highcharts.Chart(options);
                         this.dom.append($range_form);
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     this.chart.xAxis[0].removePlotBand();
                     break;
             }
             this.chart.xAxis[0].isDirty = true;
             this.chart.redraw();
         },
         updateDSEvent : function(evt, ds){
             // pass the datasource to the embedded form
             this.range_form.triggerHandler(evt,[ds]);
         },
         updateElement:  function(evt, element) {
             // Use triggerHandler here because otherwise it will bubble back up
             // the surround container (this object) and start an endless loop.
             this.range_form.triggerHandler(evt,[element]);
             manual_field_handler(null);
         },
         registerElements :  function(evt) {
             $('input,select',this.dom).change(); 
         },
         chartSelection: function(event){
             var color = $range_form.find("select[name*=operator]").val() === "-range" ? EXCLUDE_COLOR : INCLUDE_COLOR;
         
             var min = event.xAxis[0].min;
             var max = event.xAxis[0].max;
         
             min = min < this.extremes.min ? this.extremes.min : min;
             max = max > this.extremes.max ? this.extremes.max : max;
             min = parseFloat(min).toFixed(1);// TODO how are we going to handle this if they are fractions
             max = parseFloat(max).toFixed(1);// TODO properly calculate extremes 
         
             // Set the new values in the form and notify Avocado
             $("input[name*=input0]", this.range_form).val(min).change();
             $("input[name*=input1]", this.range_form).val(max).change();
         
             // We want the graph to reflect the possible operators
             // TODO is all of this actually necessary anymore?
             this.xAxis[0].isDirty = true;
             this.chart.isDirty = true;
             this.xAxis[0].redraw();
             chart.redraw();
             event.preventDefault();
         },
         chartClick: function(event){
             if (this.chart.options.chart.zoomType){ 
                 // If select is on we don't care about click
                 return; 
             }
         
             var min = event.xAxis[0].value;
         
             min = min < this.extremes.min ? this.extremes.min : min;
             min = parseFloat(min).toFixed(1);// TODO how are we going to handle this if they are fractions
         
             // Set the new values in the form and notify Avocado
             $("input[name*=input0]", this.range_form).val(min).change();
               this.xAxis[0].isDirty = true;
               this.chart.isDirty = true;
               this.xAxis[0].redraw();
               this.chart.redraw();
         },
         pointClick: function(event){
               if (this.chart.options.chart.zoomType){ // If select is on we don't care about click
                   return; 
               }
               // NOTE THIS used to this.x.. does this work?
               var min = event.target.x;
         
               min = min < this.extremes.min ? this.extremes.min : min;
                
               // TODO how are we going to handle this if they are fractions
               min = parseFloat(min).toFixed(1);
         
               // Set the new values in the form and notify Avocado
               $("input[name*=input0]", this.range_form).val(min).change();
               this.chart.xAxis[0].isDirty = true;
               this.chart.isDirty = true;
               this.chart.xAxis[0].redraw();
               this.chart.redraw();
         }
     });

     return {
         BarChart: BarChart,
         LineChart: LineChart,
         PieChart: PieChart
     };
});
