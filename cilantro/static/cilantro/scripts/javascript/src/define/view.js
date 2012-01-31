define(['jquery', 'cilantro/define/chart','cilantro/define/form','cilantro/utils/frontdesk', 'cilantro/vendor/base'], function($, Chart, Form, FrontDesk){
     //  **View Class** is the base class for object that represents a tab within the main Cilantro screen. The base class
     // supports construction of HTML forms as well as charts within those forms.
     var View = Base.extend({
            constructor: function(viewset, name){
                // Save off the viewset
                this.viewset = viewset;
                this.fd = new FrontDesk();
                // DOM representation;
                this.view = $('<div class="view"></div>');
                this.name = name;

                var $view = this.view;
                var $this = $(this);

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
                $view.bind("UpdateDSEvent GainedFocusEvent LostFocusEvent RegisterElementsEvent", jQuery.proxy(this.notifyChildren, this));

                // This makes it so we can trigger an event on the view object itself, and still have the
                // DOM element respond to it.
                $(this).bind("GainedFocusEvent LostFocusEvent UpdateQueryButtonClicked " +
                             "HideDependentsEvent RegisterElementsEvent ShowDependentsEvent UpdateDSEvent", jQuery.proxy(this.eventPassThru, this));

                this.render();
            },
            render: function(){  // Iterate over elements of this view and create them, appending them as we go.
                var viewset = this.viewset;
                var view = this.view;
                var fd = this.fd;
                // Views without a first element that is a chart need a
                // title created
                if (viewset.elements[0].type !== "chart")
                {
                    view.append("<h2>"+this.name+"</h2>");
                }

                $.each(this.viewset.elements, function(index, element) {
                       var chart = null;
                       switch (element.type) {
                           case 'form':
                               chart = new Form(element,viewset.concept_id);
                               view.append(chart.dom);
                               fd.checkIn(index,chart.dom);
                               fd.checkOut(index);
                               break;
                           case 'chart':
                               var datatype = element.data.datatype;
                               if (datatype === 'number') {
                                   chart = new Chart.LineChart(element, viewset.concept_id);
                                   view.append(chart.dom);
                                   fd.checkIn(index,chart.dom);
                                   fd.checkOut(index);
                               } else if (datatype === 'nullboolean' || datatype === 'boolean'){
                                   chart = new Chart.PieChart(element,  viewset.concept_id);
                                   view.append(chart.dom);
                                   fd.checkIn(index,chart.dom);
                                   fd.checkOut(index);
                               } else {
                                   chart = new Chart.BarChart(element,  viewset.concept_id);
                                   view.append(chart.dom);
                                   fd.checkIn(index,chart.dom);
                                   fd.checkOut(index);
                               }
                               break;
                           case 'custom':
                                if (element.css){
                                    View.loadCss(element.css);
                                }
                                // We need to keep track of the number of outstanding requests here.
                                // A bug could occur if we return, and updateDS is called before all
                                // the children of the view are initiated.
                                fd.checkIn(index);
                                var offset = viewset.elements[0].type === "chart" ? 0 : 1;
                                require([element.js], function (Plugin) {
                                    var plugin = new Plugin(element, viewset.concept_id);
                                    // We need to make sure we actually put this in the correct spot, as things may have
                                    // changed since the request for the plugin was made.
                                    if (view.children().length - 1 >= index + offset){
                                        $(view.children()[index]).prepend(plugin.dom);
                                    }else{
                                        view.append(plugin.dom);
                                    }
                                    fd.checkOut(index,plugin.dom);
                                });
                                break;
                           default:
                                view.append($('<p>Undefined View!</p>'));
                       }
                   });
            },
            updateElement: function(evt){
                var fd = this.fd;
                $.each(this.viewset.elements, function(index){
                    fd.leaveMessage(index,"triggerHandler",evt);
                });
                evt.stopPropagation();
            },
            toggleDependents: function(evt){
                // We know that evt.target exists already because it fired the event.
                var fd = this.fd;
                if (evt.target === this.view.children().get(0)){
                    $.each(this.viewset.elements, function(index){
                        if (index === 0) return;
                        fd.leaveMessage(index,"triggerHandler",evt);
                    });
                }
                evt.stopPropagation();
            },
            constructQuery: function(evt){
                var custom = false;
                var fd = this.fd;
                $.each(this.viewset.elements, function(i, e) {
                    if (e.type == 'custom') {
                        custom = true;
                        fd.leaveMessage(i, "triggerHandler", 'ConstructElementQueryEvent');
                    }
                });

                if (!custom) {
                    this.view.trigger("ConstructQueryEvent");
                }
                evt.stopPropagation();
            },
            notifyChildren: function(evt,arg){
              var fd = this.fd;
              $.each(this.viewset.elements, function(index){
                    fd.leaveMessage(index, "triggerHandler", evt, arg);
              });
            },
            eventPassThru: function(evt, arg){
                this.view.triggerHandler(evt, arg);
            },
            dom: function(){
                return this.view;
            }
     },{
            // Simple dynamic load CSS function (taken from http://requirejs.org/docs/faq-advanced.html#css)
            loadCss: function(url) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
     });
     return View;
});
