define(['define/chart','define/form', 'lib/base'], function(chart, form){
     var View = Base.extend({
            constructor: function(viewset, name){
                // Save off the viewset 
                this.viewset = viewset;
                // DOM representation;
                this.view = $('<div class="view"></div>');
                var $view = this.view;
                var $this = $(this);
                
                // Views without a first element not a chart or custom 
                // will require a title
                if (!(viewset.elements[0].type in {chart:1,custom:1}) ){
                       $view.append("<h2>"+name+"</h2>");
                }
                
                // Notify a view that the datasource has changed.
                // Note that proxy is used here to so that the callbacks will have reference
                // to their owning object.
                $view.bind("UpdateElementEvent", jQuery.proxy(this.updateElement, this));
                
                // Notify the view that the dependent elements should be hidden or shown
                // This is used in the situation where a user chooses that the main element 
                // in a form should be equal to null. Anything that depends on it no longer
                // matters.
                $view.bind("HideDependentsEvent ShowDependentsEvent", jQuery.proxy(this.toggleDependents, this));
                
                // The view can choose to override this function and create the server-query object
                // itself, or just tell the framework to use the datasource.
                // If creating the server-query itself, the view must throw a "UpdateQueryEvent" with
                // the associated-server query object
                $view.bind("UpdateQueryButtonClicked", jQuery.proxy(this.constructQuery, this));
                
                // These events need to be passed to view elements
                $view.bind("UpdateDSEvent GainedFocusEvent", jQuery.proxy(this.notifyChildren, this));
                
                // This makes it so we can trigger an event on the view object itself, and still have the
                // DOM element respond to it.
                $(this).bind("UpdateQueryButtonClicked GainedFocusEvent UpdateQueryButtonClicked " +      
                             "HideDependentsEvent ShowDependentsEvent UpdateDSEvent", jQuery.proxy(this.eventPassThru,this));
                
                // Iterate over elements of this view and create them, appending them as we go.
                $.each(viewset.elements, function(index, element) {
                    switch (element.type) {
                        case 'form':
                            $view.append(form.Form(element,viewset.concept_id)); 
                            break;
                        case 'chart':
                            var datatype = element.data.datatype;
                            if (datatype === 'number') {
                                $view.append(chart.getLineChart(element, viewset.concept_id)); 
                            } else if (datatype === 'nullboolean' || datatype === 'boolean'){
                                $view.append(chart.getPieChart(element,  viewset.concept_id));
                            } else {
                                $view.append(chart.getBarChart(element,  viewset.concept_id));
                            }
                            break;
                        case 'custom':
                            break;
                        default:
                            $view.append($('<p>Undefined View!</p>'));                
                    }
                });
            },
            updateElement: function(evt){
                this.view.children().each(function(){$(this).triggerHandler(evt);});
                evt.stopPropagation();   
            },
            toggleDependents: function(evt){
                if (evt.target === this.view.children().get(0)){
                    this.view.children().slice(1).each(function(){$(this).triggerHandler(evt);});
                }
                evt.stopPropagation();
            },
            constructQuery: function(evt){
                this.view.trigger("ConstructQueryEvent");
                evt.stopPropagation();
            },
            notifyChildren: function(evt){
              this.view.children().each(function(){$(this).triggerHandler(evt);});
              evt.stopPropagation();
            },
            eventPassThru: function(evt){
                this.view.triggerHandler(evt);
            },
            dom: function(evt){
                return this.view;
            }
     });
     return View;
});