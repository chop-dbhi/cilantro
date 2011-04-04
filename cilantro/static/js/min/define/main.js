define('define/events', {

    ACTIVATE_DESCRIPTION: 'activate-description',
    DEACTIVATE_DESCRIPTION: 'deactivate-description',
    
    ACTIVATE_CATEGORY: 'activate-category',
    SYNC_CATEGORY: 'sync-category',
    
    ACTIVATE_CRITERION: 'activate-criterion'   

});
var Base=function(){};Base.extend=function(a,b){var c=Base.prototype.extend;Base._prototyping=!0;var d=new this;c.call(d,a),d.base=function(){},delete Base._prototyping;var e=d.constructor,f=d.constructor=function(){if(!Base._prototyping)if(this._constructing||this.constructor==f)this._constructing=!0,e.apply(this,arguments),delete this._constructing;else if(arguments[0]!=null)return(arguments[0].extend||c).call(arguments[0],d)};f.ancestor=this,f.extend=this.extend,f.forEach=this.forEach,f.implement=this.implement,f.prototype=d,f.toString=this.toString,f.valueOf=function(a){return a=="object"?f:e.valueOf()},c.call(f,b),typeof f.init=="function"&&f.init();return f},Base.prototype={extend:function(a,b){if(arguments.length>1){var c=this[a];if(c&&typeof b=="function"&&(!c.valueOf||c.valueOf()!=b.valueOf())&&/\bbase\b/.test(b)){var d=b.valueOf();b=function(){var a=this.base||Base.prototype.base;this.base=c;var b=d.apply(this,arguments);this.base=a;return b},b.valueOf=function(a){return a=="object"?b:d},b.toString=Base.toString}this[a]=b}else if(a){var e=Base.prototype.extend;!Base._prototyping&&typeof this!="function"&&(e=this.extend||e);var f={toSource:null},g=["constructor","toString","valueOf"],h=Base._prototyping?0:1;while(i=g[h++])a[i]!=f[i]&&e.call(this,i,a[i]);for(var i in a)f[i]||e.call(this,i,a[i])}return this}},Base=Base.extend({constructor:function(){this.extend(arguments[0])}},{ancestor:Object,version:"1.1",forEach:function(a,b,c){for(var d in a)this.prototype[d]===undefined&&b.call(c,a[d],d,a)},implement:function(){for(var a=0;a<arguments.length;a++)typeof arguments[a]=="function"?arguments[a](this.prototype):this.prototype.extend(arguments[a]);return this},toString:function(){return String(this.valueOf())}})define("lib/base", function(){});
define("rest/resource",["lib/base"],function(){Resource=Base.extend({url:"",dataType:"json",timeout:5e3,interval:15,uid:"id",_setup:function(a){if(this.loaded!==!0){var b=$.isArray(a)?[]:{};this._=$.extend(!0,b,a),this.store={},this.template&&(this.dom=this.render(this.template)),this.loaded=!0}},_fetch:function(){var a=this,b={type:"GET",url:this.url,dataType:this.dataType,success:function(b){a._setup(b)}};this.xhr=$.ajax(b)},ready:function(a){a=a||function(){};if(this.loaded)a.apply(this);else{attempts=arguments[1]||parseInt(this.timeout/this.interval),this.store&&!this.xhr&&this._setup(this.store),this.url&&!this.xhr&&this._fetch();if(!--attempts)throw new Error("Failed to get a response");var b=this;setTimeout(function(){b.ready(a,attempts)},15)}return this},render:function(a){arguments.length===1&&typeof a=="object"?(data=a,a=this.template):data=arguments[1]||this._,$.isArray(data)||(data=[data]),typeof a=="string"&&(a=$.jqotec(a));var b,c,d,e,f,g=[];for(var h=0,i=data.length;h<i;h++)e=data[h],c=$.jqote(a,e),d=$(c).data(e),b=this.uid?e[this.uid]:h,this.store[b]=d,g.push.apply(g,d.toArray());return $(g)},grep:function(a,b){var c=arguments[3]||this._;c=$.isArray(c)?c:[c];var d;this.ready(function(){d=$.grep(c,function(c,d){return $(c).data(a)===b})});return d}});return Resource})/*
 * The categories, functionally, are proxies for the criterion objects that
 * are the main interactive component.
 *
 * On Load:
 * - request categories, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the category has been changed
 *
 * All events are in the 'category' namespace.
 */

define('define/categories', ['define/events', 'rest/resource'],

    function(Events, Resource) {

        var template = [
            '<span id="tab-<%= this.name.toLowerCase() %>" ',
                'class="tab" data-id="<%= this.id %>">',
                '<div class="icon"></div>',
                '<span><%= this.name %></span>',
            '</span>'
        ].join('');

        var CategoryCollection;

        $(function() {

            var dom = {
                categories: $('#categories'),
                subcategories: $('#subcategories')
            };

            dom.categories.current = null;

            CategoryCollection = new Resource({

                url: dom.categories.data('uri'),
                template: template

            }).ready(function() {

                dom.categories.html(this.dom);
                this.dom.first().click();

            });

            /*
             * Handles doing the necessary processing for 'activating' the
             * defined category
             */ 
            dom.categories.bind(Events.ACTIVATE_CATEGORY,
                    
                function(evt, id) {

                    // test cache
                    if (dom.categories.current === id)
                        return false;
                    dom.categories.current = id;

                    CategoryCollection.ready(function() {

                        var target = this.store[id];
                        target.addClass('active');
                        target.siblings().removeClass('active');
                        
                        // check for associated criterion and trigger
                        var state = target.data('_state');
                        if (!!state && state.criterion)
                            dom.categories.trigger(Events.ACTIVATE_CRITERION,
                                [state.criterion]);

                    });

                }
            );

            /*
             * When a criterion is activated, the id gets cached to be
             * associated with the current category.
             */ 
            dom.categories.bind(Events.SYNC_CATEGORY,
                    
                function(evt, id, criterion_id) {

                    CategoryCollection.ready(function() {

                        var target = this.store[id];
                        // stored in a 'hidden' object to not be mistakingly
                        // associated with the actual data of the object
                        target.data('_state', {criterion: criterion_id});
                        dom.categories.trigger(Events.ACTIVATE_CATEGORY, [id]);

                    });

                    return false;
                }
            );

            /*
             * User-triggerable events
             */
            dom.categories.delegate('span.tab', 'click', function(evt) {

                $(evt.currentTarget).trigger(Events.ACTIVATE_CATEGORY,
                    [$(this).data('id')]);

            });

            dom.subcategories.delegate('span', 'click', function(evt) {

                var target = $(this);
                target.addClass('active').siblings().removeClass('active');
                return false;

            });

        }); 

        return CategoryCollection;
    }
);
define('define/viewelement',["lib/base"], function(){
    // This is the Abstract Base Class (it will throw exceptions if you don't implement updateElement, elementChanged, and render) for view elements.
    // A view must contain at least one view element. There are two builtin view elements, forms, and charts. Custom view elements can be written and mixed,
    // with the builtin ones to create a unified view.
    var ViewElement = Base.extend({   
        constructor : function(viewset, concept_pk){
            this.state = "INIT";
            this.ds = {};
            this.viewset = viewset;
            this.concept_pk = concept_pk;
            this.dom = $();
            this.render();
            
            // Whenever an element changes, call elementChanged
            this.dom.delegate('input,select,textarea', 'change keyup', $.proxy(this.elementChanged, this));
            
            // Bind to events, but this will refer to the object, not the event target.
            this.dom.bind('UpdateElementEvent', $.proxy(this.updateElement, this));
            this.dom.bind('UpdateDSEvent', $.proxy(this.updateDS, this));
            this.dom.bind('GainedFocusEvent', $.proxy(this.gainedFocus, this));
            this.dom.bind('LostFocusEvent', $.proxy(this.lostFocus, this));
            this.dom.bind('RegisterElementsEvent', $.proxy(this.registerElements, this));
            this.dom.bind('HideDependentsEvent', $.proxy(this.hideDependents, this));
            this.dom.bind('ShowDependentsEvent', $.proxy(this.showDependents, this));
      },
      render: function(){
          // This function needs to set the "form" attribute of this object.
          throw({
              name: 'FunctionNotImplementedException',
              message: 'This function needs to set the "dom" attribute of this object.'
          });
      },
      elementChanged: function(evt){
          // This function needs to trigger an ElementChangedEvent with the new value of the evt.target.
          throw({
              name: 'FunctionNotImplementedException',
              message: 'This function needs to trigger an ElementChangedEvent with the new value of the evt.target.'
          });
      },
      updateElement: function(evt, element) {
          // This function needs to find the element whose name = element.name, and set its value to element.value.
          throw({
              name: 'FunctionNotImplementedException',
              message: 'This function needs to find the element whose name = element.name, and set its value to element.value.'
          });
      },  
      updateDS: function(evt, ds){
          for (var key in ds){
              this.updateElement("UpdateElementEvent", {name:key, value:ds[key]});
          }
          this.ds = ds;
          this.dom.data("datasource", ds);
      },
      registerElements: function(evt) {
          $("input,select", this.dom).change(); 
      },
      gainedFocus: function(){
          this.state = "ONSCREEN";
      },
      lostFocus: function(){
          this.state = "OFFSCREEN";
      },
      hideDependents: function(evt){
         if ((this.dom[0] !== (evt.originalEvent ? evt.originalEvent.target : evt.target)) && (this.dom.has(evt.target).length === 0)){ 
             $("input,select,label", this.dom).attr("disabled","true").change();
         }
      },
      showDependents: function(evt){
         if ((this.dom[0] !==  (evt.originalEvent ? evt.originalEvent.target : evt.target)) && (this.dom.has(evt.target).length === 0)){ 
             $("input,select,label", this.dom).filter(":disabled").removeAttr("disabled").change();
         }
      }
    });
    return ViewElement;
});define('define/form',["define/viewelement"], function(ViewElement) {
    // Templates used by the form class
    var decOperatorsTmpl = ['<option selected id="<%=this.field_id%>" value="range">is between</option>',
                            '<option id="<%=this.field_id%>" value="-range">is not between</option>',
                            '<option id="<%=this.field_id%>" value="lt">is less than</option>',
                            '<option id="<%=this.field_id%>" value="gt">is greater than</option>',
                            '<option id="<%=this.field_id%>" value="lte">is less than or equal to</option>',
                            '<option id="<%=this.field_id%>" value="gte">is greater than or equal to</option>',
                            '<option id="<%=this.field_id%>" value="exact">is equal to</option>',
                            '<option id="<%=this.field_id%>" value="-exact">is not equal to</option>',
                            '<option id="<%=this.field_id%>" value="isnull">is null</option>',
                            '<option id="<%=this.field_id%>" value="-isnull">is not null</option>'];
    var choiceOperatorsTmpl = ['<option selected value="in">is equal to</option>',
                               '<option value="-in">is not equal to</option>'];
    var freeTextOperatorsTmpl = ['<option selected value="iexact">is equal to</option>',
                                 '<option value="-iexact">is not equal to</option>',
                                 '<option value="in">is one of</option>',
                                 '<option value="-in">is not one of</option>',
                                 '<option value="icontains">contains</option>',
                                 '<option value="-icontains">does not contain</option>'];

    var Form  = ViewElement.extend({
        constructor: function(viewset, concept_pk){
            this.base(viewset, concept_pk);
            // Add javascript date picker to date inputs
            $('input[data-validate="date"]', this.dom).datepicker({
                changeMonth: true,
                changeYear: true
            });
        },
        // For most cases we use the name attribute to constuct a unique id for all inputs (see field_id in the template context 
        // object below). The format for it is <concept primary key>_<field primary key> with optional "_input[01]" to support datatypes that
        // require ranges, and "_operator" to indicate the field represents an operator that can be changed by the users. With nothing appended to the 
        // end of the name, this indicates a "choice" or "assertion" (which maps to a check box) datatype. There is one exception that complicates things:
        // Some concepts include a field that is itself variable. That is to say that the user will supply some sort of value, for example, a decimal range,
        // and then they will need to tell us which field in the database this range should be applied to. An example should clear this up. For Pure
        // Tone Average (PTA), the user will select a range in the graph, and then below there will be a drop box that says "in the" and then a single choice
        // dropdown. The choices in the dropdown ("both","better ear", "worse ear") will actually represent the fields that the PTA ranges are to be applied to.
        // To indicate this type of a field, the concept description from the server will not contain a "pk" field for these types of fields. This will indicate 
        // that the pk is determined by the user. Fields whose database field id are "variable" will have their name attribute set like this 
        // <concept id>_tbd
        
        // A little bit about nullboolean vs boolean:
        // boolean's can be represented two ways 
        // Optional booleans have to be single select dropdowns with a blank option so 
        // the user can choose to not select it.
        // Required booleans are a checkbox. They can also be displayed as a pie chart.
        // nullbooleans can also be charted as pie charts, or they can be displayed as a multi-select boxes,
        // however they have an additional caveat. While they appear to be a "CHOICE" , in sql you cannot
        // actually use booleans with the IN operator, so for this datatype, we have to generate a more complex query
        // where it would be ITEM = TRUE or ITEM = null, etc.
        render: function(){
            var form_elements = {
                      nullboolean: Form.nullboolean_tmpl,
                      'boolean': Form.boolean_tmpl,
                      date: Form.number_tmpl,
                      'number': Form.number_tmpl,
                      'string': Form.string_tmpl,
                      'string-list': Form.stringlist_tmpl
            };
            var dom = this.dom = $('<span class="form_container"></span>');
            var concept_pk = this.concept_pk;
            $.each(this.viewset.fields, function(index,element){
                 var input = [form_elements[element.datatype]];
                 // Wrap each discrete element in <p>
                 input.unshift($.jqotec("<p>"));
                 input.push($.jqotec("</p>"));

                 // Does this element contain a "pk" attribute? See large comment above for reason
                 if (!element.hasOwnProperty("pk")){
                     // Append additional dropdown for user to choose which field this applies to
                     input.push(Form.pk_tmpl);
                 }
                 // TODO determine if this can go. Do we need to convert null to strings?
                 $.each(['choices', 'pkchoices'], function(index, attr){
                      element[attr] && $.each(element[attr], function(index, choice){
                            // null needs to be "No Data"
                            if ( element[attr][index][0] === null){
                                 element[attr][index][0] = "null";
                            }          
                            if ( element[attr][index][1] === "None"){
                                 element[attr][index][1] = "No Data";
                            }           
                      });
                 });

                 // The following scheme for generating name attributes will be used:
                 // Elements that represent non-variable fields on the concept will have their name attribute constructed as follows:
                 // <concept_id>_<field_id>
                 // Elements that can be applied to a variable primary key will have their name attribute constructed as follows:
                 // <concept_id>_<sorted list of possible field_ids separated by 'OR'>
                 // Elements that represent the dropdown operator which will be used to determine the variable field ID will have their
                 // name attribute constructed as follows
                 // <sorted list of possible field_id choices contained within separated by 'OR'> 
                 // This should be the same string that comes after the <concept_id> in the element that is dependent on this one

                 var name_attribute = null;
                 var pkchoice_name_attribute = null;
                 if (element.hasOwnProperty("pk")){
                     // Standard name scheme "<concept id>_<field id>"
                     name_attribute = concept_pk + "_" + element.pk;
                 }else{
                     // Name scheme for field which the user choices the field it applies to
                     var int_ids = $.map(element.pkchoices, function(element, index){
                         return parseInt(element[0]);
                     });
                     int_ids.sort();
                     pkchoice_name_attribute = int_ids.join("OR");
                     name_attribute = concept_pk + "_" + pkchoice_name_attribute;
                 }
                 var $row = $($.jqote(input, {"datatype":element.datatype,
                                              "choices":element.choices,
                                              "field_id":name_attribute,
                                              "label":element.name,
                                              "pkchoices":element.pkchoices,
                                              "pkchoice_label":element.pkchoice_label,
                                              "pkchoice_id":pkchoice_name_attribute,
                                              "optional": element.hasOwnProperty('optional') ? element.optional : false,
                                              "default": element.hasOwnProperty('default') ? element["default"]: 0,
                                              "pkchoice_default": element.hasOwnProperty('pkchoice_default') ? element["pkchoice_default"]: 0}));
                 $row.children().not("span").wrap("<span/>");
                 dom.append($row);
           });
        },
        elementChanged: function(evt){
             var $target = $(evt.target);
             // This is bad, but there is a situtation where, when an element is 
             // swapped out for another type of element (text input to textarea)
             // a situation can occur where all the elements are populated with the datasource
             // except text inputs whose value contains new lines which have to be skipped because the
             // new lines will be stripped when you insert, you tell all elements to register with the 
             // datasource, you swap out the text input, put in the textarea, update it,
             // and then next the original input's update executes (out of luck of the order)
             // and registers as being empty. This fixes this by not doing it if the element is no longer in the DOM

             // TODO: This raises the question, after populating values from the datasource, we make all elements fire 
             // as if they had changed (which shouldn't change anything except in the bug above) but causes them to 
             // hide and show any fields that are dependent on the data (decimals that are dependent on operator, textarea or inputs
             // that are dependent on operator.). Should the update view event be separated from the elementchangedevent?
             if (!$.contains(this.dom.get(0), $target.get(0))) return;
             var sendValue;
             var ds;
             var dom = this.dom;
             var ref = this;
             switch (evt.target.type){
                     case "checkbox": sendValue = evt.target.checked;
                                     sendValue = $target.is(":visible") && $target.is(":enabled") ? sendValue: undefined;
                                     dom.trigger("ElementChangedEvent", [{name:evt.target.name,value:sendValue}]);
                                     break;
                     case "select-one"      :
                     case "select-multiple" : 
                     case "select"          : var selected = [];
                                              var $associated_inputs = null;
                                              // If this is an operator for a free input text box, and the user has 
                                              // just changed from an equals or not equals to in or not in, we are goin
                                              // to change the input to be a text-area. Figure out if this an operator 
                                              // and who the associated input is
                                              var op_match = Form.opRe.exec($target.attr("name"));
                                              if (op_match){
                                                  // Get the associated text input
                                                  $associated_inputs = $("[name^="+op_match[1]+"_"+op_match[2]+"]", dom).not($target).not("span");
                                              }
                                              $("option", $(evt.target)).each(function(index,opt){
                                                  if  (opt.selected) {
                                                     selected.push(opt.value);
                                                     var cont_types = {decimal:1, number:1, date:1};
                                                     if ($associated_inputs && $associated_inputs.attr("data-validate") in cont_types){
                                                          // Do we need to show 1, 2, or no inputs?
                                                          if (opt.value.search(/range/) >= 0){
                                                              // two inputs
                                                              $("input[name="+opt.id+"_input1]",dom).show().change();
                                                              $("label[for="+opt.id+"_input1]",dom).show();
                                                              // Trigger change on associated inputs because they need to work with a range operator now
                                                              $("input[name="+opt.id+"_input0]",dom).show().change();
                                                          } else if (opt.value.search(/null/) >= 0){
                                                              // no inputs
                                                              $("input[name="+opt.id+"_input1],", dom).hide().change();
                                                              $("label[for="+opt.id+"_input1]", dom).hide();
                                                              $("input[name="+opt.id+"_input0]", dom).hide().change();

                                                          } else {
                                                              // one input
                                                              $("input[name="+opt.id+"_input1],", dom).hide().change();
                                                              $("label[for="+opt.id+"_input1]", dom).hide();
                                                              $("input[name="+opt.id+"_input0]", dom).show().change();
                                                          }
                                                      } else if ($associated_inputs && $associated_inputs.attr("type") in {"text":1, "textarea":1}){
                                                          // The operator has associated inputs, and they are of type text or textarea:
                                                          // This section takes care of modifying textinputs when the user changes the operator
                                                          // to be an IN operator.
                                                          // One of the convenience things we allows is the pasting of newline sepearate text so that
                                                          // for example, someone can paste in an excel column of patient aliases.
                                                          // If the user selects an IN operator, we switch the text input -> textarea and vice versa
                                                          if (opt.value.search(/exact/) >= 0 && $associated_inputs.attr("type") === "textarea"){
                                                              // The operator is of type exact, but the associated input is a text area, switch to text input
                                                              $associated_inputs.data("switch").data("switch", $associated_inputs);
                                                              $associated_inputs.before($associated_inputs.data("switch")).detach();
                                                              $associated_inputs.data("switch").keyup();
                                                              // Swap out textarea with text
                                                          } else if (opt.value.search(/^-?in$/)>=0 && $associated_inputs.attr("type") === "text"){
                                                              // The operator is of type in, but the associated input is a text input, switch to textarea
                                                              if (!$associated_inputs.data("switch")){
                                                                 // We have not yet done a switch, otherwise we would have saved it, so we have to actually create the
                                                                 // textarea. This happens only once per input
                                                                 var $mline = $('<textarea rows="8" id="'+$associated_inputs.attr("id")+'" name="'+$associated_inputs.attr("name")+'" cols="25"></textarea>').data("switch",$associated_inputs);
                                                                 
                                                                 $associated_inputs.before($mline).detach();
                                                                 ds = dom.data("datasource")||{};
                                                                 // We are in this code for one of 3 reasons

                                                                 if (ds[$associated_inputs.attr('name')] instanceof Array) {
                                                                     // #1. We are reloading the page, and switching the original text input to textarea
                                                                     ref.updateElement(null, {name:$associated_inputs.attr('name'), value:ds[$associated_inputs.attr('name')]});
                                                                 } else if (typeof(ds[$associated_inputs.attr('name')])==="string") {
                                                                     // #2. We typed something into the original text input, but then switched to textarea, populate it
                                                                     ref.updateElement(null, {name:$associated_inputs.attr('name'), value:[ds[$associated_inputs.attr('name')]]});
                                                                 }else {
                                                                     // #3. We never typed anything into the original text input, just switched to textara
                                                                     ref.updateElement(null, {name:$associated_inputs.attr('name'), value:[]});
                                                                 }
                                                                 $mline.keyup();
                                                             }else{
                                                                 // The alternative input has already been created, just use it.
                                                                 $associated_inputs.data("switch").data("switch", $associated_inputs);
                                                                 $associated_inputs.before($associated_inputs.data("switch")).detach();
                                                                 $associated_inputs.data("switch").keyup();
                                                             }
                                                          }
                                                      }
                                                  }
                                              });

                                              // Since this code executes for select choices boxes as well as operators (which should
                                              // never be plural), we make sure to send the correct type array, or single item
                                              if (evt.target.type === "select-multiple"){
                                                  var selected_prim = [];
                                                  var l  = selected.length;
                                                  for (var index = 0; index < l; index++) {
                                                      var val = selected[index];
                                                      selected_prim.push(val in Form.s_to_primative_map ? Form.s_to_primative_map[val] : val);
                                                  }
                                                  // If a select-multiple box is optional, and nothing is selected, send undefined so that it doesn't appear as empty in 
                                                  // the datasource, eitherwise, we will throw an error if nothing is supplied;
                                                  sendValue = selected_prim;
                                              } else { 
                                                  sendValue = selected[0] in Form.s_to_primative_map ? Form.s_to_primative_map[selected[0]] : selected[0];
                                              }
                                              
                                              if ($target.is('[data-optional=true]')) {
                                                 sendValue = $.type(sendValue) in {string:1, array:1} && sendValue.length === 0 ? undefined : sendValue;
                                              }
                                              
                                              sendValue = (this.state === "INIT" && $target.css("display")!=="none") || 
                                                          ($target.is(":visible") && $target.is(":enabled")) ? sendValue: undefined;
                                              dom.trigger("ElementChangedEvent", [{name:evt.target.name, value:sendValue}]);
                                              break;
                     case "textarea": sendValue = (this.state === "INIT" && $target.css("display") !== "none") || 
                                                  ($target.is(':visible') && $target.is(":enabled")) ? $target.val().split("\n") : undefined;
                                      dom.trigger("ElementChangedEvent", [{name:evt.target.name,value:sendValue}]);
                                      break;
                     default   : // This catches input boxes, if input boxes are not currently visible, send undefined for them
                                 // Input boxes require an extra validation step because of the free form input

                                 var associated_operator = $(evt.target).closest("p").find("select").val();
                                 var name_prefix = evt.target.name.substr(0,evt.target.name.length-1);
                                 // This one is a little tricky because it matters not just that the fields map to valid numbers
                                 // but that in the case of a range style operator, the two numbers are sequential, and finally
                                 // if fields have become hidden due to a change in operator, we no longer want to list that something
                                 // is wrong with the field even if there is (because it doesn't matter)
                                 switch ($target.attr('data-validate')){
                                     case "number" :
                                     case "decimal":
                                     case "date"  : 
                                                     var datatype = $target.attr('data-validate');
                                                     var $input1 = $("input[name="+name_prefix+"0]",dom);
                                                     var $input2 = $("input[name="+name_prefix+"1]",dom);
                                                     var input_evt;
                                                     if (datatype === "date"){
                                                         var value1 = new Date($input1.val());
                                                         var value2 = new Date($input2.val());
                                                     }
                                                     else {
                                                         var value1 = parseFloat($input1.val());
                                                         var value2 = parseFloat($input2.val());
                                                     }

                                                     if (datatype !== "date" && $target.is(":visible") && isNaN(Number($target.val()))) {
                                                         // Field contains a non-number and is visible
                                                         input_evt = $.Event("InvalidInputEvent");
                                                         $target.trigger(input_evt);
                                                     }else if ($(evt.target).hasClass('invalid')){ //TODO Don't rely on this
                                                         // Field either contains a number or is not visible
                                                         // Either way it was previously invalid
                                                         input_evt = $.Event("InputCorrectedEvent");
                                                         $target.trigger(input_evt);
                                                     } else if ((associated_operator.search(/range/) >= 0) && (value1 > value2)) { // && ($input2.is(":visible"))) {
                                                         // A range operator is in use, both fields are visible, and their values are not sequential
                                                         input_evt = $.Event("InvalidInputEvent");
                                                         input_evt.reason = "badrange";
                                                         input_evt.message = "First input must be less than second input.";
                                                         $target.parent().trigger(input_evt);
                                                     } else if ($(evt.target).parent().hasClass('invalid_badrange') && (($input2.css("display") === "none")||(value1 < value2))){ //TODO Don't rely on this
                                                         // A range operator is or was in use, and either a range operator is no longer in use, so we don't care, or 
                                                         // its in use but the values are now sequential.
                                                         input_evt = $.Event("InputCorrectedEvent");
                                                         input_evt.reason = "badrange";
                                                         $target.parent().trigger(input_evt);
                                                     }   
                                                     break;
                                     default: break;
                                 }
                                 sendValue = (this.state === "INIT" && $target.css("display") !== "none") ||
                                             ($target.is(':visible') && $target.is(":enabled")) ? $target.val() : undefined;
                                 dom.trigger("ElementChangedEvent", [{name:evt.target.name,value:sendValue}]);
                                 break;
              }
              evt.stopPropagation();
        },
        updateElement: function(evt, element){
            // Find the element within our DOM
            var $element = $("[name="+element.name+"]", this.dom);
            // Also note that values that are not string or numbers need to 
            // be converted to a string before being displayed to the user
            // For example, you cannot set the value of an option tag to a boolean or null;
            // it does not work.
            
            // Note: Just because we are here doesn't mean we contain the element
            // to be updated, it may reside on another view within this concept
            if ($element.length === 0) return;
            var type = $element.attr("type");
            switch (type){
                case "checkbox": $element.attr("checked", element.value);
                                 break;
                case "select-multiple": var iterator = $.isArray(element.value) ? element.value : [element.value];
                                        $("option", $element).each( function(index, opt){ // TODO can i somehow just set an array here ?
                                            var vals = $.map(iterator, function(val, index){
                                                return typeof val in {string:1, number:1} ? val : String(val);
                                            });
                                            if ($.inArray(opt.value, vals)!=-1){
                                                opt.selected = true;
                                            }else{
                                                opt.selected = false;
                                            }
                                        });
                                        break;
                case "textarea": $element.val(element.value.join("\n"));
                                 break;
                default:  // This will catch inputs and singular selects
                          if ($.isArray(element.value)) break; // If this is an array, we can't put it in single line input
                                                               // Hold off until the operator swap causes this to become
                                                               // a textarea
                          $element.attr("value", typeof element.value in {string:1, number:1} ? element.value : String(element.value)); 
                          break;
            }
        }
    },
    // Class instance variables
    {   // jQote templates used by the form, on the Class instance
        s_to_primative_map: {"true":true, "false":false, "null":null},
        opRe: /^(\d*)_(\d+(?:OR\d+)*)_operator$/,
        nullboolean_tmpl:  $.jqotec(['<label for="<%=this.field_id%>"><%=this.label%></label>',
                                    '<select data-datatype="nullboolean"data-optional="<%=this.optional%>"  multiple id ="<%=this.field_id%>" name="<%=this.field_id%>">',
                                        '<option <%=this["default"]===true?"selected":""%> value="true">Yes</option>',
                                        '<option <%=this["default"]===false?"selected":""%> value="false">No</option>',
                                        '<option <%=this["default"]===null?"selected":""%> value="null">No Data</option>',
                                    '</select>'].join('')),
        boolean_tmpl: $.jqotec( ['<%if (this.optional) {%>',
                                     '<label for="<%=this.field_id%>"><%=this.label%></label>',
                                     '<select data-datatype="boolean" data-optional="<%=this.optional%>" id ="<%=this.field_id%>" name="<%=this.field_id%>">',
                                          '<option value="">No Preference</option>',
                                          '<option <%=this["default"]===true?"selected":""%> value="true">Yes</option>',
                                          '<option <%=this["default"]===false?"selected":""%> value="false">No</option>',
                                     '</select>',
                                 '<%} else {%>', 
                                      '<input type="checkbox" name="<%=this.field_id%>" value="<%=this.field_id%>" <%= this["default"] ? "checked":""%>/>',
                                      '<label for="<%=this.field_id%>"><%=this.label%></label>',
                                 '<%}%>'].join('')),
        number_tmpl:  $.jqotec(['<label for="<%=this.field_id%>"><%=this.label%></label>',
                                '<select id="<%=this.field_id%>_operator" name="<%=this.field_id%>_operator">',
                                   decOperatorsTmpl.join(''),
                                '</select>',
                                '<span class="input_association" name="<%=this.field_id%>_input_assoc">',
                                '<input data-validate="<%=this.datatype%>" id="<%=this.field_id%>_input0" type="text" name="<%=this.field_id%>_input0" size="5">',
                                '<label for="<%=this.field_id%>_input1">and</label>',
                                '<input data-validate="<%=this.datatype%>" id="<%=this.field_id%>_input1" type="text" name="<%=this.field_id%>_input1" size="5">',
                                '</span>'].join("")),
        string_tmpl: $.jqotec([ '<% if (this.choices) {%>',
                                     '<label for="<%=this.field_id%>"><%=this.label%></label>', // No defaults for this type, doesn't make sense
                                         '<select id="<%=this.field_id%>-operator" name="<%=this.field_id%>_operator">',
                                            choiceOperatorsTmpl.join(''),
                                         '</select>',
                                     '<select multiple="multiple" id="<%=this.field_id%>-value" name="<%=this.field_id%>" size="3" data-optional="<%=this.optional%>" >',
                                     '<% for (var index = 0; index < this.choices.length; index++) { %>',
                                            '<option value="<%=this.choices[index][0]%>"><%=this.choices[index][1]%></option>',
                                     '<%}%>',
                                     '</select>',
                                 '<%} else {%>',
                                      '<label for="<%=this.field_id%>"><%=this.label%></label>', // No defaults for this type, doesn't make sense
                                      '<select id="<%=this.field_id%>-operator" name="<%=this.field_id%>_operator">',
                                           freeTextOperatorsTmpl.join(''),
                                      '</select>',
                                      '<input data-optional="<%=this.optional%>" type="text" id="<%=this.field_id%>_text" name="<%=this.field_id%>" size = "10">',
                                 '<%}%>'].join('')),
        stringlist_tmpl: $.jqotec([ '<label for="<%=this.field_id%>"><%=this.label%></label>', // No defaults for this type, doesn't make sense
                                    '<select id="<%=this.field_id%>-operator" name="<%=this.field_id%>_operator">',
                                           choiceOperatorsTmpl.join(''),
                                     '</select>',
                                     '<textarea data-optional="<%=this.optional%>" id="<%=this.field_id%>_text" name="<%=this.field_id%>" rows="8" cols="25"></textarea>'
                                  ].join('')),
        pk_tmpl: $.jqotec(['<p><label for="<%=this.pkchoice_id%>"><%=this.pkchoice_label%></label>',
                            '<select id="<%=this.pkchoice_id%>" name="<%=this.pkchoice_id%>">',
                            '<% for (index in this.pkchoices) { %>',     
                                    '<option value="<%=this.pkchoices[index][0]%>" <%=this.pkchoices[index][0]==this.pkchoice_default ? "selected":""%>><%=this.pkchoices[index][1]%></option>',
                            '<%}%>',
                            '</select></p>'
                          ].join(''))
        
    });
    return Form;
});
(function(){function r(a){var b=[],c=[],d;for(d=0;d<a.length;d++)b[d]=a[d].plotX,c[d]=a[d].plotY;this.xdata=b,this.ydata=c,a=[],this.y2=[];var e=c.length;this.n=e,this.y2[0]=0,this.y2[e-1]=0,a[0]=0;for(d=1;d<e-1;d++){var f=b[d+1]-b[d-1];f=(b[d]-b[d-1])/f;var g=f*this.y2[d-1]+2;this.y2[d]=(f-1)/g,a[d]=(c[d+1]-c[d])/(b[d+1]-b[d])-(c[d]-c[d-1])/(b[d]-b[d-1]),a[d]=(6*a[d]/(b[d+1]-b[d-1])-f*a[d-1])/g}for(b=e-2;b>=0;b--)this.y2[b]=this.y2[b]*this.y2[b+1]+a[b]}function q(f,i){function bq(){var a="onreadystatechange";G||s.readyState=="complete"?(_(),br(f.series||[],function(a){p(a)}),bU.inverted=cp=e(cp,f.chart.inverted),bU.plotSizeX=cf=cp?ca:ce,bU.plotSizeY=cg=cp?ce:ca,bU.tracker=ch=new n(bU,f.tooltip),J(),br(co,function(a){a.translate(),a.setTooltipPoints()}),bU.render=bc,bc(),by(bU,"load"),i&&i(bU)):s.attachEvent(a,function(){s.detachEvent(a,arguments.callee),bq()})}function bp(){var a=co.length;bx(t,"unload",bp),bx(bU);for(br(cm,function(a){bx(a)});a--;)co[a].destroy();bQ.onmousedown=bQ.onmousemove=bQ.onmouseup=bQ.onclick=null,bQ.parentNode.removeChild(bQ),bQ=null,clearInterval(cs);for(a in bU)delete bU[a]}function bc(){var b,c=f.labels,d=f.credits,e=bv.borderWidth||0,g=bv.backgroundColor,h=bv.plotBackgroundColor,i=bv.plotBackgroundImage;b=2*e+(bv.shadow?8:0),(e||g)&&cq.rect(b/2,b/2,bS-b,bT-b,bv.borderRadius,e).attr({stroke:bv.borderColor,"stroke-width":e,fill:g||X}).add().shadow(bv.shadow),h&&cq.rect(bL,bC,ce,ca,0).attr({fill:h}).add().shadow(bv.plotShadow),i&&cq.image(i,bL,bC,ce,ca).add(),bv.plotBorderWidth&&cq.rect(bL,bC,ce,ca,0,bv.plotBorderWidth).attr({stroke:bv.plotBorderColor,"stroke-width":bv.plotBorderWidth,zIndex:4}).add(),cl&&br(cm,function(a){a.render()}),$(),c.items&&br(c.items,function(){var b=a(c.style,this.style),d=parseInt(b.left,10)+bL,e=parseInt(b.top,10)+bC+12;delete b.left,delete b.top,cq.text(this.html,d,e,b).attr({zIndex:2}).add()}),br(co,function(a){a.render()}),cj=bU.legend=new cv(bU),bU.toolbar||(bU.toolbar=k(bU)),d.enabled&&!bU.credits&&cq.text(d.text,bS-10,bT-5,d.style,0,"right").on("click",function(){location.href=d.href}).attr({zIndex:8}).add(),bU.hasRendered=!0,bO&&(bN.appendChild(bQ),l(bO))}function _(){bN=bv.renderTo,bR=U+K++,typeof bN=="string"&&(bN=s.getElementById(bN)),bN.innerHTML="",bN.offsetWidth||(bO=bN.cloneNode(0),g(bO,{position:R,top:"-9999px",display:""}),s.body.appendChild(bO));var b=(bO||bN).offsetHeight;bU.chartWidth=bS=bv.width||(bO||bN).offsetWidth||600,bU.chartHeight=bT=bv.height||(b>bC+bE?b:0)||400,bU.plotWidth=ce=bS-bL-bD,bU.plotHeight=ca=bT-bC-bE,bU.plotLeft=bL,bU.plotTop=bC,bU.container=bQ=h(Q,{className:"highcharts-container"+(bv.className?" "+bv.className:""),id:bR},a({position:S,overflow:T,width:bS+W,height:bT+W,textAlign:"left"},bv.style),bO||bN),bU.renderer=cq=bv.renderer=="SVG"?new bM(bQ,bS,bT):new bP(bQ,bS,bT)}function $(){var a=f.title,b=a.align,c=f.subtitle,d=c.align,e={left:0,center:bS/2,right:bS};a&&a.text&&cq.text(a.text,e[b]+a.x,a.y,a.style,0,b).attr({"class":"highcharts-title"}).add(),c&&c.text&&cq.text(c.text,e[d]+c.x,c.y,c.style,0,d).attr({"class":"highcharts-subtitle"}).add()}function V(){return bs(co,function(a){return a.selected})}function M(){var a=[];br(co,function(b){a=a.concat(bs(b.data,function(a){return a.selected}))});return a}function J(){var a=f.xAxis||{},b=f.yAxis||{},c;a=d(a),br(a,function(a,b){a.index=b,a.isX=!0}),b=d(b),br(b,function(a,b){a.index=b}),cm=a.concat(b),bU.xAxis=[],bU.yAxis=[],cm=bt(cm,function(a){c=new j(bU,a),bU[c.isXAxis?"xAxis":"yAxis"].push(c);return c}),r()}function F(a){var b,c,d;for(b=0;b<cm.length;b++)if(cm[b].options.id==a)return cm[b];for(b=0;b<co.length;b++)if(co[b].options.id==a)return co[b];for(b=0;b<co.length;b++){d=co[b].data;for(c=0;c<d.length;c++)if(d[c].id==a)return d[c]}return null}function D(){bz(b$,{opacity:0},{duration:f.loading.hideDuration,complete:function(){g(b$,{display:X})}}),b_=!1}function C(b){var c=f.loading;b$||(b$=h(Q,{className:"highcharts-loading"},a(c.style,{left:bL+W,top:bC+W,width:ce+W,height:ca+W,zIndex:10,display:X}),bQ),h("span",null,c.labelStyle,b$)),b_||(g(b$,{opacity:0,display:""}),b$.getElementsByTagName("span")[0].innerHTML=b||f.lang.loading,bz(b$,{opacity:c.style.opacity},{duration:c.showDuration}),b_=!0)}function B(){for(var a=bU.isDirty,b,c=co.length,d=c,e;d--;){e=co[d];if(e.isDirty&&e.options.stacking){b=!0;break}}if(b)for(d=c;d--;)e=co[d],e.options.stacking&&(e.isDirty=!0);br(co,function(b){b.isDirty&&(b.cleanData(),b.getSegments(),b.options.legendType=="point"&&(a=!0))}),cn=null,cl&&(br(cm,function(a){a.setScale()}),r(),br(cm,function(a){a.isDirty&&a.redraw()})),br(co,function(a){a.isDirty&&a.visible&&a.redraw()}),a&&cj.renderLegend&&(cj.renderLegend(),bU.isDirty=!1),ch&&ch.resetTracker&&ch.resetTracker(),by(bU,"redraw")}function r(){bv.alignTicks!==!1&&br(cm,function(a){a.adjustTickAmount()})}function q(a,b){var c;b=e(b,!0),by(bU,"addSeries",{options:a},function(){c=p(a),c.isDirty=!0,bU.isDirty=!0,b&&bU.redraw()});return c}function p(a){var b=a.type||bv.defaultSeriesType,c=bB[b],d=bU.hasRendered;d&&(cp&&b=="column"?c=bB.bar:!cp&&b=="bar"&&(c=bB.column)),b=new c,b.init(bU,a),!d&&b.inverted&&(cp=!0),b.isCartesian&&(cl=b.isCartesian),co.push(b);return b}function n(b,d){function k(){b.trackerGroup=ci=cq.g("tracker"),cp&&ci.attr({width:b.plotWidth,height:b.plotHeight}).invert(),ci.attr({zIndex:9}).translate(bL,bC).add()}function j(){var d=!0;bQ.onmousedown=function(a){a=e(a),a.preventDefault&&a.preventDefault(),b.mouseIsDown=bZ=!0,l=a.chartX,n=a.chartY,cl&&(s||u)&&(q||(q=cq.rect(bL,bC,v?1:ce,w?1:ca,0).attr({fill:"rgba(69,114,167,0.25)",zIndex:7}).add()))},bQ.onmousemove=function(a){a=e(a),a.returnValue=!1;var b=a.chartX,c=a.chartY,f=!bX(b-bL,c-bC);bZ?(p=Math.sqrt(Math.pow(l-b,2)+Math.pow(n-c,2))>10,v&&(a=b-l,q.attr({width:A(a),x:(a>0?0:a)+l})),w&&(c=c-n,q.attr({height:A(c),y:(c>0?0:c)+n}))):f||g(a),f&&!d&&(h(),i()),d=f;return!1},bQ.onmouseup=function(){i()},bQ.onclick=function(d){var g=b.hoverPoint;d=e(d),d.cancelBubble=!0;if(!p)if(g&&c(d.target,"isTracker")){var h=g.plotX,i=g.plotY;a(g,{pageX:ck.x+bL+(cp?ce-i:h),pageY:ck.y+bC+(cp?ca-h:i)}),by(b.hoverSeries||g.series,"click",a(d,{point:g})),g.firePointEvent("click",d)}else a(d,f(d)),bX(d.chartX-bL,d.chartY-bC)&&by(b,"click",d);p=!1}}function i(){if(q){var a={xAxis:[],yAxis:[]},c=q.getBBox(),d=c.x-bL,e=c.y-bC;p&&(br(cm,function(b){var f=b.translate,g=b.isXAxis,h=cp?!g:g,i=f(h?d:ca-e-c.height,!0);f=f(h?d+c.width:ca-e,!0),a[g?"xAxis":"yAxis"].push({axis:b,min:z(i,f),max:y(i,f)})}),by(b,"selection",a,ct)),q=q.destroy()}b.mouseIsDown=bZ=p=!1}function h(){var a=b.hoverSeries,c=b.hoverPoint;c&&c.onMouseOut(),a&&a.onMouseOut(),bY&&bY.hide()}function g(a){var c=b.hoverPoint,d=b.hoverSeries;d&&d.tracker&&((a=d.tooltipPoints[cp?a.chartY:a.chartX-bL])&&a!=c&&a.onMouseOver())}function f(a){var b={xAxis:[],yAxis:[]};br(cm,function(c){var d=c.translate,e=c.isXAxis,f=cp?!e:e;b[e?"xAxis":"yAxis"].push({axis:c,value:d(f?a.chartX-bL:ca-a.chartY+bC,!0)})});return b}function e(a){a=a||t.event,a.target||(a.target=a.srcElement);if(a.type!="mousemove"||t.opera)ck=o(bQ);E?(a.chartX=a.x,a.chartY=a.y):a.layerX===P?(a.chartX=a.pageX-ck.x,a.chartY=a.pageY-ck.y):(a.chartX=a.layerX,a.chartY=a.layerY);return a}var l,n,p,q,r=bv.zoomType,s=/x/.test(r),u=/y/.test(r),v=s&&!cp||u&&cp,w=u&&!cp||s&&cp;k(),d.enabled&&(b.tooltip=bY=m(d)),j(),cs=setInterval(function(){cr&&cr()},32),a(this,{zoomX:s,zoomY:u,resetTracker:h})}function m(a){function d(d){var f=d.series,g=a.borderColor||d.color||f.color||"#606060",m,n;n=d.tooltipText,m=d.tooltipPos,e=f,f=v(m?m[0]:cp?ce-d.plotY:d.plotX),d=v(m?m[1]:cp?ca-d.plotX:d.plotY),m=bX(f,d),n!==!1&&m?(j&&(o.show(),j=!1),q.attr({text:n}),n=q.getBBox(),k=n.width,l=n.height,p.attr({width:k+2*h,height:l+2*h,stroke:g}),g=f-k+bL-25,f=d-l+bC+10,g<7&&(g=7,f-=20),f<5?f=5:f+l>bT&&(f=bT-l-5),b(v(g-i),v(f-i))):c()}function c(){j=!0,o.hide()}function b(a,c){m=j?a:(2*m+a)/3,n=j?c:(n+c)/2,o.translate(m,n),cr=A(a-m)>1||A(c-n)>1?function(){b(a,c)}:null}var e,f=a.borderWidth,g=a.style,h=parseInt(g.padding,10),i=f+h,j=!0,k,l,m=0,n=0;g.padding=0;var o=cq.g("tooltip").attr({zIndex:8}).add(),p=cq.rect(i,i,0,0,a.borderRadius,f).attr({fill:a.backgroundColor,"stroke-width":f}).add(o).shadow(a.shadow),q=cq.text("",h+i,parseInt(g.fontSize,10)+h+i).attr({zIndex:1}).css(g).add(o);return{refresh:d,hide:c}}function k(){function b(a){l(c[a].element),c[a]=null}function a(a,b,d,e){c[a]||(b=cq.text(b,bL+ce-20,bC+30,f.toolbar.itemStyle,0,"right").on("click",e).attr({zIndex:20}).add(),c[a]=b)}var c={};return{add:a,remove:b}}function j(c,d){function F(a,b){K.categories=bY=a,br(_,function(a){a.translate(),a.setTooltipPoints(!0)}),K.isDirty=!0,e(b,!0)&&D()}function D(){ch.resetTracker&&ch.resetTracker(),B(),br(_,function(a){a.isDirty=!0})}function C(a){br([bN,bO],function(b){for(var c=0;c<b.length;c++)if(b[c].id==a){b.splice(c,1);break}}),B()}function B(){var a=d.title,c=d.alternateGridColor,e=d.minorTickWidth,f=d.lineWidth,g,k;g=_.length&&b(bp)&&b(bc),V?(V.empty(),W.empty()):(V=cq.g("axis").attr({zIndex:7}).add(),W=cq.g("grid").attr({zIndex:1}).add());if(g||bt){c&&br(bU,function(a,b){b%2===0&&a<bc&&i(a,bU[b+1]!==P?bU[b+1]:bc,c)}),br(bN,function(a){i(a.from,a.to,a.color)});if(bQ&&!bY)for(g=bp;g<=bc;g+=bQ)h(g,d.minorGridLineColor,d.minorGridLineWidth),e&&j(g,d.minorTickPosition,d.minorTickColor,e,d.minorTickLength);br(bU,function(a,b){k=a+b$,h(k,d.gridLineColor,d.gridLineWidth),j(a,d.tickPosition,d.tickColor,d.tickWidth,d.tickLength,(a!=bp||d.showFirstLabel)&&(a!=bc||d.showLastLabel),b)}),br(bO,function(a){h(a.value,a.color,a.width)})}!K.hasRenderedLine&&f&&(e=bL+(H?ce:0)+Q,g=bT-bE-(H?ca:0)+Q,cq.path(cq.crispLine([Y,I?bL:e,I?g:bC,Z,I?bS-bD:e,I?g:bT-bE],f)).attr({stroke:d.lineColor,"stroke-width":f,zIndex:7}).add(),K.hasRenderedLine=!0),!K.hasRenderedTitle&&!K.axisTitle&&a&&a.text&&(f=I?bL:bC,f=({low:f+(I?0:S),middle:f+S/2,high:f+(I?S:0)})[a.align],e=(I?bC+ca:bL)+(I?1:-1)*(H?-1:1)*a.margin-(E?parseInt(a.style.fontSize||12,10)/3:0),K.axisTitle=cq.text(a.text,(I?f:e+(H?ce:0)+Q)+(a.x||0),(I?e-(H?ca:0)+Q:f)+(a.y||0),a.style,a.rotation||0,({low:"left",middle:"center",high:"right"})[a.align]).attr({zIndex:7}).add(),K.hasRenderedTitle=!0),K.isDirty=!1}function A(a){var b=a.width,c=b?bO:bN;c.push(a),b?h(a.value,a.color,a.width):i(a.from,a.to,a.color)}function t(a){bp>a?a=bp:bc<a&&(a=bc);return g(a,0,1)}function s(){return{min:bp,max:bc,dataMin:X,dataMax:$}}function r(a,b,d){d=e(d,!0),by(K,"setExtremes",{min:a,max:b},function(){bY&&(a<0&&(a=0),b>bY.length-1&&(b=bY.length-1)),ba=a,bb=b,d&&c.redraw()})}function q(){var a,g,h,i=bp,j=bc;a=d.maxZoom;var l;f(),bp=e(ba,d.min,X),bc=e(bb,d.max,$),bt&&(l=c[G?"xAxis":"yAxis"][d.linkedTo],l=l.getExtremes(),bp=e(l.min,l.dataMin),bc=e(l.max,l.dataMax)),bc-bp<a&&(l=(a-bc+bp)/2,bp=y(bp-l,e(d.min,bp-l)),bc=z(bp+a,e(d.max,bp+a))),!bY&&!bA&&!bt&&b(bp)&&b(bc)&&(a=bc-bp||1,!b(d.min)&&!b(ba)&&bq&&(X<0||!bx)&&(bp-=a*bq),!b(d.max)&&!b(bb)&&bs&&($>0||!bz)&&(bc+=a*bs)),bP=bY||bp==bc?1:e(d.tickInterval,(bc-bp)*d.tickPixelInterval/S),!M&&!b(d.tickInterval)&&(bP=k(bP)),bQ=d.minorTickInterval==="auto"&&bP?bP/5:d.minorTickInterval,o(),T=S/(bc-bp||1),cn||(cn={x:0,y:0}),!M&&bU.length>cn[R]&&(cn[R]=bU.length);if(!G)for(g in J)for(h in J[g])J[g][h].cum=J[g][h].total;K.isDirty||(K.isDirty=bp!=i||bc!=j)}function p(){if(!M&&!bY){var a=bV,c=bU.length;bV=cn[R];if(c<bV){for(;bU.length<bV;)bU.push(m(bU[bU.length-1]+bP));T*=(c-1)/(bV-1)}b(a)&&bV!=a&&(K.isDirty=!0)}}function o(){M?l():n();var a=bU[0],b=bU[bU.length-1];d.startOnTick?bp=a:bp>a&&bU.shift(),d.endOnTick?bc=b:bc<b&&bU.pop()}function n(){var a;a=w(bp/bP)*bP;var b=x(bc/bP)*bP;bU=[];for(a=m(a);a<=b;)bU.push(a),a=m(a+bP);bY&&(bp-=.5,bc+=.5)}function m(a){var b=(bR<1?v(1/bR):1)*10;return v(a*b)/b}function l(){bU=[];var a,b=N.global.useUTC,c=1e3/L,e=6e4/L,f=36e5/L,g=864e5/L,h=6048e5/L,i=2592e6/L,j=31556952e3/L,l=[["second",c,[1,2,5,10,15,30]],["minute",e,[1,2,5,10,15,30]],["hour",f,[1,2,3,4,6,8,12]],["day",g,[1,2]],["week",h,[1,2]],["month",i,[1,2,3,4,6]],["year",j,null]],m=l[6],n=m[1],o=m[2];for(a=0;a<l.length;a++){m=l[a],n=m[1],o=m[2];if(l[a+1]){var p=(n*o[o.length-1]+l[a+1][1])/2;if(bP<=p)break}}n==j&&bP<5*n&&(o=[1,2,5]),l=k(bP/n,o);var q;o=new Date(bp*L),o.setMilliseconds(0),n>=c&&o.setSeconds(n>=e?0:l*w(o.getSeconds()/l)),n>=e&&o[bk](n>=f?0:l*w(o[be]()/l)),n>=f&&o[bl](n>=g?0:l*w(o[bf]()/l)),n>=g&&o[bm](n>=i?1:l*w(o[bh]()/l)),n>=i&&(o[bn](n>=j?0:l*w(o[bi]()/l)),q=o[bj]()),n>=j&&(q-=q%l,o[bo](q)),n==h&&o[bm](o[bh]()-o[bg]()+d.startOfWeek),a=1,q=o[bj](),c=o.getTime()/L,e=o[bi]();for(f=o[bh]();c<bc&&a<ce;)bU.push(c),n==j?c=bd(q+a*l,0)/L:n==i?c=bd(q,e+a*l)/L:b||n!=g&&n!=h?c+=n*l:c=bd(q,e,f+a*l*(n==g?1:7)),a++;bU.push(c),bW=d.dateTimeLabelFormats[m[0]]}function k(a,b){var c;bR=b?1:u.pow(10,w(u.log(a)/u.LN10)),c=a/bR,b||(b=[1,2,2.5,5,10],d.allowDecimals===!1&&(bR==1?b=[1,2,5,10]:bR<=.1&&(b=[1/bR])));for(var e=0;e<b.length;e++){a=b[e];if(c<=(b[e]+(b[e+1]||b[e]))/2)break}a*=bR;return a}function j(a,b,c,e,f,h,i){var j,k,l,m=d.labels;b=="inside"&&(f=-f),H&&(f=-f),b=k=g(a+b$)+U,j=l=bT-g(a+b$)-U,I?(j=bT-bE-(H?ca:0)+Q,l=j+f):(b=bL+(H?ce:0)+Q,k=b-f),e&&cq.path(cq.crispLine([Y,b,j,Z,k,l],e)).attr({stroke:c,"stroke-width":e}).add(V);if(h&&m.enabled)if((a=bX.call({index:i,isFirst:a==bU[0],isLast:a==bU[bU.length-1],dateTimeLabelFormat:bW,value:bY&&bY[a]?bY[a]:a}))||a===0)b=b+m.x-(b$&&I?b$*T*(bZ?-1:1):0),j=j+m.y-(b$&&!I?b$*T*(bZ?1:-1):0),cq.text(a,b,j,m.style,m.rotation,m.align).add(V)}function i(a,b,c){a=y(a,bp),b=z(b,bc);var d=(b-a)*T;h(a+(b-a)/2,c,d)}function h(a,b,c){if(c){var d,e,f;d=g(a);var h;a=e=d+U,d=f=bT-d-U;if(I){d=bC,f=bT-bE;if(a<bL||a>bL+ce)h=!0}else{a=bL,e=bS-bD;if(d<bC||d>bC+ca)h=!0}h||cq.path(cq.crispLine([Y,a,d,Z,e,f],c)).attr({stroke:b,"stroke-width":c}).add(W)}}function g(a,b,c){var d=1,e=0;c&&(d*=-1,e=S),bZ&&(d*=-1,e-=d*S),bp===P?a=null:b?(bZ&&(a=S-a),a=a/T+bp):a=d*(a-bp)*T+e;return a}function f(){var a=[],c;X=$=null,_=[],br(co,function(e){c=!1,br(["xAxis","yAxis"],function(a){e.isCartesian&&(a=="xAxis"&&G||a=="yAxis"&&!G)&&(e.options[a]==d.index||e.options[a]===P&&d.index===0)&&(e[a]=K,_.push(e),c=!0)}),!e.visible&&bv.ignoreHiddenSeries&&(c=!1);if(c){var f,g;G||(f=e.options.stacking,bA=f=="percent",f&&(g=a[e.type]||[],a[e.type]=g),bA&&(X=0,$=99)),e.isCartesian&&(br(e.data,function(a){var c=a.x,d=a.y;X===null&&(X=$=a[R]),G?c>$?$=c:c<X&&(X=c):b(d)&&(f&&(g[c]=g[c]?g[c]+d:d),a=g?g[c]:d,bA||(a>$?$=a:a<X&&(X=a)),f&&(J[e.type][c]={total:a,cum:a}))}),/(area|column|bar)/.test(e.type)&&!G&&(X<0?$<0&&($=0,bz=!0):(X=0,bx=!0)))}})}var G=d.isX,H=d.opposite,I=cp?!G:G,J={bar:{},column:{},area:{},areaspline:{},line:{}};d=bu(G?bF:bG,I?H?bK:bJ:H?bI:bH,d);var K=this,M=d.type=="datetime",Q=d.offset||0,R=G?"x":"y",S=I?ce:ca,T,U=I?bL:bE,V,W,X,$,_,ba,bb,bc=null,bp=null,bq=d.minPadding,bs=d.maxPadding,bt=b(d.linkedTo),bx,bz,bA,bB=d.events,bM,bN=d.plotBands||[],bO=d.plotLines||[],bP,bQ,bR,bU,bV,bW,bX=d.labels.formatter||function(){var a=this.value;return bW?O(bW,a):a},bY=d.categories||G&&c.columnCount,bZ=d.reversed,b$=bY&&d.tickmarkPlacement=="between"?.5:0;cp&&G&&bZ===P&&(bZ=!0),H||(Q*=-1),I&&(Q*=-1),a(K,{addPlotBand:A,addPlotLine:A,adjustTickAmount:p,categories:bY,getExtremes:s,getThreshold:t,isXAxis:G,options:d,render:B,setExtremes:r,setScale:q,setCategories:F,translate:g,redraw:D,removePlotBand:C,removePlotLine:C,reversed:bZ,stacks:J});for(bM in bB)bw(K,bM,bB[bM]);q()}bF=bu(bF,N.xAxis),bG=bu(bG,N.yAxis),N.xAxis=N.yAxis=null,f=bu(N,f);var bv=f.chart,bA=bv.margin;bA=typeof bA=="number"?[bA,bA,bA,bA]:bA;var bC=e(bv.marginTop,bA[0]),bD=e(bv.marginRight,bA[1]),bE=e(bv.marginBottom,bA[2]),bL=e(bv.marginLeft,bA[3]),bN,bO,bQ,bR,bS,bT,bU=this;bA=bv.events;var bV,bW,bX,bY,bZ,b$,b_,ca,ce,cf,cg,ch,ci,cj,ck,cl=bv.showAxes,cm=[],cn,co=[],cp,cq,cr,cs,ct,cu,cv=function(b){function i(){z=x,A=w,B=G=0,F||(F=cq.g("legend").attr({zIndex:7}).add()),L&&K.reverse(),br(K,function(a){a.options.showInLegend&&(a=a.options.legendType=="point"?a.data:[a],br(a,f))}),L&&K.reverse(),I=H||G,J=B-w+v;if(D||E)I+=2*t,J+=2*t,C?C.attr({height:J,width:I}):C=cq.rect(0,0,I,J,j.borderRadius,D||0).attr({stroke:j.borderColor,"stroke-width":D||0,fill:E||X}).add(F).shadow(j.shadow);for(var b=["left","right","top","bottom"],c,d=4;d--;)c=b[d],p[c]&&p[c]!="auto"&&(j[d<2?"align":"verticalAlign"]=c,j[d<2?"x":"y"]=parseInt(p[c],10)*(d%2?-1:1));var e=bW(a({width:I,height:J},j));F.translate(e.x,e.y),br(o,function(a){var b=a.checkbox;b&&g(b,{left:e.x+a.legendItemWidth+b.x-40+W,top:e.y+b.y-11+W})})}function f(a){var b,e,f=a.legendItem;e=a.series||a,f||(e=/^(bar|pie|area|column)$/.test(e.type),a.legendItem=f=cq.text(j.labelFormatter.call(a),0,0).css(a.visible?q:s).on("mouseover",function(){a.setState(bb),f.css(r)}).on("mouseout",function(){f.css(a.visible?q:s),a.setState()}).on("click",function(){var b="legendItemClick",c=function(){a.setVisible()};a.firePointEvent?a.firePointEvent(b,null,c):by(a,b,null,c)}).attr({zIndex:2}).add(F),!e&&a.options&&a.options.lineWidth&&(a.legendLine=cq.path([Y,-m-n,0,Z,-n,0]).attr({"stroke-width":a.options.lineWidth,zIndex:2}).add(F)),e?b=cq.rect(-m-n,-11,m,12,2).attr({"stroke-width":0,zIndex:3}).add(F):a.options&&a.options.marker&&a.options.marker.enabled&&(b=cq.symbol(a.symbol,-m/2-n,-4,a.options.marker.radius).attr(a.pointAttr[ba]).attr({zIndex:3}).add(F)),a.legendSymbol=b,c(a,a.visible),a.options&&a.options.showCheckbox&&(a.checkbox=h("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},j.itemCheckboxStyle,bQ),bw(a.checkbox,"click",function(b){b=b.target,by(a,"checkboxClick",{checked:b.checked},function(){a.select()})}))),d(a,z,A),b=f.getBBox(),B=A,a.legendItemWidth=b=j.itemWidth||m+n+b.width+u,k?(z+=b,G=H||y(z-x,G),z-x+b>(H||bS-2*t-x)&&(z=x,A+=v)):(A+=v,G=H||y(b,G)),o.push(a)}function e(a){for(var b=o.length,c=a.checkbox;b--;)if(o[b]==a){o.splice(b,1);break}br(["legendItem","legendLine","legendSymbol"],function(b){a[b]&&a[b].destroy()}),c&&l(a.checkbox)}function d(a,b,c){var d=a.legendItem,e=a.legendLine,f=a.legendSymbol;a=a.checkbox,d&&d.attr({x:b,y:c}),e&&e.translate(b,c-4),f&&f.translate(b,c),a&&(a.x=b,a.y=c)}function c(a,b){var c=a.legendItem,d=a.legendLine,e=a.legendSymbol,f=s.color,g=b?j.itemStyle.color:f;a=b?a.color:f,c&&c.css({color:g}),d&&d.attr({stroke:a}),e&&e.attr({stroke:a,fill:a})}var j=b.options.legend;if(j.enabled){var k=j.layout=="horizontal",m=j.symbolWidth,n=j.symbolPadding,o=[],p=j.style,q=j.itemStyle,r=j.itemHoverStyle,s=j.itemHiddenStyle,t=parseInt(p.padding,10),u=20,v=j.lineHeight||16,w=18,x=4+t+m+n,z,A,B,C,D=j.borderWidth,E=j.backgroundColor,F,G,H=j.width,I,J,K=b.series,L=j.reversed;i();return{colorizeItem:c,destroyItem:e,renderLegend:i}}};bX=function(a,b){var c=0,d=0;return a>=c&&a<=c+ce&&b>=d&&b<=d+ca},cu=function(){by(bU,"selection",{resetSelection:!0},ct),bU.toolbar.remove("zoom")},ct=function(a){var b=N.lang;bU.toolbar.add("zoom",b.resetZoom,b.resetZoomTitle,cu),!a||a.resetSelection?br(cm,function(a){a.setExtremes(null,null,!1)}):br(a.xAxis.concat(a.yAxis),function(a){var b=a.axis;bU.tracker[b.isXAxis?"zoomX":"zoomY"]&&b.setExtremes(a.min,a.max,!1)}),B()},bW=function(a){var b=a.align,c=a.verticalAlign,d=a.x||0,e=a.y||0,f={x:d||0,y:e||0};/^(right|center)$/.test(b)&&(f.x=(bS-a.width)/({right:1,center:2})[b]+d),/^(bottom|middle)$/.test(c)&&(f.y=(bT-a.height)/({bottom:1,middle:2})[c]+e);return f},I=H=0,bw(t,"unload",bp);if(bA)for(bV in bA)bw(bU,bV,bA[bV]);bU.options=f,bU.series=co,bU.addSeries=q,bU.destroy=bp,bU.get=F,bU.getAlignment=bW,bU.getSelectedPoints=M,bU.getSelectedSeries=V,bU.hideLoading=D,bU.isInsidePlot=bX,bU.redraw=B,bU.showLoading=C,bq()}function p(){}function o(a){for(var b={x:a.offsetLeft,y:a.offsetTop};a.offsetParent;)a=a.offsetParent,b.x+=a.offsetLeft,b.y+=a.offsetTop,a!=s.body&&a!=s.documentElement&&(b.x-=a.scrollLeft,b.y-=a.scrollTop);return b}function n(a,b,c,d){var e=N.lang;a=a;var f=isNaN(b=A(b))?2:b;b=c===undefined?e.decimalPoint:c,d=d===undefined?e.thousandsSep:d,e=a<0?"-":"",c=parseInt(a=A(+a||0).toFixed(f),10)+"";var g=(g=c.length)>3?g%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+A(a-c).toFixed(f).slice(2):"")}function m(b,c){var d=function(){};d.prototype=new b,a(d.prototype,c);return d}function l(a){M||(M=h(Q)),a&&M.appendChild(a),M.innerHTML=""}function k(){return N}function j(a){N=bu(N,a),i();return N}function i(){var a=N.global.useUTC;bd=a?Date.UTC:function(a,b,c,d,f,g){return(new Date(a,b,e(c,1),e(d,0),e(f,0),e(g,0))).getTime()},be=a?"getUTCMinutes":"getMinutes",bf=a?"getUTCHours":"getHours",bg=a?"getUTCDay":"getDay",bh=a?"getUTCDate":"getDate",bi=a?"getUTCMonth":"getMonth",bj=a?"getUTCFullYear":"getFullYear",bk=a?"setUTCMinutes":"setMinutes",bl=a?"setUTCHours":"setHours",bm=a?"setUTCDate":"setDate",bn=a?"setUTCMonth":"setMonth",bo=a?"setUTCFullYear":"setFullYear"}function h(b,c,d,e,f){b=s.createElement(b),c&&a(b,c),f&&g(b,{padding:0,border:X,margin:0}),d&&g(b,d),e&&e.appendChild(b);return b}function g(b,c){E&&(c&&c.opacity!==P&&(c.filter="alpha(opacity="+c.opacity*100+")")),a(b.style,c)}function f(a){var b="",c;for(c in a)b+=bv(c)+":"+a[c]+";";return b}function e(){var a=arguments,c,d;for(c=0;c<a.length;c++){d=a[c];if(b(d))return d}}function d(a){if(!a||a.constructor!=Array)a=[a];return a}function c(a,c,d){var e,f="setAttribute",g;if(typeof c=="string")b(d)?a[f](c,d):a&&a.getAttribute&&(g=a.getAttribute(c));else if(b(c)&&typeof c=="object")for(e in c)a[f](e,c[e]);return g}function b(a){return a!==P&&a!==null}function a(a,b){a||(a={});for(var c in b)a[c]=b[c];return a}var s=document,t=window,u=Math,v=u.round,w=u.floor,x=u.ceil,y=u.max,z=u.min,A=u.abs,B=u.cos,C=u.sin,D=navigator.userAgent,E=/msie/i.test(D)&&!t.opera,F=/AppleWebKit/.test(D),G=t.SVGAngle||s.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),H,I,J={},K=0,L=1,M,N,O,P,Q="div",R="absolute",S="relative",T="hidden",U="highcharts-",V="visible",W="px",X="none",Y="M",Z="L",_="rgba(192,192,192,"+(G?1e-6:.002)+")",ba="",bb="hover",bc="select",bd,be,bf,bg,bh,bi,bj,bk,bl,bm,bn,bo,bp=t.HighchartsAdapter,bq=bp||{},br=bq.each,bs=bq.grep,bt=bq.map,bu=bq.merge,bv=bq.hyphenate,bw=bq.addEvent,bx=bq.removeEvent,by=bq.fireEvent,bz=bq.animate,bA=bq.stop;bq=bq.getAjax;var bB={};if(!bp&&t.jQuery){var bC=jQuery;br=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c},bs=bC.grep,bt=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c},bu=function(){var a=arguments;return bC.extend(!0,null,a[0],a[1],a[2],a[3])},bv=function(a){return a.replace(/([A-Z])/g,function(a,b){return"-"+b.toLowerCase()})},bw=function(a,b,c){bC(a).bind(b,c)},bx=function(a,b,c){var d=s.removeEventListener?"removeEventListener":"detachEvent";s[d]&&!a[d]&&(a[d]=function(){}),bC(a).unbind(b,c)},by=function(b,c,d,e){var f=bC.Event(c),g="detached"+c;a(f,d),b[c]&&(b[g]=b[c],b[c]=null),bC(b).trigger(f),b[g]&&(b[c]=b[g],b[g]=null),e&&!f.isDefaultPrevented()&&e(f)},bz=function(a,b,c){a=bC(a),a.stop(),a.animate(b,c)},bA=function(a){bC(a).stop()},bq=function(a,b){bC.get(a,null,b)},bC.extend(bC.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});var bD=jQuery.fx.step._default,bE=jQuery.fx.prototype.cur;bC.fx.step._default=function(a){var b=a.elem;b.attr?b.attr(a.prop,a.now):bD.apply(this,arguments)},bC.fx.prototype.cur=function(){var a=this.elem;return a=a.attr?a.attr(this.prop):bE.apply(this,arguments)}}else!bp&&t.MooTools&&(br=$each,bt=function(a,b){return a.map(b)},bs=function(a,b){return a.filter(b)},bu=$merge,bv=function(a){return a.hyphenate()},bw=function(b,c,d){typeof c=="string"&&(c=="unload"&&(c="beforeunload"),b.addEvent||(b.nodeName?b=$(b):a(b,new Events)),b.addEvent(c,d))},bx=function(a,b,c){b&&(b=="unload"&&(b="beforeunload"),a.removeEvent(b,c))},by=function(b,c,d,e){c=new Event({type:c,target:b}),c=a(c,d),c.preventDefault=function(){e=null},b.fireEvent&&b.fireEvent(c.type,c),e&&e(c)},bz=function(b,c,d){var e=b.attr;e&&!b.setStyle&&(b.setStyle=b.getStyle=b.attr,b.$family=b.uid=!0),bA(b),d=new Fx.Morph(e?b:$(b),a(d,{transition:Fx.Transitions.Quad.easeInOut})),d.start(c),b.fx=d},bA=function(a){a.fx&&a.fx.cancel()},bq=function(a,b){(new Request({url:a,method:"get",onSuccess:b})).send()});bp={enabled:!0,align:"center",x:0,y:15,style:{color:"#666",fontSize:"11px"}},N={colors:["#4572A7","#AA4643","#89A54E","#80699B","#3D96AE","#DB843D","#92A8CD","#A47D7C","#B5CA92"],symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],decimalPoint:".",resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0},chart:{margin:[50,50,90,80],borderColor:"#4572A7",borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:!0,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0"},title:{text:"Chart title",x:0,y:20,align:"center",style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",x:0,y:40,align:"center",style:{color:"#6D869F"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:!0,events:{},lineWidth:2,shadow:!0,marker:{enabled:!0,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:bu(bp,{enabled:!1,y:-6,formatter:function(){return this.y}}),showInLegend:!0,states:{hover:{lineWidth:3,marker:{}},select:{marker:{}}},stickyTracking:!0}},labels:{style:{position:R,color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,shadow:!1,style:{padding:"5px"},itemStyle:{cursor:"pointer",color:"#3E576F"},itemHoverStyle:{cursor:"pointer",color:"#000000"},itemHiddenStyle:{color:"#C0C0C0"},itemCheckboxStyle:{position:R,width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:15,y:-15},loading:{hideDuration:100,labelStyle:{fontWeight:"bold",position:S,top:"1em"},showDuration:100,style:{position:R,backgroundColor:"white",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,formatter:function(){var a=this,c=a.series,d=c.xAxis,e=a.x;return"<b>"+(a.point.name||c.name)+"</b><br/>"+(b(e)?"X value: "+(d&&d.options.type=="datetime"?O(null,e):e)+"<br/>":"")+"Y value: "+a.y},backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,shadow:!0,snap:10,style:{color:"#333333",fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},toolbar:{itemStyle:{color:"#4572A7",cursor:"pointer"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",style:{cursor:"pointer",color:"#909090",fontSize:"10px"}}};var bF={dateTimeLabelFormats:{second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",labels:bp,lineColor:"#C0D0E0",lineWidth:1,max:null,min:null,minPadding:.01,maxPadding:.01,maxZoom:null,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",minorTickWidth:1,showFirstLabel:!0,showLastLabel:!1,startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",margin:35,style:{color:"#6D869F",fontWeight:"bold"}},type:"linear"},bG=bu(bF,{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:.05,minPadding:.05,startOnTick:!0,tickWidth:0,title:{margin:40,rotation:270,text:"Y-values"}}),bH={labels:{align:"right",x:-8,y:3},title:{rotation:270}},bI={labels:{align:"left",x:8,y:3},title:{rotation:90}},bJ={labels:{align:"center",x:0,y:14},title:{rotation:0}},bK=bu(bJ,{labels:{y:-5}});bp=N.plotOptions,bq=bp.line,bp.spline=bu(bq),bp.scatter=bu(bq,{lineWidth:0,states:{hover:{lineWidth:0}}}),bp.area=bu(bq,{}),bp.areaspline=bu(bp.area),bp.column=bu(bq,{borderColor:"#FFFFFF",borderWidth:1,borderRadius:0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,states:{hover:{brightness:.1,shadow:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}}),bp.bar=bu(bp.column,{dataLabels:{align:"left",x:5,y:0}}),bp.pie=bu(bq,{borderColor:"#FFFFFF",borderWidth:1,center:["50%","50%"],colorByPoint:!0,legendType:"point",marker:null,size:"90%",slicedOffset:10,states:{hover:{brightness:.1,shadow:!1}}}),i();var bL=function(a){function e(a){f[3]=a;return this}function d(a){if(typeof a=="number"&&a!==0)for(var b=0;b<3;b++)f[b]+=parseInt(a*255,10),f[b]<0&&(f[b]=0),f[b]>255&&(f[b]=255);return this}function c(b){return b=f&&!isNaN(f[0])?b=="rgb"?"rgb("+f[0]+","+f[1]+","+f[2]+")":b=="a"?f[3]:"rgba("+f.join(",")+")":a}function b(a){if(g=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a))f=[parseInt(g[1],10),parseInt(g[2],10),parseInt(g[3],10),parseFloat(g[4],10)];else if(g=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a))f=[parseInt(g[1],16),parseInt(g[2],16),parseInt(g[3],16),1]}var f=[],g;b(a);return{get:c,brighten:d,setOpacity:e}};O=function(a,c,d){function f(a){return a.toString().replace(/^([0-9])$/,"0$1")}if(!b(c)||isNaN(c))return"Invalid date";a=e(a,"%Y-%m-%d %H:%M:%S"),c=new Date(c*L);var g=c[bf](),h=c[bg](),i=c[bh](),j=c[bi](),k=c[bj](),l=N.lang,m=l.weekdays;l=l.months,c={a:m[h].substr(0,3),A:m[h],d:f(i),e:i,b:l[j].substr(0,3),B:l[j],m:f(j+1),y:k.toString().substr(2,2),Y:k,H:f(g),I:f(g%12||12),l:g%12||12,M:f(c[be]()),p:g<12?"AM":"PM",P:g<12?"am":"pm",S:f(c.getSeconds())};for(var n in c)a=a.replace("%"+n,c[n]);return d?a.substr(0,1).toUpperCase()+a.substr(1):a},p.prototype={init:function(a,b){this.element=s.createElementNS("http://www.w3.org/2000/svg",b),this.renderer=a},animate:function(a,b){bz(this,a,b)},attr:function(a,d){var e,f,g,h=this.element,i=h.nodeName,j=this.renderer,k,l=this.shadows,m,n=this;typeof a=="string"&&b(d)&&(e=a,a={},a[e]=d);if(typeof a=="string")e=a,i=="circle"?e=({x:"cx",y:"cy"})[e]||e:e=="strokeWidth"&&(e="stroke-width"),n=parseFloat(c(h,e)||this[e]||0);else for(e in a){d=a[e];if(e=="d")d&&d.join&&(d=d.join(" ")),/(NaN|  |^$)/.test(d)&&(d="M 0 0");else if(e=="x"&&i=="text")for(f=0;f<h.childNodes.length;f++)g=h.childNodes[f],c(g,"x")==c(h,"x")&&c(g,"x",d);else e=="fill"?d=j.color(d,h,e):i=="circle"?e=({x:"cx",y:"cy"})[e]||e:e=="translateX"||e=="translateY"?(this[e]=d,this.updateTransform(),k=!0):e=="stroke"?d=j.color(d,h,e):e=="isTracker"&&(this[e]=d);e=="strokeWidth"&&(e="stroke-width"),F&&e=="stroke-width"&&d===0&&(d=1e-6),this.symbolName&&/^(x|y|r|start|end|innerR)/.test(e)&&(m||(this.symbolAttr(a),m=!0),k=!0);if(l&&/^(width|height|visibility|x|y|d)$/.test(e))for(f=l.length;f--;)c(l[f],e,d);e=="text"?j.buildText(h,d):k||c(h,e,d)}return n},symbolAttr:function(a){var b=this;b.x=e(a.x,b.x),b.y=parseFloat(e(a.y,b.y)),b.r=e(a.r,b.r),b.start=e(a.start,b.start),b.end=e(a.end,b.end),b.width=e(a.width,b.width),b.height=parseFloat(e(a.height,b.height)),b.innerR=e(a.innerR,b.innerR),b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.r,{start:b.start,end:b.end,width:b.width,height:b.height,innerR:b.innerR})})},clip:function(a){return this.attr("clip-path","url("+this.renderer.url+"#"+a.id+")")},css:function(b){var c=this;b&&b.color&&(b.fill=b.color),b=a(c.styles,b),c.attr({style:f(b)}),c.styles=b;return c},on:function(a,b){this.element["on"+a]=b;return this},translate:function(a,b){var c=this;c.translateX=a,c.translateY=b,c.updateTransform();return c},invert:function(){var a=this;a.inverted=!0,a.updateTransform();return a},updateTransform:function(){var a=this,b=a.translateX||0,d=a.translateY||0,e=a.inverted,f=[];e&&(b+=a.attr("width"),d+=a.attr("height")),(b||d)&&f.push("translate("+b+","+d+")"),e&&f.push("rotate(90) scale(-1,1)"),f.length&&c(a.element,"transform",f.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},getBBox:function(){return this.element.getBBox()},show:function(){return this.attr({visibility:V})},hide:function(){return this.attr({visibility:T})},add:function(a){var d=this.renderer,e=a||d;d=e.element||d.box;var f=d.childNodes,g=this.element,h=c(g,"zIndex"),i;this.parentInverted=a&&a.inverted,h&&(e.handleZ=!0,h=parseInt(h,10));if(e.handleZ)for(i=0;i<f.length;i++){a=f[i],e=c(a,"zIndex");if(a!=g&&(parseInt(e,10)>h||!b(h)&&b(e))){d.insertBefore(g,a);return this}}d.appendChild(g);return this},destroy:function(){var a=this,b=a.element,c=a.shadows,d=b.parentNode,e;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=null,bA(a),d&&d.removeChild(b),c&&br(c,function(a){(d=a.parentNode)&&d.removeChild(a)});for(e in a)delete a[e];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},shadow:function(a){var b=[],d,e=this.element,f=this.parentInverted?"(-1,-1)":"(1,1)";if(a){for(a=1;a<=3;a++)d=e.cloneNode(0),c(d,{isShadow:"true",stroke:"rgb(0, 0, 0)","stroke-opacity":.05*a,"stroke-width":7-2*a,transform:"translate"+f,fill:X}),e.parentNode.insertBefore(d,e),b.push(d);this.shadows=b}return this}};var bM=function(){this.init.apply(this,arguments)};bM.prototype={init:function(a,b,d){var e=s.createElementNS("http://www.w3.org/2000/svg","svg"),f=location;c(e,{width:b,height:d,xmlns:"http://www.w3.org/2000/svg",version:"1.1"}),a.appendChild(e),this.Element=p,this.box=e,this.url=E?"":f.href.replace(/#.*?$/,""),this.defs=this.createElement("defs").add()},createElement:function(a){var b=new this.Element;b.init(this,a);return b},buildText:function(a,b){b=b.toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br[^>]?>/g);for(var d=a.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,h=c(a,"x"),i=d.length;i--;)a.removeChild(d[i]);br(b,function(b,d){var i,j=0;b=b.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||"),i=b.split("|||"),br(i,function(b){if(b!==""||i.length==1){var k={},l=s.createElementNS("http://www.w3.org/2000/svg","tspan");e.test(b)&&c(l,"style",b.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2")),f.test(b)&&(c(l,"onclick",'location.href="'+b.match(f)[1]+'"'),g(l,{cursor:"pointer"})),b=b.replace(/<(.|\n)*?>/g,""),l.appendChild(s.createTextNode(b||" ")),j?k.dx=3:k.x=h,d&&!j&&(k.dy=16),c(l,k),a.appendChild(l),j++}})})},crispLine:function(a,b){a[1]==a[4]&&(a[1]=a[4]=v(a[1])+b%2/2),a[2]==a[5]&&(a[2]=a[5]=v(a[2])+b%2/2);return a},path:function(a){return this.createElement("path").attr({d:a,fill:X})},circle:function(a,b,c){a=typeof a=="object"?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){typeof a=="object"&&(b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x);return this.symbol("arc",a||0,b||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(b,c,d,e,f,g){if(arguments.length>1){var h=(g||0)%2/2;b=v(b||0)+h,c=v(c||0)+h,d=v((d||0)-2*h),e=v((e||0)-2*h)}h=typeof b=="object"?b:{x:b,y:c,width:y(d,0),height:y(e,0)};return this.createElement("rect").attr(a(h,{rx:f||h.r,ry:f||h.r,fill:X}))},g:function(a){return this.createElement("g").attr(b(a)&&{"class":U+a})},image:function(a,b,c,d,e){b=this.createElement("image").attr({x:b,y:c,width:d,height:e,preserveAspectRatio:X}),b.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a);return b},symbol:function(b,c,d,e,f){var g,i=this.symbols[b];i=i&&i(c,d,e,f);var j=/^url\((.*?)\)$/;i?(g=this.path(i),a(g,{symbolName:b,x:c,y:d,r:e}),f&&a(g,f)):j.test(b)?(b=b.match(j)[1],g=this.image(b).attr({visibility:T}),h("img",{onload:function(){var a=this;a=J[a.src]||[a.width,a.height],g.attr({x:v(c-a[0]/2)+W,y:v(d-a[1]/2)+W,width:a[0],height:a[1],visibility:"inherit"})},src:b})):g=this.circle(c,d,e);return g},symbols:{square:function(a,b,c){c=.707*c;return[Y,a-c,b-c,Z,a+c,b-c,a+c,b+c,a-c,b+c,"Z"]},triangle:function(a,b,c){return[Y,a,b-1.33*c,Z,a+c,b+.67*c,a-c,b+.67*c,"Z"]},"triangle-down":function(a,b,c){return[Y,a,b+1.33*c,Z,a-c,b-.67*c,a+c,b-.67*c,"Z"]},diamond:function(a,b,c){return[Y,a,b-c,Z,a+c,b,a,b+c,a-c,b,"Z"]},arc:function(a,b,c,d){var e=Math.PI,f=d.start,g=d.end-1e-6,h=d.innerR,i=B(f),j=C(f),k=B(g);g=C(g),d=d.end-f<e?0:1;return[Y,a+c*i,b+c*j,"A",c,c,0,d,1,a+c*k,b+c*g,Z,a+h*k,b+h*g,"A",h,h,0,d,0,a+h*i,b+h*j,"Z"]}},clipRect:function(a,b,c,d){var e=U+K++,f=this.createElement("clipPath").attr({id:e}).add(this.defs);a=this.rect(a,b,c,d,0).add(f),a.id=e;return a},color:function(a,b,d){var e,f=/^rgba/;if(a&&a.linearGradient){var g=this;b="linearGradient",d=a[b];var h=U+K++,i,j,k;i=g.createElement(b).attr({id:h,gradientUnits:"userSpaceOnUse",x1:d[0],y1:d[1],x2:d[2],y2:d[3]}).add(g.defs),br(a.stops,function(a){f.test(a[1])?(e=bL(a[1]),j=e.get("rgb"),k=e.get("a")):(j=a[1],k=1),g.createElement("stop").attr({offset:a[0],"stop-color":j,"stop-opacity":k}).add(i)});return"url("+this.url+"#"+h+")"}if(f.test(a)){e=bL(a),c(b,d+"-opacity",e.get("a"));return e.get("rgb")}return a},text:function(b,c,d,g,h,i){g=g||{},i=i||"left",h=h||0;var j=g.color||"#000000",k=N.chart.style;c=v(e(c,0)),d=v(e(d,0)),a(g,{fontFamily:g.fontFamily||k.fontFamily,fontSize:g.fontSize||k.fontSize}),g=f(g),b={x:c,y:d,text:b,fill:j,style:g.replace(/"/g,"'")};if(h||i!="left")b=a(b,{"text-anchor":({left:"start",center:"middle",right:"end"})[i],transform:"rotate("+h+" "+c+" "+d+")"});return this.createElement("text").attr(b)}};var bN;if(!G){var bO=m(p,{init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ",R,";"];(b=="shape"||b==Q)&&d.push("left:0;top:0;width:10px;height:10px"),c.push(' style="',d.join(""),'"/>'),b&&(c=b==Q||b=="span"||b=="img"?c.join(""):a.prepVML(c),this.element=h(c)),this.renderer=a},add:function(a){var b=this,c=b.renderer,d=b.element,e=c.box;c=a&&a.inverted,a=a?a.element||a:e,c&&(c=a.style,g(d,{flip:"x",left:parseInt(c.width,10)-10,top:parseInt(c.height,10)-10,rotation:-90})),a.appendChild(d);return b},attr:function(a,d){var f,h,i,j=this.element,k=j.style,l=j.nodeName,m=this.renderer,n=this.symbolName,o,p=this.shadows,q=s.documentMode,r,t=this;typeof a=="string"&&b(d)&&(f=a,a={},a[f]=d);if(typeof a=="string")f=a,t=f=="strokeWidth"||f=="stroke-width"?j.strokeweight:e(this[f],parseInt(k[({x:"left",y:"top"})[f]||f],10));else for(f in a){h=a[f],r=!1;if(n&&/^(x|y|r|start|end|width|height|innerR)/.test(f))o||(this.symbolAttr(a),o=!0),r=!0;else if(f=="d"){i=h.length;for(r=[];i--;)r[i]=typeof h[i]=="number"?v(h[i]*10)-5:h[i]=="Z"?"x":h[i];h=r.join(" ")||"x",j.path=h;if(p)for(i=p.length;i--;)p[i].path=h;r=!0}else if(f=="zIndex"||f=="visibility")k[f]=h,q==8&&f=="visibility"&&l=="DIV"&&br(j.childNodes,function(a){g(a,{visibility:h})}),r=!0;else if(/^(width|height)$/.test(f))k[f]=h,this.updateClipping&&this.updateClipping(),r=!0;else if(/^(x|y)$/.test(f))f=="y"&&j.tagName=="SPAN"&&j.lineHeight&&(h-=j.lineHeight),k[({x:"left",y:"top"})[f]]=h;else if(f=="class")j.className=h;else if(f=="stroke")h=m.color(h,j,f),f="strokecolor";else if(f=="stroke-width"||f=="strokeWidth")j.stroked=h?!0:!1,f="strokeweight",typeof h=="number"&&(h+=W);else if(f=="fill")l=="SPAN"?k.color=h:(j.filled=h!=X?!0:!1,h=m.color(h,j,f),f="fillcolor");else if(f=="translateX"||f=="translateY")this[f]=d,this.updateTransform(),r=!0;if(p&&f=="visibility")for(i=p.length;i--;)p[i].style[f]=h;f=="text"?j.innerHTML=h:r||(q==8?j[f]=h:c(j,f,h))}return t},clip:function(a){var b=this,c=a.members,d=c.length;c.push(b),b.destroyClip=function(){c.splice(d,1)};return b.css(a.getCSS(b.inverted))},css:function(a){var b=this;g(b.element,a);return b},destroy:function(){var a=this;a.destroyClip&&a.destroyClip(),p.prototype.destroy.apply(this)},empty:function(){var a=this.element;a=a.childNodes;for(var b=a.length,c;b--;)c=a[b],c.parentNode.removeChild(c)},getBBox:function(){var a=this.element,b,c=a.offsetWidth,d=a.parentNode;c||s.body.appendChild(a),b={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight},c||(d?d.appendChild(a):s.body.removeChild(a));return b},on:function(a,b){this.element["on"+a]=function(){var a=t.event;a.target=a.srcElement,b(a)};return this},updateTransform:function(){var a=this,b=a.translateX||0,c=a.translateY||0;(b||c)&&a.css({left:b,top:c})},shadow:function(a){var b=[],c=this.element,d=this.renderer,e,f=c.style,g,i=c.path;""+c.path==""&&(i="x");if(a){for(a=1;a<=3;a++)g=['<shape isShadow="true" strokeweight="',7-2*a,'" filled="false" path="',i,'" coordsize="100,100" style="',c.style.cssText,'" />'],e=h(d.prepVML(g),null,{left:parseInt(f.left,10)+1,top:parseInt(f.top,10)+1}),g=['<stroke color="black" opacity="',.05*a,'"/>'],h(d.prepVML(g),null,null,e),c.parentNode.insertBefore(e,c),b.push(e);this.shadows=b}return this}});bN=function(){this.init.apply(this,arguments)},bN.prototype=bu(bM.prototype,{isIE8:D.indexOf("MSIE 8.0")>-1,init:function(a,b,c){this.width=b,this.height=c,this.box=h(Q,null,{width:b+W,height:c+W},a),this.Element=bO,s.namespaces.hcv||(s.namespaces.add("hcv","urn:schemas-microsoft-com:vml"),s.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:textpath, hcv\\:shape, hcv\\:stroke, hcv\\:line { behavior:url(#default#VML); display: inline-block; } ")},clipRect:function(b,c,d,e){var f=this.createElement();return a(f,{members:[],element:{style:{left:b,top:c,width:d,height:e}},getCSS:function(b){var c=f.element.style,d=c.top,e=c.left,g=e+c.width;c=d+c.height,d={clip:"rect("+(b?e:d)+"px,"+(b?c:g)+"px,"+(b?g:c)+"px,"+(b?d:e)+"px)"},!b&&s.documentMode==8&&a(d,{width:g+W,height:c+W});return d},updateClipping:function(){br(f.members,function(a){a.css(f.getCSS(a.inverted))})}})},color:function(a,b,c){var d,e=/^rgba/;if(!a||!a.linearGradient){if(e.test(a)){d=bL(a),c=["<",c,' opacity="',d.get("a"),'"/>'],h(this.prepVML(c),null,null,b);return d.get("rgb")}return a}var f,g,i=a.linearGradient,j,k,l,m;br(a.stops,function(a,b){e.test(a[1])?(d=bL(a[1]),f=d.get("rgb"),g=d.get("a")):(f=a[1],g=1),b?(l=f,m=g):(j=f,k=g)}),a=90-u.atan((i[3]-i[1])/(i[2]-i[0]))*180/u.PI,c=["<",c,' colors="0% ',j,",100% ",l,'" angle="',a,'" opacity="',m,'" o:opacity2="',k,'" type="gradient" focus="100%" />'],h(this.prepVML(c),null,null,b)},prepVML:function(a){var b="display:inline-block;behavior:url(#default#VML);",c=this.isIE8;try{a=a.join("")}catch(d){for(var e="",f=0;f<a.length;f++)e+=a[f];a=e}c?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')==-1?a.replace("/>",' style="'+b+'" />'):a.replace('style="','style="'+b)):a=a.replace("<","<hcv:");return a},text:function(b,c,d,e,i,j){e=e||{},j=j||"left",i=i||0;var k=v(parseInt(e.fontSize||12,10)*1.2),l=N.chart.style;c=v(c),d=v(d),a(e,{color:e.color||"#000000",whiteSpace:"nowrap",fontFamily:e.fontFamily||l.fontFamily,fontSize:e.fontSize||l.fontSize});if(i){l=(i||0)*u.PI*2/360,i=B(l),l=C(l);var m=10;k=k*.3;var n=j=="left",o=j=="right",p=n?c:c-m*i;c=o?c:c+m*i,n=n?d:d-m*l,d=o?d:d+m*l,p+=k*l,c+=k*l,n-=k*i,d-=k*i,A(p-c)<.1&&(p+=.1),A(n-d)<.1&&(n+=.1),d=this.createElement("line").attr({from:p+", "+n,to:c+", "+d}),i=d.element,h("hcv:fill",{on:!0,color:e.color},null,i),h("hcv:path",{textpathok:!0},null,i),h('<hcv:textpath style="v-text-align:'+j+";"+f(e).replace(/"/g,"'")+'" on="true" string="'+b.toString().replace(/<br[^>]?>/g,"\n")+'">',null,null,i)}else d=this.createElement("span").attr({x:c,y:d-k,text:b}),i=d.element,i.lineHeight=k,g(i,e),j!="left"&&(b=d.getBBox().width,g(i,{left:c-b/({right:1,center:2})[j]+W}));return d},path:function(a){return this.createElement("shape").attr({coordsize:"100 100",d:a})},circle:function(a,b,c){return this.path(this.symbols.circle(a,b,c))},g:function(a){var b;a&&(b={className:U+a,"class":U+a});return a=this.createElement(Q).attr(b)},image:function(a,b,c,d,e){return this.createElement("img").attr({src:a}).css({left:b,top:c,width:d,height:e})},rect:function(a,b,c,d,e,f){if(arguments.length>1){var g=(f||0)%2/2;a=v(a||0)+g,b=v(b||0)+g,c=v((c||0)-2*g),d=v((d||0)-2*g)}typeof a=="object"&&(b=a.y,c=a.width,d=a.height,e=a.r,a=a.x);return this.symbol("rect",a||0,b||0,e||0,{width:c||0,height:d||0})},symbol:function(a,b,c){var d;d=/^url\((.*?)\)$/;return d=d.test(a)?this.createElement("img").attr({onload:function(){var a=this,d=[a.width,a.height];g(a,{left:v(b-d[0]/2),top:v(c-d[1]/2)})},src:a.match(d)[1]}):bM.prototype.symbol.apply(this,arguments)},symbols:{arc:function(a,b,c,d){var e=d.start,f=d.end,g=f-e==2*Math.PI?f-.001:f,h=B(e),i=C(e),j=B(g);g=C(g),d=d.innerR;if(f-e===0)return["x"];return["wa",a-c,b-c,a+c,b+c,a+c*h,b+c*i,a+c*j,b+c*g,"at",a-d,b-d,a+d,b+d,a+d*j,b+d*g,a+d*h,b+d*i,"x","e"]},circle:function(a,b,c){return["wa",a-c,b-c,a+c,b+c,a+c,b,a+c,b,"e"]},rect:function(a,b,c,d){var e=d.width;d=d.height;var f=a+e,g=b+d;c=z(c,e,d);return[Y,a+c,b,Z,f-c,b,"wa",f-2*c,b,f,b+2*c,f-c,b,f,b+c,Z,f,g-c,"wa",f-2*c,g-2*c,f,g,f,g-c,f-c,g,Z,a+c,g,"wa",a,g-2*c,a+2*c,g,a+c,g,a,g-c,Z,a,b+c,"wa",a,b,a+2*c,b+2*c,a,b+c,a+c,b,"x","e"]}}})}var bP=G?bM:bN,bQ=function(){};bQ.prototype={init:function(a,b){var c=this;c.series=a,c.applyOptions(b),c.pointAttr={},a.options.colorByPoint&&(a=a.chart.options.colors,c.options||(c.options={}),c.color=c.options.color=c.color||a[H++],H>=a.length&&(H=0));return c},applyOptions:function(b){var c=this,d=c.series;c.config=b,typeof b=="number"||b===null?c.y=b:typeof b=="object"&&typeof b.length!="number"?(a(c,b),c.options=b):typeof b[0]=="string"?(c.name=b[0],c.y=b[1]):typeof b[0]=="number"&&(c.x=b[0],c.y=b[1]),c.x===P&&(c.x=d.autoIncrement())},destroy:function(){var a=this,b;a==a.series.chart.hoverPoint&&a.onMouseOut(),bx(a),br(["dataLabel","graphic","tracker","group"],function(b){a[b]&&a[b].destroy()}),a.legendItem&&a.series.chart.legend.destroyItem(a);for(b in a)a[b]=null},select:function(a,b){var c=this,d=c.series;d=d.chart,c.selected=a=e(a,!c.selected),c.firePointEvent(a?"select":"unselect"),c.setState(a&&bc),b||br(d.getSelectedPoints(),function(a){a.selected&&a!=c&&(a.selected=!1,a.setState(ba),a.firePointEvent("unselect"))})},onMouseOver:function(){var a=this,b=a.series.chart,c=b.tooltip,d=b.hoverPoint;d&&d!=a&&d.onMouseOut(),a.firePointEvent("mouseOver"),c&&c.refresh(a),a.setState(bb),b.hoverPoint=a},onMouseOut:function(){var a=this;a.firePointEvent("mouseOut"),a.setState(ba),a.series.chart.hoverPoint=null},update:function(a,b){var c=this,d=c.series;b=e(b,!0),c.firePointEvent("update",{options:a},function(){c.applyOptions(a),d.isDirty=!0,b&&d.chart.redraw()})},remove:function(a){var b=this,c=b.series,d=c.chart,f=c.data,g=f.length;a=e(a,!0),b.firePointEvent("remove",null,function(){for(;g--;)if(f[g]==b){f.splice(g,1);break}b.destroy(),c.isDirty=!0,a&&d.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series;e=e.options,(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents(),a=="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)}),by(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=this,b=bu(a.series.options.point,a.options);b=b.events;var c;a.events=b;for(c in b)bw(a,c,b[c]);this.hasImportedEvents=!0}},setState:function(a){var b=this,c=b.series,d=c.options.states,e=c.options.marker,f=e&&!e.enabled,g=(e=e&&e.states[a])&&e.enabled===!1,h=c.chart,i=b.pointAttr;a||(a=ba),b.selected&&a!=bc||d[a]&&d[a].enabled===!1||a&&(g||f&&!e.enabled)||(a&&!b.graphic?(c.stateMarkerGraphic||(c.stateMarkerGraphic=h.renderer.circle(0,0,i[a].r).attr(i[a]).add(c.group)),c.stateMarkerGraphic.translate(b.plotX,b.plotY)):b.graphic&&b.graphic.attr(i[a]))},setTooltipText:function(){var a=this;a.tooltipText=a.series.chart.options.tooltip.formatter.call({series:a.series,point:a,x:a.category,y:a.y,percentage:a.percentage,total:a.total||a.stackTotal})}};var bR=function(){};bR.prototype={isCartesian:!0,type:"line",pointClass:bQ,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(b,c){var d=this,e,f=b.series.length;d.chart=b,c=d.setOptions(c),a(d,{index:f,options:c,name:c.name||"Series "+(f+1),state:ba,pointAttr:{},visible:c.visible!==!1,selected:c.selected===!0}),b=c.events;for(e in b)bw(d,e,b[e]);d.getColor(),d.getSymbol(),d.setData(c.data,!1)},autoIncrement:function(){var a=this,b=a.options,c=a.xIncrement;c=e(c,b.pointStart,0),a.pointInterval=e(a.pointInterval,b.pointInterval,1),a.xIncrement=c+a.pointInterval;return c},cleanData:function(){var a=this;a=a.data;var b;a.sort(function(a,b){return a.x-b.x});for(b=a.length-1;b>=0;b--)a[b-1]&&a[b-1].x==a[b].x&&a.splice(b-1,1)},getSegments:function(){var a=-1,b=[],c=this.data;br(c,function(d,e){d.y===null?(e>a+1&&b.push(c.slice(a+1,e)),a=e):e==c.length-1&&b.push(c.slice(a+1,e+1))}),this.segments=b},setOptions:function(a){var b=this.chart.options.plotOptions;return a=bu(b[this.type],b.series,a)},getColor:function(){var a=this.chart.options.colors;this.color=this.options.color||a[H++]||"#0000ff",H>=a.length&&(H=0)},getSymbol:function(){var a=this.chart.options.symbols,b=this.options.marker.symbol||a[I++];this.symbol=b,I>=a.length&&(I=0)},addPoint:function(a,b,c){var d=this,f=d.data;a=(new d.pointClass).init(d,a),b=e(b,!0),f.push(a),c&&f[0].remove(!1),d.isDirty=!0,b&&d.chart.redraw()},setData:function(a,c){var f=this,g=f.data,h=f.initialColor,i=g&&g.length||0;f.xIncrement=null,b(h)&&(H=h);for(a=bt(d(a||[]),function(a){return(new f.pointClass).init(f,a)});i--;)g[i].destroy();f.data=a,f.cleanData(),f.getSegments(),f.isDirty=!0,e(c,!0)&&f.chart.redraw()},remove:function(a){var b=this,c=b.chart;a=e(a,!0),b.isRemoving||(b.isRemoving=!0,by(b,"remove",null,function(){b.destroy(),c.isDirty=!0,a&&c.redraw()})),b.isRemoving=!1},translate:function(){for(var a=this,b=a.chart,c=a.options.stacking,d=a.xAxis.categories,e=a.yAxis,f=e.stacks[a.type],g=a.data,h=g.length;h--;){var i=g[h],j=i.x,k=i.y,l;i.plotX=a.xAxis.translate(j),c&&a.visible&&f[j]&&(l=f[j],j=l.total,l.cum=l=l.cum-k,k=l+k,c=="percent"&&(l=j?l*100/j:0,k=j?k*100/j:0),i.percentage=j?i.y*100/j:0,i.stackTotal=j,i.yBottom=e.translate(l,0,1)),k!==null&&(i.plotY=e.translate(k,0,1)),i.clientX=b.inverted?b.plotHeight-i.plotX:i.plotX,i.category=d&&d[i.x]!==P?d[i.x]:i.x}},setTooltipPoints:function(a){var b=this,c=b.chart,d=c.inverted,e=[],f=(d?c.plotTop:c.plotLeft)+c.plotSizeX,g,h,i=[];a&&(b.tooltipPoints=null),br(b.segments,function(a){e=e.concat(a)}),b.xAxis&&b.xAxis.reversed&&(e=e.reverse()),br(e,function(a,c){b.tooltipPoints||a.setTooltipText(),g=e[c-1]?e[c-1].high+1:0;for(h=a.high=e[c+1]?w((a.plotX+(e[c+1]?e[c+1].plotX:f))/2):f;g<=h;)i[d?f-g++:g++]=a}),b.tooltipPoints=i},onMouseOver:function(){var a=this,b=a.chart,c=b.hoverSeries,d=a.stateMarkerGraphic;b.mouseIsDown||(d&&d.show(),c&&c!=a&&c.onMouseOut(),a.options.events.mouseOver&&by(a,"mouseOver"),a.tracker&&a.tracker.toFront(),a.setState(bb),b.hoverSeries=a)},onMouseOut:function(){var a=this,b=a.options,c=a.chart,d=c.tooltip,e=c.hoverPoint;e&&e.onMouseOut(),a&&b.events.mouseOut&&by(a,"mouseOut"),d&&!b.stickyTracking&&d.hide(),a.setState(),c.hoverSeries=null},animate:function(a){var b=this,c=b.chart,d=b.clipRect;a?d.isAnimating||(d.attr("width",0),d.isAnimating=!0):(d.animate({width:c.plotSizeX},{complete:function(){d.isAnimating=!1},duration:1e3}),this.animate=null)},drawPoints:function(){var a=this,b,c=a.data,d=a.chart,f,g,h,i,j,k;if(a.options.marker.enabled)for(h=c.length;h--;)i=c[h],f=i.plotX,g=i.plotY,k=i.graphic,g!==P&&(b=i.pointAttr[i.selected?bc:ba],j=b.r,k?k.attr({x:f,y:g,r:j}):i.graphic=d.renderer.symbol(e(i.marker&&i.marker.symbol,a.symbol),f,g,j).attr(b).add(a.group))},convertAttribs:function(a,b,c,d){var f=this.pointAttrToOptions,g,h,i={};a=a||{},b=b||{},c=c||{},d=d||{};for(g in f)h=f[g],i[g]=e(a[h],b[g],c[g],d[g]);return i},getAttribs:function(){var a=this,c=a.options.marker||a.options,d=c.states,e=d[bb],f,g={},h=a.color,i=a.data,j=[],k,l=a.pointAttrToOptions;a.options.marker?(g={stroke:h,fill:h},e.radius=e.radius||c.radius+2,e.lineWidth=e.lineWidth||c.lineWidth+1):(g={fill:h},e.color=e.color||bL(e.color||h).brighten(e.brightness).get()),j[ba]=a.convertAttribs(c,g),br([bb,bc],function(b){j[b]=a.convertAttribs(d[b],j[ba])}),a.pointAttr=j;for(g=i.length;g--;){h=i[g],(c=h.options&&h.options.marker||h.options)&&c.enabled===!1&&(c.radius=0),f=!1;if(h.options)for(var m in l)b(c[l[m]])&&(f=!0);f?(k=[],d=c.states||{},f=d[bb]=d[bb]||{},a.options.marker||(f.color=bL(f.color||h.options.color).brighten(f.brightness||e.brightness).get()),k[ba]=a.convertAttribs(c,j[ba]),k[bb]=a.convertAttribs(d[bb],j[bb],k[ba]),k[bc]=a.convertAttribs(d[bc],j[bc],k[ba])):k=j,h.pointAttr=k}},destroy:function(){var a=this,b=a.chart,c=b.series,d=a.clipRect,e;bx(a),a.legendItem&&a.chart.legend.destroyItem(a),br(a.data,function(a){a.destroy()}),br(["area","graph","dataLabelsGroup","group","tracker"],function(b){a[b]&&a[b].destroy()}),d&&d!=a.chart.clipRect&&d.destroy(),b.hoverSeries==a&&(b.hoverSeries=null),br(c,function(b,d){b==a&&c.splice(d,1)});for(e in a)delete a[e]},drawDataLabels:function(){if(this.options.dataLabels.enabled){var a=this,b,c,d=a.data,f=a.options.dataLabels,g,h=a.dataLabelsGroup,i=a.chart,j=i.inverted,k=a.type,l,m;h||(h=a.dataLabelsGroup=i.renderer.g(U+"data-labels").attr({visibility:a.visible?V:T,zIndex:4}).translate(i.plotLeft,i.plotTop).add()),l=f.color,l=="auto"&&(l=null),f.style.color=e(l,a.color),br(d,function(d){var l=e(d.barX,d.plotX),n=d.plotY,o=d.tooltipPos,p=d.dataLabel;p&&(d.dataLabel=p.destroy()),g=f.formatter.call({x:d.x,y:d.y,series:a,point:d,percentage:d.percentage,total:d.total||d.stackTotal}),b=(j?i.plotWidth-n:l)+f.x,c=(j?i.plotHeight-l:n)+f.y,o&&(b=o[0]+f.x,c=o[1]+f.y),m=f.align,k=="column"&&(b+=({center:d.barW/2,right:d.barW})[m]||0),g&&(d.dataLabel=i.renderer.text(g,b,c,f.style,f.rotation,m).attr({zIndex:1,visibility:d.visible===!1?T:"inherit"}).add(h)),a.drawConnector&&a.drawConnector(d)})}},drawGraph:function(){var a=this,b=a.options,c=a.chart,d=a.graph,f=[],g=a.area,h=a.group,i=b.lineColor||a.color,j=b.lineWidth,k,l=c.renderer,m=a.yAxis.getThreshold(b.threshold||0),n=/^area/.test(a.type),o=[],p=[];br(a.segments,function(c){if(c.length>1){k=[],br(c,function(a,d){d<2&&k.push([Y,Z][d]),d&&b.step&&(d=c[d-1],k.push(a.plotX,d.plotY)),k.push(a.plotX,a.plotY)}),f=f.concat(k);if(n){var d=[],e,g=k.length;for(e=0;e<g;e++)d.push(k[e]);if(b.stacking&&a.type!="areaspline")for(e=c.length-1;e>=0;e--)d.push(c[e].plotX,c[e].yBottom);else d.push(c[c.length-1].plotX,m,c[0].plotX,m,"z");p=p.concat(d)}}else o.push(c[0])}),a.graphPath=f,a.singlePoints=o,n&&(c=e(b.fillColor,bL(a.color).setOpacity(b.fillOpacity||.75).get()),g?g.attr({d:p}):a.area=a.chart.renderer.path(p).attr({fill:c}).add(a.group)),d?d.attr({d:f}):j&&(a.graph=l.path(f).attr({stroke:i,"stroke-width":j+W}).add(h).shadow(b.shadow))},render:function(){var a=this,b=a.chart,c,d=a.options.animation&&a.animate;c=b.renderer,a.clipRect||(a.clipRect=!b.hasRendered&&b.clipRect?b.clipRect:c.clipRect(0,0,b.plotSizeX,b.plotSizeY),b.clipRect||(b.clipRect=a.clipRect)),a.group||(c=a.group=c.g("series"),b.inverted&&c.attr({width:b.plotWidth,height:b.plotHeight}).invert(),c.clip(a.clipRect).attr({visibility:a.visible?V:T,zIndex:3}).translate(b.plotLeft,b.plotTop).add()),a.drawDataLabels(),d&&a.animate(!0),a.getAttribs(),a.drawGraph&&a.drawGraph(),a.drawPoints(),a.options.enableMouseTracking!==!1&&a.drawTracker(),d&&a.animate(),a.isDirty=!1},redraw:function(){var a=this;a.translate(),a.setTooltipPoints(!0),a.render()},setState:function(a){var b=this,c=b.options,d=b.graph,e=c.states,f=b.stateMarkerGraphic;c=c.lineWidth,a=a||ba;if(b.state!=a){b.state=a;if(!e[a]||e[a].enabled!==!1)a?c=e[a].lineWidth||c:f&&f.hide(),d&&d.animate({"stroke-width":c},a?0:500)}},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f=c.group,g=c.tracker,h=c.dataLabelsGroup,i,j=c.data,k=d.options.chart.ignoreHiddenSeries;i=c.visible,i=(c.visible=a=a===P?!i:a)?"show":"hide",a&&(c.isDirty=k),f&&f[i]();if(g)g[i]();else for(f=j.length;f--;)g=j[f],g.tracker&&g.tracker[i]();h&&h[i](),e&&d.legend.colorizeItem(c,a),k&&c.options.stacking&&br(d.series,function(a){a.options.stacking&&a.visible&&(a.isDirty=!0)}),b!==!1&&d.redraw(),by(c,i)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){var b=this;b.selected=a=a===P?!b.selected:a,b.checkbox&&(b.checkbox.checked=a),by(b,a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=a.graphPath,d=a.chart,e=d.options.tooltip.snap,f=a.tracker,g=b.cursor;g=g&&{cursor:g};var h=a.singlePoints,i,j;for(j=0;j<h.length;j++)i=h[j],c.push(Y,i.plotX-3,i.plotY,Z,i.plotX+3,i.plotY);f?f.attr({d:c}):a.tracker=d.renderer.path(c).attr({isTracker:!0,stroke:_,fill:X,"stroke-width":b.lineWidth+2*e,"stroke-linecap":"round",visibility:a.visible?V:T,zIndex:1}).on("mouseover",function(){d.hoverSeries!=a&&a.onMouseOver()}).on("mouseout",function(){b.stickyTracking||a.onMouseOut()}).css(g).add(d.trackerGroup)}},D=m(bR),bB.line=D,D=m(bR,{type:"area"}),bB.area=D,r.prototype={get:function(a){a||(a=50);var b=this.n;b=(this.xdata[b-1]-this.xdata[0])/(a-1);var c=[],d=[];c[0]=this.xdata[0],d[0]=this.ydata[0];for(var e=[{plotX:c[0],plotY:d[0]}],f=1;f<a;f++)c[f]=c[0]+f*b,d[f]=this.interpolate(c[f]),e[f]={plotX:c[f],plotY:d[f]};return e},interpolate:function(a){for(var b=this.n-1,c=0;b-c>1;){var d=(b+c)/2;this.xdata[w(d)]>a?b=d:c=d}b=w(b),c=w(c),d=this.xdata[b]-this.xdata[c];var e=(this.xdata[b]-a)/d;a=(a-this.xdata[c])/d;return e*this.ydata[c]+a*this.ydata[b]+((e*e*e-e)*this.y2[c]+(a*a*a-a)*this.y2[b])*d*d/6}},D=m(bR,{type:"spline",drawGraph:function(){var a=this,b=a.segments;a.splinedata=a.getSplineData(),a.segments=a.splinedata,bR.prototype.drawGraph.apply(a,arguments),a.segments=b},getSplineData:function(){var a=this,b=a.chart,c=[],d=b.plotSizeX,e;br(a.segments,function(b){a.xAxis.reversed&&(b=b.reverse());var f=[],g,h;br(b,function(a,c){g=b[c+2]||b[c+1]||a,h=b[c-2]||b[c-1]||a,g.plotX>=0&&h.plotX<=d&&f.push(a)}),f.length>1&&(e=v(y(d,f[f.length-1].clientX-f[0].clientX)/3)),c.push(b.length>1?e?(new r(f)).get(e):[]:b)});return c}}),bB.spline=D,D=m(D,{type:"areaspline"}),bB.areaspline=D;var bS=m(bR,{type:"column",pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){bR.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&br(b.series,function(b){b.type==a.type&&(b.isDirty=!0)})},translate:function(){var c=this,d=c.chart,f=0,g=c.xAxis.reversed,h=c.xAxis.categories,i;bR.prototype.translate.apply(c),br(d.series,function(a){a.type==c.type&&(a.options.stacking?(b(i)||(i=f++),a.columnIndex=i):a.columnIndex=f++)});var j=c.options,k=c.data,l=c.closestPoints;d=A(k[1]?k[l].plotX-k[l-1].plotX:d.plotSizeX/(h?h.length:1)),h=d*j.groupPadding,l=d-2*h,l=l/f;var m=j.pointWidth,n=b(m)?(l-m)/2:l*j.pointPadding,o=e(m,l-2*n);m=(g?f-c.columnIndex:c.columnIndex)||0;var p=n+(h+m*l-d/2)*(g?-1:1),q=c.yAxis.getThreshold(j.threshold||0),r=j.minPointLength;br(k,function(c){var d=c.plotY,e=c.plotX+p,f=x(z(d,q)),g=o,h=x(A((c.yBottom||q)-d)),i;A(h)<(r||5)&&(r&&(h=r,f=q-(d<=q?r:0)),i=f-3),a(c,{barX:e,barY:f,barW:g,barH:h}),c.shapeType="rect",c.shapeArgs={x:e,y:f,width:g,height:h,r:j.borderRadius},c.trackerArgs=b(i)&&bu(c.shapeArgs,{height:6,y:i})})},getSymbol:function(){},drawGraph:function(){},drawPoints:function(){var a=this,c=a.options,d=a.chart.renderer,e,f;br(a.data,function(g){b(g.plotY)&&(e=g.graphic,f=g.shapeArgs,e?e.attr(f):g.graphic=d[g.shapeType](f).attr(g.pointAttr[g.selected?bc:ba]).add(a.group).shadow(c.shadow))})},drawTracker:function(){var a=this,b=a.chart,d=b.renderer,e,f,g=+(new Date),h=a.options.cursor,i=h&&{cursor:h},j;br(a.data,function(h){f=h.tracker,e=h.trackerArgs||h.shapeArgs,f?f.attr(e):h.tracker=d[h.shapeType](e).attr({isTracker:g,fill:_,visibility:a.visible?V:T,zIndex:1}).on("mouseover",function(d){j=d.relatedTarget||d.fromElement,b.hoverSeries!=a&&c(j,"isTracker")!=g&&a.onMouseOver(),h.onMouseOver()}).on("mouseout",function(b){a.options.stickyTracking||(j=b.relatedTarget||b.toElement,c(j,"isTracker")!=g&&a.onMouseOut())}).css(i).add(b.trackerGroup)})},cleanData:function(){var a=this,b=a.data,c,d,e,f;bR.prototype.cleanData.apply(a);for(f=b.length-1;f>=0;f--)if(b[f-1]){c=b[f].x-b[f-1].x;if(d===P||c<d)d=c,e=f}a.closestPoints=e},animate:function(a){var b=this,c=b.data;a||(br(c,function(a){var c=a.graphic;c&&(c.attr({height:0,y:b.yAxis.translate(0,0,1)}),c.animate({height:a.barH,y:a.barY},{duration:1e3}))}),b.animate=null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&br(b.series,function(b){b.type==a.type&&(b.isDirty=!0)}),bR.prototype.remove.apply(a,arguments)}});bB.column=bS,D=m(bS,{type:"bar",init:function(a){a.inverted=this.inverted=!0,bS.prototype.init.apply(this,arguments)}}),bB.bar=D,D=m(bR,{type:"scatter",translate:function(){var a=this;bR.prototype.translate.apply(a),br(a.data,function(b){b.shapeType="circle",b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},drawTracker:function(){var a=this,b=a.options.cursor,c=b&&{cursor:b},d;br(a.data,function(b){(d=b.graphic)&&d.attr({isTracker:!0}).on("mouseover",function(){a.onMouseOver(),b.onMouseOver()}).on("mouseout",function(){a.options.stickyTracking||a.onMouseOut()}).css(c)})},cleanData:function(){}}),bB.scatter=D,D=m(bQ,{init:function(){bQ.prototype.init.apply(this,arguments);var b=this,c;a(b,{visible:b.visible!==!1,name:e(b.name,"Slice")}),c=function(){b.slice()},bw(b,"select",c),bw(b,"unselect",c);return b},setVisible:function(a){var b=this,c=b.series.chart,d;d=(b.visible=a=a===P?!b.visible:a)?"show":"hide",b.group[d](),b.tracker&&b.tracker[d](),b.dataLabel&&b.dataLabel[d](),b.legendItem&&c.legend.colorizeItem(b,a)},slice:function(a,c){var d=this,f=d.series;f=f.chart;var g=d.slicedTranslation;e(c,!0),a=d.sliced=b(a)?a:!d.sliced,d.group.animate({translateX:a?g[0]:f.plotLeft,translateY:a?g[1]:f.plotTop},100)}}),D=m(bR,{type:"pie",isCartesian:!1,pointClass:D,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=H},translate:function(){var a=0,b=this,c=-.25,d=b.options,e=d.slicedOffset,f=d.center,g=b.chart,h=g.plotWidth,i=g.plotHeight,j,k,l;b=b.data;var m=2*u.PI,n,o=z(h,i),p;f.push(d.size,d.innerSize||0),f=bt(f,function(a,b){return(p=/%$/.test(a))?[h,i,o,o][b]*parseInt(a,10)/100:a}),br(b,function(b){a+=b.y}),br(b,function(b){n=a?b.y/a:0,j=c*m,c+=n,k=c*m,b.shapeType="arc",b.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:j,end:k},l=(k+j)/2,b.slicedTranslation=bt([B(l)*e+g.plotLeft,C(l)*e+g.plotTop],v),b.tooltipPos=[f[0]+B(l)*f[2]*.35,f[1]+C(l)*f[2]*.35],b.percentage=n*100,b.total=a}),this.setTooltipPoints()},render:function(){var a=this;a.getAttribs(),this.drawPoints(),a.options.enableMouseTracking!==!1&&a.drawTracker(),this.drawDataLabels(),a.isDirty=!1},drawPoints:function(){var a=this,b=a.chart,c=b.renderer,d,e,f;br(a.data,function(a){e=a.graphic,f=a.shapeArgs,a.group||(d=a.sliced?a.slicedTranslation:[b.plotLeft,b.plotTop],a.group=c.g("point").attr({zIndex:3}).add().translate(d[0],d[1])),e?e.attr(f):a.graphic=c.arc(f).attr(a.pointAttr[ba]).add(a.group),a.visible===!1&&a.setVisible(!1)})},drawTracker:bS.prototype.drawTracker,getSymbol:function(){}}),bB.pie=D,t.Highcharts={Chart:q,dateFormat:O,getOptions:k,numberFormat:n,Point:bQ,Renderer:bP,seriesTypes:bB,setOptions:j,Series:bR,addEvent:bw,createElement:h,discardElement:l,css:g,each:br,extend:a,map:bt,merge:bu,pick:e,extendClass:m}})()define("lib/highcharts", function(){});
define('define/chart',['define/form', 'define/viewelement', 'lib/highcharts'], function(Form, ViewElement) {
    // Base Class for all charts
    var Chart = ViewElement.extend({
        constructor: function(viewset, concept_pk){
            this.options = {
                 chart: {
                     marginBottom:50,
                     renderTo : null,
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
            };
            this.base(viewset, concept_pk);
        },
        gainedFocus: function(){
            this.chart.xAxis[0].isDirty = true;
            this.chart.yAxis[0].isDirty = true;
            this.chart.isDirty = true;
            this.chart.series[0].isDirty = true;
            this.updateChart();
        },
        updateChart : function(){}
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
            var map = this.map = Chart.map_data_to_display(viewset.data.choices);
            var unmap = this.unmap = Chart.map_display_to_data(viewset.data.choices);
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
            // Here we map all the choices to their string equivalents
            //TODO don't do this, shouldn't change it 
            $.each(viewset.data.coords, function(index,element){
                 viewset.data.coords[index][0] = map[viewset.data.coords[index][0]];
            });
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
        updateChart: function(){
                var objRef = this;
                $.map(this.chart.series[0].data, function(element,index){
                    var category = element.name || element.category;
                    if ($.inArray(objRef.unmap[category], objRef.selected) !==-1){
                        if (objRef.negated){
                            element.update({color:Chart.EXCLUDE_COLOR}, false);
                        }else{
                            element.update({color:Chart.SELECTED_COLOR}, false);    
                        }
                    }else{
                        element.update({color:Chart.UNSELECTED_COLOR}, false);
                    }
                    
                 });
                 // We've potentially changed the color of columns, so redraw
                 this.chart.redraw();
                 
                 // This is a hack to fix a bug in ie7 where bars that
                 // have been moused over, vanish if the view is taken off
                 // screen and then put back.
                 $.map(this.chart.series[0].data, function(element,index){
                      $(element.tracker.element).mouseover();
                      $(element.tracker.element).mouseout();
                 });
        },  
        seriesClick: function(event) {
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
             this.updateChart();
             // This is a bug fix for HighCharts. Author has been informed of bug.
             // Without it you cannot click on a bar that you just
             // clicked on without moving off and then back on
             this.chart.hoverPoint = event.point;
             this.chart.hoverSeries = event.point.series;
             
        }
    });
    
    var PieChart = ChoiceChart.extend({
        constructor: function(viewset, concept_pk){
           // We only use pie charts for series with <= 3 choices.
           // Verify that no one piece is less than MINIMUM_SLICE of
           // the whole thing 
           
           // TODO this should be replaced with lines and labels in the more recent version of highcharts
           var coords = viewset.data.coords;
           var data_store = this.data_store = {};
           $.each(coords, function(index,element){
               data_store[element[0]] = element[1];
           });
           
           var sum = 0;
           $.each(coords, function(index, element){
              sum = sum + element[1];
           });
           
           var min_slice_width = sum * Chart.MINIMUM_SLICE;
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
            var objRef = this;
            this.options.tooltip.formatter = function(){
                // We use unmap here because name refers potentially cleaned string, ("No", instead of false, etc)
                return "" + objRef.data_store[objRef.unmap[this.point.name]];
            };
            this.options.chart.defaultSeriesType = 'pie';
            this.options.series[0].name = this.viewset.data.title;
            this.options.series[0].data = this.viewset.data.coords;
            this.options.title.text = this.viewset.data.title;
            this.options.plotOptions.series.events.click = $.proxy(this.seriesClick, this);
            this.chart = new Highcharts.Chart(this.options);
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
             this.options.chart.events.redraw = $.proxy(this.redraw, this);
             this.options.chart.events.load = $.proxy(this.load, this);
             this.options.plotOptions.series.events.click = $.proxy(this.seriesClick,this);
             this.options.title.text = this.viewset.data.title;
             this.options.series[0].name = this.viewset.data.title;
             this.options.series[0].data = $.map(this.viewset.data.coords, function(element, index){
                    return element[1]; 
             });
             this.options.tooltip = {
                    formatter:function(){
                        return this.point.category + ", " + this.y;
                    }
             };
             this.options.xAxis = {
                categories: $.map(this.viewset.data.coords, function(element, index){
                   return element[0]; 
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
         redraw: function(event){
               for (var index = 0; index < this.chart.series[0].data.length; index++){
                    var col = this.chart.series[0].data[index];
                    $(col.dataLabel.element).unbind(); // Prevent any double binding
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
                                  objRef.selected.push(objRef.unmap[c.category]);
                              }else{
                                  objRef.selected.splice(index,1);
                              }
                              objRef.notify();
                              objRef.updateChart();
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
             var range_form = this.range_form = new Form({fields:[viewset.data]}, concept_pk).dom;
             this.base(viewset, concept_pk);
             var extremes = this.extremes = this.chart.xAxis[0].getExtremes();
             // By default select the middle 1/3 of the chart
             var xrange = extremes.max - extremes.min;
             var third = (1/3) * xrange;
             // Set the initial middle selected range in the form and in the graph.
             // TODO Set these using events so as not to need to know internals.
             $("input[name*=input0]", range_form).val((extremes.min+third).toFixed(1));
             $("input[name*=input1]", range_form).val((extremes.min+2*third).toFixed(1));
             
             // Listen for changes in the form and make the chart reflect
             // We are doing this here to prevent tons of unnecessary calls to manual_field_handler
             this.range_form.bind("ElementChangedEvent", $.proxy(this.manual_field_handler, this));
             this.manual_field_handler(null);
         },
         render: function(){
             this.range_form.find("input").css("margin","10px");
             var dom = this.dom = $('<div class="chart"></div>');

             this.options.chart.renderTo = dom.get(0);
             this.options.chart.defaultSeriesType = 'line';
             this.options.chart.zoomType = 'x';
             this.options.title.text = this.viewset.data.title;
             // User selects range in chart
             this.options.chart.events.selection = $.proxy(this.chartSelection, this);
             // User selects single spot in chart;
             this.options.chart.events.click = $.proxy(this.chartClick, this);
             // User clicks on a point on the line
             this.options.plotOptions.series.point.events.click = $.proxy(this.pointClick, this);

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
             // TODO this gets called too many times, look into fixing.
             // TODO try to shorten this up
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

             switch(this.range_form.find("select[name*=operator]").val()) {
                 case "range": 
                     color = Chart.INCLUDE_COLOR;
                 case "-range":
                     color =  color || Chart.EXCLUDE_COLOR; // did we drop through from range?
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
                     color = Chart.INCLUDE_COLOR;
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
                              color: Chart.EXCLUDE_COLOR,
                              width: 3
                         });
                         this.chart.xAxis[0].addPlotBand({
                              from: this.extremes.min,
                              to: min,
                              color:color
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "gt":
                     color = Chart.INCLUDE_COLOR;
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
                                     color: Chart.EXCLUDE_COLOR,
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
                     color = Chart.INCLUDE_COLOR;
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
                     color = Chart.INCLUDE_COLOR;
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
                     color = Chart.INCLUDE_COLOR;
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
                                     color: Chart.INCLUDE_COLOR,
                                     width: 3
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "-exact":
                     color = Chart.INCLUDE_COLOR;
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
                                     color: Chart.EXCLUDE_COLOR,
                                     width: 3
                         });
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     break;
                 case "isnull":
                     color = Chart.EXCLUDE_COLOR;
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
                                from: this.extremes.min,
                                to: this.extremes.max,
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
                         this.dom.append(this.range_form);
                     }
                     this.dom.trigger("ShowDependentsEvent");
                     this.chart.xAxis[0].removePlotBand();
                     break;
             }
         },
         updateDSEvent : function(evt, ds){
             // pass the datasource to the embedded form
             this.range_form.triggerHandler(evt,[ds]);
         },
         elementChanged:function(){
             
         },
         updateElement:  function(evt, element) {
             // Use triggerHandler here because otherwise it will bubble back up
             // the surround container (this object) and start an endless loop.
             this.range_form.triggerHandler(evt,[element]);
             //this.manual_field_handler(null);
         },
         registerElements :  function(evt) {
             // We only need to change the operator because it will in turn change its dependent
             // inputs
             $('select', this.range_form).change();
         },
         gainedFocus: function(evt){
             this.base();
             this.range_form.triggerHandler(evt);
         },
         chartSelection: function(event){
             var chart = event.target;
             var color = this.range_form.find("select[name*=operator]").val() === "-range" ? LineChart.EXCLUDE_COLOR : LineChart.INCLUDE_COLOR;

             var min = event.xAxis[0].min;
             var max = event.xAxis[0].max;

             min = min < this.extremes.min ? this.extremes.min : min;
             max = max > this.extremes.max ? this.extremes.max : max;
             min = parseFloat(min).toFixed(1);// TODO how are we going to handle this if they are fractions
             max = parseFloat(max).toFixed(1);// TODO properly calculate extremes 

             // Set the new values in the form and notify Avocado
             $("input[name*=input0]", this.range_form).val(min).change();
             $("input[name*=input1]", this.range_form).val(max).change();
             // We are hijacking the zoom effect here
             // TODO we should be able to do away with this by using the new draw API
             event.preventDefault(); 
         },
         chartClick: function(event){
             var chart = event.target;
             if (this.chart.options.chart.zoomType){ 
                 // If select is on we don't care about click
                 return; 
             }

             var min = event.xAxis[0].value;

             min = min < this.extremes.min ? this.extremes.min : min;
             min = parseFloat(min).toFixed(1);// TODO how are we going to handle this if they are fractions

             // Set the new values in the form and notify Avocado
             $("input[name*=input0]", this.range_form).val(min).change();
         },
         pointClick: function(event){
               if (this.chart.options.chart.zoomType){ // If select is on we don't care about click
                   return; 
               }
               var min = event.target.x;

               min = min < this.extremes.min ? this.extremes.min : min;
                
               // TODO how are we going to handle this if they are fractions
               min = parseFloat(min).toFixed(1);

               // Set the new values in the form and notify Avocado
               $("input[name*=input0]", this.range_form).val(min).change();
         }
     });

     return {
         BarChart: BarChart,
         LineChart: LineChart,
         PieChart: PieChart
     };
});
define('utils/frontdesk',['require','exports','module'],function(){function a(a){function l(){var a=0;for(var c in f)f[c]==="in"&&a++;return a+b}function k(a,b,c){var d=g[a];typeof b==="function"?b.apply(b,c):(typeof b==="string"||b instanceof String)&&d[b].apply(d,c)}function j(a){if(a&&typeof a==="object"&&typeof a.length==="number"&&!a.propertyIsEnumerable("length"))return!0;return!1}var b=0,c=[],d=[],e={},f={},g={},h=null,i=j(a);this.onEmpty=function(a){c.push(a)},this.onFull=function(a){d.push(a)},this.checkIn=function(c,h){var j,k=!1;if(c!==undefined){if(f[c]!=="in"){e[c]=[],f[c]="in",h!==undefined&&(g[c]=h),k=!0;if(i)for(j in a)if(f[j]!=="in"){k=!1;break}}}else b++;(l()===a||k)&&$.each(d,function(a,b){b()});return h},this.checkOut=function(a,d){if(l()!==0){if(a===undefined)b--;else if(f[a]==="in"){f[a]="out",d!==undefined&&(g[a]=d);for(var h=0,i=e[a].length;h<i;h++)k(a,e[a][h][0],e[a][h][1])}l()===0&&$.each(c,function(a,b){b()})}},this.leaveMessage=function(a,b){var c=Array.prototype.slice.call(arguments,2);f[a]==="in"?e[a].push([b,c]):k(a,b,c)}}return a})define('define/view',['define/chart','define/form','utils/frontdesk', 'lib/base'], function(Chart, Form, FrontDesk){
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
                $(this).bind("UpdateQueryButtonClicked GainedFocusEvent LostFocusEvent UpdateQueryButtonClicked " +      
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
                this.view.trigger("ConstructQueryEvent");
                evt.stopPropagation();
            },
            notifyChildren: function(evt,arg){
              var fd = this.fd;
              $.each(this.viewset.elements, function(index){
                    fd.leaveMessage(index, "triggerHandler", evt, arg);
              });
              evt.stopPropagation();
            },
            eventPassThru: function(evt, arg){
                this.view.triggerHandler(evt, arg);
                evt.stopPropagation();
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
});define('define/conceptmanager',['define/view'],
    function(View) { 
        /**
          Sets up and manages the view sets for each criterion option.

          On each request for a criterion option, the response returns an array
          of hashes that contain the information necessary to construct the
          content of the view. HTML forms and Charts (provided by the HighCharts
          library are considered built-in views. Custom views (for example if one
          wanted to some sort of tree-view to be selected from)
          must be handled using view-specific JS or the view-set JS.

          @class
          @author <a href="mailto:millerjm1@email.chop.edu">Jeff Miller</a>
          @param {jQuery} $container Represents the containing element which
          encapulates all loaded views
          @param {jQuery} $titleBar Represents the title bar to which the title of
          the Criterion can be set
          @param {jQuery} $tabsBar Represents the element that contains the tabs
          associated with all currently loaded views
          @param {jQuery} $contentBox Represents the content area within the
          container that the active view is displayed
          @param {jQuery} $staticBox Represents the content area within the container
          that is common to all views (displays errors and the query button)
        */

        var Manager;

        $(function() {
            var $container = $('#plugin-panel'),
                $titleBar = $('#plugin-title'),
                $tabsBar = $('#plugin-tabs'),
                $contentBox = $('#plugin-dynamic-content'),
                $staticBox = $('#plugin-static-content');

            Manager = (function() {

                /**
                  A hash with respect to criterion IDs of the objects fetched from
                  the server to build the views.

                  @private
                  @type object
                */
                var cache = {};
                
                /**
                  The standard template for the tab DOM elements

                  @private
                  @type string
                */
                var tab_tmpl = '<a class="tab" href="#"><%= this.tabname %></a> ';

                /**
                  The standard template for the "Add To Query Button"

                  @private
                  @type string
                */
                var add_query_tmpl = [
                    '<div class="message success">Condition has been added.</div>',
                    '<button id="add_to_query"></button>'
                ].join('');

                /**
                  Holds the currently viewable/active concept/criterionconcept    

                  @private
                  @type int
                */
                var activeConcept = null;

                /**
                  Holds the currently viewable view of the currently active 
                  concept/criterionconcept

                  @private
                  @type object
                */
                var activeView = null;
                
                /**
                  Holds a reference to the addQueryButton for the activeConcept.
                
                 @private
                 @type jquery object
                */
                var $addQueryButton = null;
                
                /**
                  List of concepts currently in the users active query
                  
                  @private
                  @type array
                */
                var concepts_in_query = [];
                
                // RegExes used by buildQuery
                var binaryFieldRe = /^(\d+)_(\d+(?:OR\d+)*)_input([01])$/;
                var fieldRe = /^(\d*)_(\d+(?:OR\d+)*)$/;
                var opRe = /^(\d*)_(\d+(?:OR\d+)*)_operator$/;
                var pkChoiceRe = /^\d+(?:OR\d+)+$/;
                var negateRe = /-/;
                
                
                // Map used to convert array operators for the null boolean type;
                var nb_plural_to_singular_map = {"in":"exact", "-in":"-exact", "exact":"exact","-exact":"-exact"};
                var nb_singular_to_plural_map = {"exact":"in", "-exact":"-in"};
                
                var s_to_primative_map = {"true":true, "false":false, "null":null};
                
                 /**
                   Event listener for concepts added to the users query
                   
                   @private
                */
                function conceptAddedHandler(evt) {
                    
                    if ($.inArray(evt.concept_id, concepts_in_query) < 0 ) {
                        concepts_in_query.push(parseInt(evt.concept_id));
                    
                        if (activeConcept === parseInt(evt.concept_id)) {
                            $addQueryButton.html('<span class="icon refresh"/> <span>Update Condition</span>');
                            $(".success", $staticBox).show();
                        }
                    }
                    
                    evt.stopPropagation();
                }
                
                /**
                   Event listener for concepts removed from the users query
                   
                   @private
                */
                function conceptDeletedHandler(evt){
                    var index = $.inArray(parseInt(evt.concept_id), concepts_in_query);

                    if (index >= 0 ){
                        concepts_in_query.splice(index,1);
                        if (activeConcept === parseInt(evt.concept_id)){
                            $addQueryButton.html('<span class="icon plus"/> <span>Add Condition</span>');
                              $(".success", $staticBox).hide();
                        }
                    }

                    evt.stopPropagation();
                }

                /**
                  This is a utility function that looks on the current view to find the
                  datatype of a given field primary k. In the future it might use the server, 
                  or search all cached concepts, but for now it only uses the activeView because
                  it is only called from buildQuery, where the activeView is all that matters.
                  
                  @private
                */
                function getDataType(field_pk) {

                    var elements = activeView.elements;
                    var datatype = null;
                    
                    $.each(elements, function(index,element) {
       
                       if (element.type === "custom") {
                            return element.datatype;
                       }
                       
                       if (element.data){
                           if (element.data.pk == field_pk){
                               datatype = element.data.datatype;
                               return false;
                           }
                           // Maybe we weren't given a pk for this one
                           if (element.data.pkchoices && 
                              $.inArray(field_pk,$.map(element.data.pkchoices, function(item, index){return item[0];}))>=0){
                              datatype = element.data.datatype;
                              return false;
                           }
                       } else {
                           $.each(element.fields, function(index, field){
                               if (field.pk == field_pk){
                                   datatype = field.datatype;
                                   return false;
                               }
                               if (field.pkchoices && 
                                    $.inArray(field_pk,$.map(field.pkchoices, function(item, index){return item[0];}))>=0){
                                    datatype = field.datatype;
                                    return false;
                               }
                           });
                           if (datatype !== null){
                               return false;
                           }
                       }
                    });
                    return datatype;
                }

                /**
                  This function is a utility function, currently called by the AddQueryButtonHandler,
                  for concepts made of built-in views, the function will be responsible
                  for analyzing the current concept's datasource and creating the 
                  datastructure representing the proper query for the server to 
                  perform.
                  
                  @private
                */
                function buildQuery(ds) {
                    var fields={};
                    // We need to analyze the current concept and the datasource and construct
                    // the proper datastructure to represent this query on the server
                    // Find all the different fields and their values in this concept
                    for (var item in ds){
                        if (!ds.hasOwnProperty(item)) continue;
                        var m = fieldRe.exec(item); // Either a choice, assertion, or boolean
                        if (m){
                            if (fields.hasOwnProperty(m[2])){
                                $.extend(fields[m[2]], {val0:ds[item], val1:undefined, op:undefined});
                            }else{
                                fields[m[2]] = {val0:ds[item], val1:undefined, op:undefined};
                            }
                            continue;
                        }
                        m = binaryFieldRe.exec(item); // decimal oor date
                        if (m) {
                            if (fields.hasOwnProperty(m[2])) {
                                fields[m[2]]['val'+m[3]] = Number(ds[item]) || ds[item];
                            }else{
                                fields[m[2]] = {val0:undefined, val1:undefined, op:undefined};
                                fields[m[2]]['val'+m[3]] = Number(ds[item]) || ds[item];
                            }
                            continue;
                        }
                        m = pkChoiceRe.exec(item); // field representing the field this concept needs to query against
                        if (m) {
                            if (fields.hasOwnProperty(m[0])){
                                fields[m[0]]['pk'] = ds[item];
                            }else{
                                fields[m[0]] = {val0:undefined, val1:undefined, op:undefined, pk:ds[item]};
                            }
                        }
                    }
                    for (item in ds){
                         if (!ds.hasOwnProperty(item)) continue;
                         m = opRe.exec(item);
                         
                         // For optional fields, we may have an operator, 
                         // but the value may not exist, so don't use it,
                         // however if the operator contains null (null, -null)
                         // the operator does take anything, so thats all wee need
                         if ((m) && (fields[m[2]] || ds[item].match(/null/))) {
                             if (!fields.hasOwnProperty(m[2])){
                                 fields[m[2]] = {val0:undefined, val1:undefined, op:undefined};
                             }
                             fields[m[2]]['op'] = ds[item];
                         }
                    }
                   
                    // We now have the ds sorted into a sensible datastructure
                    // based on the fields in the concept. Construct the server
                    // required datastructure
                    var nodes = [];
                    for (var field_id in fields) {
                        var field = fields[field_id];

                        // if field_id represents a pkChoiceRe, it means it holds the PK value for this field
                        var variable_pk = false;
                        var pkChoices = null;
                        if (pkChoiceRe.exec(field_id)) {
                            pkChoices = field_id.split('OR');
                            field_id = field.pk;
                            variable_pk = true;
                        }
                        
                        field_id = Number(field_id);
                        if (field.val0===undefined && field.val1===undefined && field.op!==undefined){  // either "is null" or "is not null"
                             nodes.push({
                                             'operator' : field.op,
                                             'id' : field_id,
                                             'concept_id': activeConcept,
                                             'value' : true,
                                             'datatype':getDataType(field_id)
                                        });
                        }
                        else if (field.val0!==undefined && field.val1!==undefined && field.op!==undefined) { // Decimal Binary Op
                            nodes.push({
                                            'operator' : field.op,
                                            'id' : field_id,
                                            'value' : [field.val0,field.val1],
                                            'concept_id': activeConcept,
                                            'datatype': getDataType(field_id)
                                        });
                        } else if (field.val0!==undefined && field.op!==undefined && !(field.val0 instanceof Array)){ // Decimal or boolean or free text
                            nodes.push({                                                      // probably not boolean though because
                                            'operator' : field.op,                            // a specific operator has been 
                                            'id' : field_id,                                  // specified
                                            'value' : field.val0,
                                            'concept_id': activeConcept,
                                            'datatype': getDataType(field_id)
                                        });
                        } else if (field.val0!==undefined && field.val0 instanceof Array){ // String choice, boolean (usually charted), or nullboolean, or was string-list, which is an array
                            // if field.op is null, assume the query was the default, which is "in"
                            // this one is a bit special, there is no avoiding that in this situation
                            // we could be dealing with a string "choice" option, or a nullboolean
                            // nullbooleans need to have an OR'd query specifically construct for them
                            // because they cannot use the IN operator.
                            field.op = field.op !== undefined ? field.op : "in";
                            var datatype = getDataType(field_id);
                            switch (datatype) {
                                case "boolean"     :
                                case "nullboolean" : var bool_list = [];
                                                     var op = nb_plural_to_singular_map[field.op];
                                                     $.each(field.val0, function(index,item){
                                                            bool_list.push( {
                                                                 'operator':op,
                                                                 'id' : field_id,
                                                                 // In case a plugin gave us strings for null, true or false, fix it
                                                                 'value' : s_to_primative_map[item] !== undefined? s_to_primative_map[item]:item,
                                                                 'concept_id': activeConcept,
                                                                 'datatype':datatype
                                                            });
                                                     });
                                                     if (bool_list.length > 1){
                                                     nodes.push({
                                                         'type': negateRe.test(field.op) ? "and" : "or",
                                                         'children' : bool_list,
                                                         'concept_id': activeConcept
                                                     });
                                                    }else{
                                                        nodes.push(bool_list[0]);
                                                    }
                                                    break;
                                         default  :  nodes.push({
                                                            'operator' : field.op,
                                                            'id' : field_id,
                                                            'value' : field.val0,
                                                            'concept_id': activeConcept
                                                     });
                                                     break;
                            }
                        } else if (field.val0 !== undefined && !(field.val0 instanceof Array) &&
                                  field.val1 === undefined){ // boolean when operator not specified
                             nodes.push({
                                                'operator' : "exact",
                                                'id' : field_id,
                                                'value' : field.val0,
                                                'concept_id': activeConcept
                                        });
                        } else {
                            // Unable to determine what this field is ?
                            throw "Unable to determine field " + field + " in concept " + activeConcept;
                        }

                        if (variable_pk){  
                            // When we get this back from the server, we will need a way to tell
                            // that the field pk was variable, and how to recreate the datastore
                            // TODO would it be better to make the form responsible for this?
                            nodes[nodes.length-1]['id_choices'] =  pkChoices;
                        }
                    }

                    var server_query;
                    if (nodes.length === 1){
                        server_query = nodes[0];
                    }else{
                        server_query = {
                                             'type':  activeView.join_by || "and", // TODO this should be on the concept
                                             'children': nodes,
                                             'concept_id':activeConcept
                                       };
                    }
                    return server_query;
                }

                 /**
                   This function takes an avocado query datastructure and 
                   returns a datasource object for a concept. This is recursive.
                   
                   @private
                 */ 
                 function createDSFromQuery(parameter, recurse_ds){
                     var ds = recurse_ds || {};
                     var field_prefix;
                     var field_portion;
                     if (!parameter.hasOwnProperty("type")){
                         if (parameter.hasOwnProperty("id_choices")){
                             // I don't like this because it tightly couples the 
                             // implementation of forms and datasources, but its the most
                             // elegant solution I have at the moment
                             field_portion = parameter['id_choices'].join("OR");
                             ds[field_portion] = parameter.id;
                         }else{
                             // If it just does this branch of the if, it would be a lot less
                             // coupled
                             field_portion = parameter.id;
                         }
                         
                         // determine values for this field.
                         // if the operator contains null ("isnull" or "-isnull")
                         // then there is no value. Any value in there would have been
                         // put there explicitly for the server.
                         field_prefix = parameter.concept_id+"_"+field_portion;
                         if (!parameter.operator.match(/null/)) { 
                            if (parameter.datatype  in {number:1, date:1}) {
                                // make this an array either way, even if it was not a binary operator
                                var iterator = parameter.value instanceof Array ? parameter.value : [parameter.value];
                                for (var index=0; index < iterator.length; index++){
                                    ds[field_prefix+"_input"+index] = iterator[index];
                                }
                            } else {
                                if (ds.hasOwnProperty(field_prefix)){
                                   if (ds[field_prefix] instanceof Array) {
                                       ds[field_prefix].push(parameter.value);
                                   }else{
                                       ds[field_prefix] = [ds[field_prefix]];
                                       ds[field_prefix].push(parameter.value);
                                   }
                                //  else if (parameter.datatype && parameter.datatype.indexOf("boolean")>=0){
                                //   ds[field_prefix] = [parameter.value];
                                } else {
                                   // Operators containing null do not actually take a value, and in the scenario where
                                   // a value is there, it was manufactured for the backend, and must be ignored 
                                   ds[field_prefix] = parameter.value;
                                }
                            }
                         }
                         ds[field_prefix+"_"+"operator"] = ds[field_prefix] instanceof Array && parameter.datatype && parameter.datatype.indexOf("boolean")>=0 ? 
                                                           nb_singular_to_plural_map[parameter.operator] : parameter.operator;
                                                           
                         
                     } else {
                        $.each(parameter.children, function(index, child){
                            createDSFromQuery(child, ds);
                        });
                     }
                     return ds;
                 }

                /**
                  The handler for the 'ViewReadyEvent' event
                  
                  This event is fired by a concept plugin when it is ready 
                  to be inserted into the DOM. $concept here should be a 
                  jQuery wrapped set, ready to be placed into the DOM
                  
                  @private
                */
                function viewReadyHandler(evt, view) {
                    activeView.contents = view;
                    // As of right now IE 7 and 8 cannot seem to properly handle
                    // creating VML rotated text in an object that is not in the DOM
                    // In those conditions, the chart plugin inserts the graph into the
                    // DOM and sets display to 0. We detect here if the element we were
                    // passed is in the DOM or not, if not we inject it. The idea is to eventually
                    // when we can do this outside the dom in all browsers, to be able to do 
                    // this in the existing framework
                    var activeViewDom = activeView.contents.dom();
                    $contentBox.append(activeViewDom);
                    activeViewDom.css("display","block");
                    
                    $(".chart", activeView.contents).css("display","block"); // Hack because of IE


                    if (!activeView.loaded){
                        // Give the view its datasource
                        // This will also prevent re-populating datasources when the
                        // user clicks on a criteria in the right panel but the concept 
                        // has been shown before.
                        $(view).trigger("UpdateDSEvent", [cache[activeConcept].ds]);
                        $(view).trigger("RegisterElementsEvent");
                    }
                    
                    $(view).trigger("GainedFocusEvent");

                    activeView.loaded = true;
                 }


                /** 
                  The handler for the 'ShowViewEvent' event
                  
                  This event is fired by the tab bar when a new view
                  is to be displayed. tabIndex correlates to the view in the 
                  activeConcept's views array that needs to be shown.
                  
                  @private
                */
                function showViewHandler(evt, tabIndex) {
                    if (activeView !== null){
                        activeView.contents.dom().css("display","none");
                        $(activeView.contents).trigger("LostFocusEvent");
                        activeView.contents.dom().detach();
                    }

                    activeView = cache[activeConcept].views[tabIndex];

                    if (activeView.loaded) {
                        viewReadyHandler(null, activeView.contents);
                    } else {
                        // We have to look at the type of view here, custom views are responsible
                        // for triggering the viewReadyHandler once their code is executed,
                        // built-in views will need to be taken care of code here
                        var callback = null;
                        activeView.concept_id = activeConcept;
                        $container.trigger('ViewReadyEvent', [new View(activeView, cache[activeConcept].name)]);
                    }
                }    
                /**
                     The handler for the 'ViewErrorEvent' event

                     This event is fired by a concept/concept plugin when
                     an unrecoveralble error has been received. The framework
                     can choose to show the 'Report Error' Panel

                  @private
                */

                function viewErrorHandler(evt, details) {

                }
                
                
                /**
                  The handler for the 'ElementChangedEvent' event
                  
                  This event is used by concepts to notify that the user
                  has changed the value of an input
                  
                  @private
               */  
                
                function elementChangedHandler(evt, element){
                    // Update the concept datastore
                    var ds = cache[activeConcept].ds;
                    var missing_item = false;
                    // Did anything actually change?
                    if (!(element.value instanceof Array) && ds[element.name] === element.value) 
                    {
                        // item is not an array and the values are equal to each other
                        return;
                    }else if (element.value instanceof Array && ds[element.name] instanceof Array){
                        for (var index = 0; index < element.value.length; index++){
                            if ($.inArray(element.value[index],ds[element.name])==-1){
                                // Element in one is not in the other
                                missing_item = true;
                                break;
                            }
                        }
                        if ((missing_item === false)&&(element.value.length == ds[element.name].length)){
                            // All elements in one are in the other, and the lists are same length
                            return;
                        }
                    }
                    
                    // A field is no longer in use, most likely a field was hidden due to 
                    // an operator change
                    if (element.value === undefined){
                        // Clear out this value in the datasource
                        delete cache[activeConcept].ds[element.name];
                    }else{
                        // Update the datasource
                        cache[activeConcept].ds[element.name] = element.value instanceof Array ? element.value.slice(0) : element.value;
                    }
                    // If other views on this concept are already instantiated
                    // notify them of the change
                    $.each(cache[activeConcept].views, function(index,view) {
                        if (activeView !== view && view.contents) {
                            view.contents.trigger("UpdateElementEvent",[element]);
                        }
                    });
                }
                
                /**
                  This function is used by the constructQueryHandler to scan
                  the concept's datasource and verify is not empty and does
                  not contain empty, undefined, or null objects. If using 
                  the built-in query contructor, the datasource must contain
                  only properly named attributes.
                  @private
                */

                function postViewErrorCheck(ds){
                    var empty = false;
                    // Is the datasource an empty object?
                    if ($.isEmptyObject(ds)) {
                        empty = true;
                    }else{
                        // Is the datasource empty except for operators?
                        empty = true;
                        for (var key in ds){
                            if (!ds.hasOwnProperty(key)) continue;
                            // Note, the null operators can stand on their own.
                            if (opRe.test(key)){
                                if(ds[key] && ds[key].indexOf("isnull") >= 0){
                                    empty = false;
                                    break;
                                }
                            } else if (pkChoiceRe.test(key) || fieldRe.test(key) || binaryFieldRe.test(key)){
                                empty = false;
                                break;
                            }
                        }
                    }
                    if (empty) return false;
                    
                    for (var key in ds){
                        if (!ds.hasOwnProperty(key)) continue;
                        
                        if ((ds[key] === undefined) || (ds[key] === "")){
                            return false;
                        }
                        if (($.isArray(ds[key])) && (ds[key].length === 0)){
                            return false;
                        }
                    }
                    return true;
                }

                /**
                  This is the main control function for built-in and custom views
                  that will use the default query constructor. It calls the function 
                  to verify the datasource, then calls the query contructor, and then
                  finally triggers the UpdateQueryEvent up the DOM
                  @private
                */ 
                function constructQueryHandler(event, ds){
                    ds = ds || cache[activeConcept].ds;
                    // Does this datasource contain valid values?
                    if (!postViewErrorCheck(ds)){
                        var evt = $.Event("InvalidInputEvent");
                        evt.ephemeral = true;
                        evt.message = "No value has been specified.";
                        $(event.target).trigger(evt);
                        return false;
                    }
                    var server_query =  buildQuery(ds);
                    
                    $(event.target).trigger("UpdateQueryEvent", [server_query]);
                    return true;
                }

                /**
                  This function is the handler for the "add to query" button.
                  This button appears in the static content area for all concepts,
                  builtin or not. This event passes the event to the current view.
                  Builtin-views will be default listen for this event and call the 
                  ConstructQueryEvent, which will prepare pass it along with an "UpdateQueryEvent"
                  Custom plugins can either use this default behavior (which analyzes the datasource)
                  to constuct the query, or they may listen for the UpdateQueryButton clicked and
                  construct the query themselves and trigger UpdateQueryEvent.
                  @private
                */
                function addQueryButtonHandler(event){
                    $(activeView.contents).triggerHandler("UpdateQueryButtonClicked"); // This would be better if every view didn't need to handle this
                }                                                                   // it should be concept level thing.
                
               /**
                 This function notifies the framework that the user has entered invalid input. 
                 The framework will only show the same error message once, and it will only show
                 one error message per invalid field (the last one to be sent). By default if no
                 error message is sent on the event, then a generic error message is displayed.
                 If there are any error messages, the submit button will be disabled. 
                 If the event object has a true ephemeral property however, the error will be
                 displayed for 3 seconds, and faded-out, and the button will not be disabled
                 (it is expected that ephemeral events are more notifications, and that the 
                 code that sent it will prevent the action the error forbids.)
                 @private
               */
                function badInputHandler(evt){
                    evt.reason = evt.reason ? "_"+ evt.reason : "";
                    var invalid_fields = cache[activeConcept].invalid_fields;
                    var target_name = $(evt.target).attr("name");
                    $.each(cache[activeConcept].views, function(index,view){
                           view.contents && view.contents.dom().find("[name="+target_name+"]").addClass("invalid"+evt.reason);
                           view.contents && view.contents.dom().find("[name="+target_name+"]").children().addClass("invalid"+evt.reason);
                    });
                    var message = evt.message ? evt.message : "This query contains invalid input, please correct any invalid fields.";
                    var already_displayed = false;
                    $.each($staticBox.find(".error"), function(index, warning) {
                        warning = $(warning);
                        var rc = warning.data("ref_count");
                        if (warning.text() === message) {
                            // We are already displaying this message
                            already_displayed = true;
                            if (evt.ephemeral){
                                return;
                            }
                            else if (invalid_fields[target_name+evt.reason] === undefined){
                                // This message has been displayed, but for another field, increase
                                // the reference count
                                invalid_fields[target_name+evt.reason] = warning;
                                warning.data("ref_count", rc+1);
                                
                            } else if (warning.text() !== invalid_fields[target_name+evt.reason].text()){
                                // This field already has an error message, but it's different,
                                // swap them
                                var field_rc = invalid_fields[target_name+evt.reason].data("ref_count");
                                invalid_fields[target_name+evt.reason].data("ref_count", field_rc-1);
                                if (invalid_fields[target_name+evt.reason].data("ref_count") === 0){
                                    invalid_fields[target_name+evt.reason].remove();
                                }
                                invalid_fields[target_name+evt.reason] = warning;
                                warning.data("ref_count", rc+1);
                            }
                        }
                    });
                    if (already_displayed) {
                        return;
                    }

                    var warning = $('<div class="message error">'+message+'</div>');
                    warning.data('ref_count',1);
                    if (!evt.ephemeral){
                        invalid_fields[target_name+evt.reason] = warning;
                    }
                    $staticBox.prepend(warning);
                    // if the warning is ephemeral (meaning its should be flashed on
                    // screen, but not kept there until a specific thing is fixed)
                    // then fade out and then remove
                    if (evt.ephemeral){
                        warning.fadeOut(3000, function(){
                            warning.remove();
                        });
                    }else{
                        // if not ephemeral, disable the button
                        $staticBox.find("#add_to_query").attr("disabled","true");
                    }
                }

                /**
                  This function notifies the framework that the user corrected an invalid field. 
                  The framework will only show the same error message once, and it will only show
                  one error message per invalid field (the last one to be sent). By default if no
                  error message is sent on the event, then a generic error message is displayed.
                  If there are any error messages, the submit button will be disabled.
                  @private
                */ 
                function fixedInputHandler(evt){
                    evt.reason = evt.reason ? "_"+ evt.reason : "";
                    var invalid_fields = cache[activeConcept].invalid_fields;
                    var target_name = $(evt.target).attr("name");
                    $.each(cache[activeConcept].views, function(index,view){
                        view.contents && view.contents.dom().find("[name="+target_name+"]").removeClass("invalid"+evt.reason);
                        view.contents && view.contents.dom().find("[name="+target_name+"]").children().removeClass("invalid"+evt.reason);
                    });
                    var rc = invalid_fields[target_name+evt.reason].data('ref_count') - 1;
                    if (rc === 0){
                        invalid_fields[target_name+evt.reason].remove();
                    }else{
                        invalid_fields[target_name+evt.reason].data('ref_count',rc);
                    }
                    delete cache[activeConcept].invalid_fields[target_name+evt.reason];
                    
                    // Re-enable the button if there are no more errors.
                    if ($.isEmptyObject(cache[activeConcept].invalid_fields)){
                        $staticBox.find("#add_to_query").attr("disabled","");
                    }
                }
                // Bind all framework events to their handler
                $container.bind({
                    'ViewReadyEvent': viewReadyHandler,
                    'ViewErrorEvent': viewErrorHandler,
                    'ShowViewEvent': showViewHandler,
                    'ElementChangedEvent' : elementChangedHandler,
                    'UpdateQueryButtonClicked' : addQueryButtonHandler,
                    'InvalidInputEvent' : badInputHandler,
                    'InputCorrectedEvent': fixedInputHandler,
                    'ConstructQueryEvent': constructQueryHandler,
                    'ConceptDeletedEvent': conceptDeletedHandler,
                    'ConceptAddedEvent': conceptAddedHandler
                });
                
                /**
                  This function loads dependencies for the concept and for the any views.
                  A callback does not have to be specified if the view is custom because
                  the view code is responsible for firing the ViewReadyEvent.
                  @private
                */
                function loadDependencies(deps, cb) {
                    cb = cb || function(){};

                    if (deps.css){
                        View.loadCss(deps.css);
                    }
                 
                    if (deps.js) {
                         require([deps.js], function (plugin) {
                             cb(deps);
                         });
                    } else {
                        cb(deps);
                    }
                };
                
                /**
                  This function handles all the administration of laoding a new concept.
                  It registers with the fraemwork, sets some flags, prepares the 
                  "add to query" button and displays the first view
                  @private
                */

                function loadConcept(concept){;
                    // If we got here, the globals for the current concept have been loaded
                    // We will register it in our cache
                    concept = register(concept);
                    activeConcept = parseInt(concept.id);
                    // Mark this concept as having its global dependencies loaded
                    concept.globalsLoaded = true; 
                    
                    // Setup tabs objects and trigger viewing of the first one
                    if (concept.views.length < 2) {
                        $tabsBar.hide();
                    } else {
                        $tabsBar.show();
                    }

                    var tabs = $.jqote(tab_tmpl, concept.views);
                    $tabsBar.html(tabs); 
                    if (concept['static']){
                        $staticBox.append(concept['static']);
                        $addQueryButton = $staticBox.find("#add_to_query");
                        
                    }else{
                        // Prepare the static concept box
                        $staticBox.append(add_query_tmpl);
                        $addQueryButton = $staticBox.find("#add_to_query");
                        $addQueryButton.click(function(){
                             var event = $.Event("UpdateQueryButtonClicked");
                             $(this).trigger(event);
                             return false; 
                        });
                    }
                    // Make sure the button for this concept has the correct label
                    if ($.inArray(activeConcept, concepts_in_query) >= 0) {
                        $addQueryButton.html('<span class="icon refresh"/> <span>Update Condition</span>');
                        $(".success",$staticBox).show();
                        
                    }else{
                        $addQueryButton.html('<span class="icon plus"/> <span>Add Condition</span>');
                         $(".success",$staticBox).hide();
                    }
                    // Regardless of whether the tabs are visible, load the first view
                    $tabsBar.children(':first').click();
                };

                /**
                  Set up the tabs bar for the plugin, we are using the live events to automatically
                  create tabs for any <a> elements put into the target area.
                  Clicking a tab, will fire a ConceptTabClickEvent, which will be caught by 
                  tabClickedHandler. This will fire a 'ShowViewEvent' up the DOM to our listener
                  
                  @private
                */
                function tabClickedHandler(evt, tab){
                    var index = $tabsBar.children().index(tab);
                    $tabsBar.trigger('ShowViewEvent', index);
                };
                $tabsBar.bind('ConceptTabClickedEvent', tabClickedHandler);

                $tabsBar.tabs(true, function(evt, $tab) {
                    $tab.trigger('ConceptTabClickedEvent',$tab);
                });



                /**
                  Registers a concept. This creates the concept object in the 
                  framework cache and verifies it has all necessary properties.
                  @private
                */
                function register(concept) {
                    if (cache[concept.id] === undefined){
                        cache[concept.id] = concept;
                    }else{
                        $.extend(cache[concept.id], concept);
                        concept = cache[concept.id];
                    }
                    // Create a datasource for this concept if we don't have one
                    if (!concept.ds){
                        // If this concept already has a query associated with it, 
                        // populate the datasource
                        if (concept.query) {
                            concept.ds = createDSFromQuery(concept.query);
                        }else{
                            // create empty datasource
                            concept.ds = {};
                        }
                    }    
                    // Add a spot to store invalid fields.
                    if (!concept.invalid_fields){
                        concept.invalid_fields = {};
                    }
                    return concept;
                };  

                // PUBLIC METHODS
                /**
                   Loads and makes a particular concept active and viewable
                   @public
                */
                function show(concept, existing_query, index, target) {
                   // Verify that we need to do anything.
                   if (parseInt(concept.id) === activeConcept)
                       return;
                   
                   // If we already have a query for this concept, set it 
                   // on the concept
                   if (existing_query) {
                       concept.query = existing_query;
                   }
                   
                   // If there is concept being displayed, save its static 
                   // content
                   if (activeConcept !== null){
                       cache[activeConcept]['static'] = $staticBox.children().detach();
                   }
                   // Set the name of the concept in the title bar
                   // $titleBar.text(concept.name);
                   if (cache[concept.id] && cache[concept.id].globalsLoaded){
                        loadConcept(concept);
                   } else {
                        loadDependencies(concept, loadConcept);
                   }
               }
                
                
                // Manager public methods
                return {
                    show: show,
                    isConceptLoaded: function(concept_id){
                        return (concept_id in cache);
                    },
                    buildQuery: buildQuery,
                    constructQueryHandler: constructQueryHandler
               };

            })();

        });
        
        return Manager;
    }
);
define('define/criteria',
     
    function() {

        var tmpl = $.jqotec([
            '<div data-uri="<%=this.uri%>" data-id="<%= this.pk %>" class="criterion clearfix">',
                '<a href="#" class="remove-criterion"></a>',
                '<a href="#" class="field-anchor">',
                    '<%= this.description %>',
                '</a>',
            '</div>'
        ].join(''));
        
        var Criteria = function(criteria_constraint, uri, english){
            
            var element = $($.jqote(tmpl, {pk:criteria_constraint.concept_id,
                                           description:english,
                                           uri:uri+criteria_constraint.concept_id}));
            element.data("constraint", criteria_constraint);
            
            element.find(".remove-criterion").click(function(){
                element.trigger("CriteriaRemovedEvent");
                return false;
            });
            

            // Display the concept in the main area when the user clicks on the description
            element.click(function (evt) { 
                element.trigger('activate-criterion',
                    [criteria_constraint.concept_id]);
                return false;
            }); 

            return element;
        };

        return {Criteria:Criteria};
    }
);
define('define/criteriamanager',
    
    ['define/criteria'],
    
    function(criteria) {

        var template = '<button id="submit-query"><span class="icon arrow-r"/> <span>Get Report</span></button>'; 
        var Manager;
        
        $(function() {
            var $panel = $('#user-criteria'); 

            Manager = (function(){
        
                var criteria_cache = {};
                
                var $criteria_div = $panel.find("#criteria-list"),
                    $run_query_div = $panel.find(".content"),
                    $remove_criteria = $panel.find("#remove-criteria");
                
                var criteria_api_uri = $criteria_div.attr("data-uri");
                var report_url = $criteria_div.attr("data-report");
                var session_api_uri = $panel.attr("data-uri");
                
                
                // Grab the contents of panel while it is empty and save off the 
                // "No Criteria" indicator text
                var $no_criteria_defined = $criteria_div.children();
                
                // Create the run query button
                var $run_query = $(template);
                
                // Load any criteria on the session
                $.getJSON(session_api_uri, function(data){
                      if ((data.store === null) || $.isEmptyObject(data.store)){
                          return;
                      }
                      if (!data.store.hasOwnProperty("concept_id")){ // Root node representing a list of concepts won't have this attribute
                          $.each(data.store.children.reverse(), function(index, criteria_constraint){
                              $panel.triggerHandler("UpdateQueryEvent", [criteria_constraint, true]);
                          });
                      }else{
                          $panel.triggerHandler("UpdateQueryEvent", [data.store, true]);
                      }
                });

                // Setup click even handlers
                // run the query
                $run_query.click(function(){
                    var all_constraints = [];
                    var server_query;
                    for (var key in criteria_cache){
                         if (criteria_cache.hasOwnProperty(key)){
                           all_constraints.push(criteria_cache[key].data("constraint"));
                         }
                    }
                    
                    if (all_constraints.length < 2){
                        server_query = all_constraints[0];
                    }else{
                        server_query = {type: "and", children : all_constraints};
                    }
                    $.putJSON(session_api_uri, JSON.stringify(server_query), function(){
                        window.location=report_url;
                    });
                });
                
                // Hook into the remove all criteria link
                $remove_criteria.click(function(){
                   for (var key in criteria_cache){
                       if (criteria_cache.hasOwnProperty(key)){
                           criteria_cache[key].trigger("CriteriaRemovedEvent");
                       }
                   } 
                });
                
                // Listen for new criteria as it is added
                $panel.bind("UpdateQueryEvent", function(evt, criteria_constraint, page_is_loading){
                    
                    var pk = criteria_constraint.concept_id;
                    var new_criteria;
                    // If this is the first criteria to be added remove 
                    // content indicating no criteria is defined, and add 
                    // "run query button"
                    if ($.isEmptyObject(criteria_cache)){
                        $no_criteria_defined.detach();
                        $run_query_div.append($run_query);
                    }

                    // Until this is validated by the server and we receive the english version of it
                    // disable the query.
                    $run_query.attr("disabled","true");
                    $.postJSON(criteria_api_uri, JSON.stringify(criteria_constraint), function(english){
                        $run_query.removeAttr("disabled");
                        var was_empty = $.isEmptyObject(criteria_cache);
                        // Is this an update?
                        if (criteria_cache.hasOwnProperty(pk)){
                            new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english);
                            criteria_cache[pk].replaceWith(new_criteria);
                            new_criteria.fadeTo(300, 0.5, function() {
                                  new_criteria.fadeTo("fast", 1);
                            });
                        }else{
                            new_criteria = criteria.Criteria(criteria_constraint, criteria_api_uri, english);
                            if (page_is_loading){
                                $criteria_div.prepend(new_criteria);
                            }else{
                                 $criteria_div.append(new_criteria);
                            }
                            var addEvent = $.Event("ConceptAddedEvent");
                            addEvent.concept_id = pk;
                            $panel.trigger(addEvent);
                        }
                        criteria_cache[pk] =  new_criteria;
                        if (!page_is_loading){
                            new_criteria.addClass("selected");
                            new_criteria.siblings().removeClass("selected");
                        }
                        
                        // If the cache used to be empty, show this one in the console.
                        if (was_empty){
                           $($criteria_div.children()[0]).find(".field-anchor").click();
                        }
                    }, "text");
                });


                // Listen for removed criteria
                $panel.bind("CriteriaRemovedEvent", function(evt){
                    var $target = $(evt.target);
                    var constraint = $target.data("constraint");
                    criteria_cache[constraint.concept_id].remove();
                    delete criteria_cache[constraint.concept_id];
                    
                    var removedEvent = $.Event("ConceptDeletedEvent");
                    removedEvent.concept_id = constraint.concept_id;
                    $panel.trigger(removedEvent);
                    
                    // If this is the last criteria, remove "run query" button
                    // and add back "No Criteria" indicator
                    if ($.isEmptyObject(criteria_cache)){
                        $criteria_div.append($no_criteria_defined);
                        $run_query.detach();
                    }
                });
                
                // Listen to see if the user clicks on any of the criteria.
                // Highlight the selected criteria to make it clear which one is
                // displayed
                $panel.bind("ShowConceptEvent", function (evt){
                      var $target = $(evt.target);
                      $criteria_div.children(".criterion").removeClass("selected");
                      if  ($target.is(".criterion")){
                          $target.addClass("selected");
                      }else{
                          // If the user clicked on the left-hand side, but we have this criteria
                          // defined, highlight it.
                          var id = evt.originalEvent.concept_id;
                          criteria_cache[id] && criteria_cache[id].addClass("selected");
                      }
                });

                return {
                    retrieveCriteriaDS: function(concept_id) {
                        var ds = null;
                        concept_id && $.each($criteria_div.children(), function(index,element){
                            if (!$(element).data("constraint")){
                                return; // could just be text nodes
                            }
                            if ($(element).data("constraint").concept_id == concept_id){ // TODO cast to string for both
                                ds = $(element).data("constraint");
                            }
                        });
                        return ds;
                    }
                };
            })();
        });

        return Manager;
    }
);
define('define/description',

    ['define/events'],

    function(Events) {

        $(function() {

            var dom = {
                description: $('<div id="description"></div>').appendTo('body')
            };

            dom.description.timeout = null;

            dom.description.bind(Events.ACTIVATE_DESCRIPTION, function(evt) {
                // TODO implement position

                clearTimeout(dom.description.timeout);

                var height, overflow,
                    target = $(evt.target),
                    offset = target.offset(),
                    width = target.outerWidth(),
                    description = target.children('.description').html();

                // refresh contents before getting height
                dom.description.html(description);

                height = dom.description.outerHeight();
                overflow = $(window).height() - (height + offset.top);

                dom.description.css({
                    left: offset.left + width + 20,
                    top: offset.top + (overflow < 0 ? overflow : 0)
                }).show();

                return false;
            });

            dom.description.bind(Events.DEACTIVATE_DESCRIPTION, function(evt, timeout) {
                timeout = timeout || 0;
                dom.description.timeout = setTimeout(function() {
                    dom.description.fadeOut(100);
                }, timeout);
                return false;

            });

            dom.description.bind({
                'mouseover': function() {
                    clearTimeout(dom.description.timeout);
                },

                'mouseout': function() {
                    dom.description.trigger(Events.DEACTIVATE_DESCRIPTION, [200]);
                }
            });

        });

    }

);
/*
 * The criterion objects provide the necessary data to render the interface
 * for interaction by the user. Thus, by definition, everything roughly
 * depends on which  criterion is currently active
 *
 * On Load:
 * - request all criterion objects, cache in local datastore
 *
 * User Interactions:
 * - on click, trigger an event that the criterion has changed
 *
 * All events are in the 'criterion' namespace.
 */

define('define/criteria2',

    ['define/events', 'rest/resource', 'define/conceptmanager',
        'define/criteriamanager', 'define/description'],

    function(Events, Resource, ConceptManager, CriteriaManager) {

        var template = [
            '<div data-id="<%= this.id %>">',
                '<span class="name"><%= this.name %></span>',
                '<span class="description"><%= this.description %></span>',
            '</div>'
        ].join('');

        var CriterionCollection;

        $(function() {

            var dom = {
                criteria: $('#criteria'),
                pluginPanel: $('#plugin-panel')
            };

            CriterionCollection = new Resource({

                url: dom.criteria.data('uri'),
                template: template

            }).ready(function() {

                dom.criteria.html(this.dom);
                
            });

            /*
             * When a new category is activated, the list of available criteria
             * must be filtered to only represent those in that category.
             */

            dom.criteria.current = null;

            dom.criteria.bind(Events.ACTIVATE_CATEGORY,

                function(evt, id) {

                    // find all criterion objects that are associated with the
                    // category and show them
                    CriterionCollection.ready(function() {

                        $.each(this.store, function() {
                            (this.data('category').id === id) ? this.show() : this.hide();
                        });

                    });
                }
            );

            // temporary binding to ShowConceptEvent until internals are
            // cleaned up
            dom.criteria.bind(Events.ACTIVATE_CRITERION + ' ShowConceptEvent',
                
                function(evt, id) {

                    if (dom.criteria.current === id)
                        return false;
                    dom.criteria.current = id;

                    CriterionCollection.ready(function() {

                        var target = this.store[id];
                        target.addClass('active');
                        target.siblings().removeClass('active');

                        var data = target.data();
                        dom.criteria.trigger(Events.SYNC_CATEGORY,
                            [data.category.id, id]);

                        var conditions = CriteriaManager.retrieveCriteriaDS(id);

                        if (ConceptManager.isConceptLoaded(id)) {
                            ConceptManager.show({id: id}, conditions);
                        } else {
                            $.ajax({
                                url: target.data('uri'),
                                dataType:'json',
                                beforeSend: function() {
                                    dom.pluginPanel.block();
                                },
                                complete: function() {
                                    dom.pluginPanel.unblock();                                    
                                },
                                success: function(json) {
                                    ConceptManager.show(json, conditions);
                                }
                            });
                        }
                    });
                }
            );


            /*
             * Delegation for handling the mouse hovering the '.info' element.
             * This must notify the description box of the event
             */
            var timeout = null;
            dom.criteria.delegate('div', 'mouseenter', function() {
                clearTimeout(timeout);
                var ref = this;
                timeout = setTimeout(function() {
                    $(ref).trigger(Events.ACTIVATE_DESCRIPTION, ['right']);
                }, 700);
            });

            /*
             * Delegation for handling the mouse leaving the '.info' element.
             * This is necessary since the user may be going to interact with
             * the description box.
             */
            dom.criteria.delegate('div', 'mouseleave', function() {
                clearTimeout(timeout);
                $(this).trigger(Events.DEACTIVATE_DESCRIPTION, [200]);
            });

            dom.criteria.delegate('div', 'click', function(evt) {
                clearTimeout(timeout);
                $(this).trigger(Events.ACTIVATE_CRITERION,
                    [$(this).data('id')]);
                $(this).trigger(Events.DEACTIVATE_DESCRIPTION);
            });

        });

        return CriterionCollection;
    }
);
/*
 * The search interface performs a GET to the CriterionCollection
 * resource with the ``q`` parameter, performing a filtering operation
 * on the objects.
 *
 * The response is a list of criterion IDs which can be used to filter
 * an existing list of criterion objects.
 *
 * On Load:
 * - get all criterion objects from local datastore, render the results
 *   box
 *
 * User Interactions:
 * - on keyup, trigger the search-criterion
 *
 * All events are in the 'criterion' namespace.
 */

define('define/search',

    ['define/events', 'define/criteria2', 'rest/resource'],

    function(Events, CriterionCollection, Resource) {

        var template = [
            '<div data-id="<%= this.id %>">',
                '<b><%= this.name %></b><br>',
                '<span><%= this.category.name %></span>',
            '</div>'
        ].join('');

        var ResultCollection;

        $(function() {

            var dom = {
                search: $('#search'),
                results: $('<div id="search-results"></div>').appendTo('body'),
                noresults: $('<p style="font-style:italic">No Results Found</p>')
            };

            /*
             * Sets the position of the search results div.
             *
             * Defined as a function since it is used once the results are
             * populated, but also when the window is resized.
             */
            function setResultsPosition() {

                var rWidth = dom.results.outerWidth(),
                    sOffset = dom.search.offset(),
                    sHeight = dom.search.outerHeight(),
                    sWidth = dom.search.outerWidth();

                dom.results.css({
                    left: sOffset.left - (rWidth - sWidth) / 2.0,
                    top: sOffset.top + sHeight + 5
                });

            };

            // all this trouble of copying the original CriterionCollection
            // to ensure there is no discrepancy between the search results
            // and the available options. the scenario that would lead to
            // confusion is if the server updated between the CriterionCollection
            // being populated and the user searches.
            CriterionCollection.ready(function() {

                ResultCollection = new Resource({

                    store: CriterionCollection._,
                    template: template

                }).ready(function() { 

                    dom.results.html(this.dom);
                    setResultsPosition();

                });

                /*
                 * Performs a GET to the server for the IDs of all objects that
                 * were a hit. The IDs are then iterated over and only those
                 * objects are shown.
                 */
                dom.search.autocomplete2({
                    success: function(value, json) {
                        dom.noresults.detach();
                        // show div, but hide results up front
                        dom.results.show().children().hide();

                        if (json.length) {
                            $.each(json, function() {
                                if (ResultCollection.store[this])
                                    ResultCollection.store[this].show();
                            });
                        } else {
                            dom.noresults.prependTo(dom.results);
                        }
                    }
                }, null, 50);

            });

            dom.results.entered = false;

            // this can be defined outside of the callback since nothing
            // directly depends on the ResultCollection itself
            dom.search.bind({

                /*
                 * When the search input loses focus, make sure the user is not
                 * interacting with the results box before hiding it.
                 *
                 * TODO should this fire a custom event rather than relying on
                 * 'mouseout'?
                 */
                'blur': function(evt) {
                    dom.search.focused = false;
                    if (!dom.results.entered)
                        dom.results.trigger('mouseleave');
                },
                
                /*
                 * If the user performed a search previously, show the state of
                 * the results as they were.
                 */
                'focus': function(evt) {
                    dom.search.focused = true;
                    var val = dom.search.val();
                    if (val && val !== dom.search.attr('placeholder')) {
                        dom.results.fadeIn('fast');
                    }
                }

            });

            dom.results.bind({

                /*
                 * When the mouse is on the search results, regardless if the
                 * search input loses focus, the results should not hide.
                 * Therefore this flag must be set.
                 */
                'mouseenter': function(evt) {
                    dom.results.entered = true;
                },

                /*
                 * Check to ensure the search input is not in focus before the
                 * results magically go away.
                 */
                'mouseleave': function(evt) {
                    dom.results.entered = false;
                    if (!dom.search.focused)
                        dom.results.fadeOut('fast');
                }

            });

            /*
             * Fire the ACTIVATE_CRITERION event when any of the results are
             * clicked.
             *
             * TODO there has been discussion to whether the results box should
             * hide once clicked, or stay open.
             */
            dom.results.delegate('div', 'click', function(evt) {

                var target = $(this);
                target.trigger(Events.ACTIVATE_CRITERION, [target.data('id')]);

            });

            /*
             * This is definitely an edge case, but a user may be in the middle
             * of searching and decided to resize the window so we need to reset
             * the search results position (this is only noticable when the
             * search input is in focus).
             */
            $(window).bind('resize', function(evt) {

                setResultsPosition();

            });

        });

        return ResultCollection;
    }
);
define("utils/html5fix",function(){$(function(){Modernizr.input.placeholder||$("input[placeholder]").placeholder(),Modernizr.input.autofocus||$("input[autofocus]").focus()})})var OVERLAY=$("#overlay");$("body").bind({ajaxComplete:function(a,b,c){if(b.status===302){var d=$.parseJSON(b.responseText);d.redirect&&(window.location=d.redirect)}},ajaxError:function(a,b,c,d){}})define("utils/ajaxsetup", function(){});
Array.prototype.map||(Array.prototype.map=function(a){var b=this.length>>>0;if(typeof a!="function")throw new TypeError;var c=Array(b),d=arguments[1];for(var e=0;e<b;e++)e in this&&(c[e]=a.call(d,this[e],e,this));return c}),function(a){a.extend({putJSON:function(b,c,d,e){return a.ajax({type:"PUT",url:b,contentType:"application/json",data:c,success:d,dataType:e})},postJSON:function(b,c,d,e){return a.ajax({type:"POST",url:b,contentType:"application/json",data:c,success:d,dataType:e})},log:function(a){window.console?console.log(a):alert(a)},jqoteobj:function(b,c,d){out=a.jqote(b,c,d);return a(out)}}),a.fn.placeholder=function(b){var c=this;c.each(function(){var d=a(this),e=d.css("color");b=b||d.attr("placeholder");if(!d.is("input")&&!d.is("textarea"))return c;(d.val()===""||d.val()===b)&&d.val(b).css("color","#999"),d.focus(function(){d.val()===b&&d.css("color",e).val("")}).blur(function(){d.css("color",e),d.val()===""&&d.css("color","#999").val(b)})});return this},a.fn.jdata=function(b,c){var d=a.grep(this,function(d){return a(d).data(b)==c});return a(d)},a.fn.autocomplete2=function(b,c,d,e){if(!this.is("input[type=text]")&&!this.is("input[type=search]"))throw new TypeError("A text or search field is required");c=c||null,d=d||300,e=e||!1;var f=a.extend({},b),g=f.success||function(){},h=f.error||function(){},i=f.start||function(){},j=f.end||function(){};f.data={};return this.each(function(b){var k=a(this),l,m,n,o=null,p=null,q=null,r=!1;l=k.closest("form").submit(function(a){return!1}),f.url=l.attr("action"),f.success=function(a,b,c){g(m,a,b,c),q==null&&e&&(q={resp:a,status:b,xhr:c}),n&&b=="success"&&(k.cache[m]=a),o=m,r=!1,f.end()},f.error=function(a,b,c){h(m,a,b,c),f.end()},f.start=function(){r=!0,i(m)},f.end=function(){r=!1,j()};var s="search-"+b;k.cache={},k.bind(s,function(b,g,h){n=h?!0:!1,m=g;n&&k.cache[m]?f.success(k.cache[m],"cached",null):(clearTimeout(p),c!==null&&m===c&&(m=""),m=m||"",m=SearchSanitizer.clean(m).toLowerCase(),m!==o?(r==!1&&f.start(),f.data.q=m,p=setTimeout(function(){e&&q?f.success(q.resp,q.status,q.xhr):a.ajax(f)},d)):f.end())}),k.keyup(function(a){k.trigger(s,[this.value]);return!1})})},a.fn.tabs=function(){var b={nextTab:function(a,b,c,d){b=b===undefined?a.data("tabindex"):b,c=c||a.attr("children").length,d=d===undefined?0:d+1;if(d==c)return null;if(c+1<=b)return this.nextTab(a,0,c,d);if(a.children(":nth("+b+")").hasClass("disabled"))return this.nextTab(a,b+1,c,d);return b},getTab:function(a,b){return a.children(":nth("+b+")")}},c={init:function(b,c,e){b.data("tabified",!0),c=c===!0?!0:!1,e=e||function(){};var f=b.children(".tab");c?a(".tab",b).live("click",d(e)):f.click(d(e)),f.filter(".active").length===0&&f.not(".disabled").filter(":first").click()},toggle:function(a,c){b.getTab(a,c).click(),a.data("tabindex",c)},disable:function(a,c){b.getTab(a,c).addClass("disabled").removeClass("active"),nindex=b.nextTab(a,c),nindex!==null&&this.toggle(a,nindex)},enable:function(a,c){b.getTab(a,c).removeClass("disabled")}},d=function(b){return function(c){c.preventDefault();var d=a(this).not(".disabled");if(d.length==0||d.hasClass("active"))return!1;var e=d.siblings(".tab");d.addClass("active"),e.removeClass("active"),b(c,d)}};return function(a,b){if(typeof a==="string"){if(this.data("tabified")===null)throw new TypeError("tabs have not been initialized yet");c[a](this,b)}else c.init(this,a,b);return this}}()}(jQuery)define("utils/extensions", function(){});
var SearchSanitizer={regexes:{truncateWhiteSpace:[/\s{2,}/g," "],removeNonAlphaNumeric:[/[^\sA-Za-z0-9]/g,""],removeStopWords:[/\b(a|able|about|across|after|all|almost|also|am|among|an|and|any|are|as|at|be|because|been|but|by|can|cannot|could|dear|did|do|does|either|else|ever|every|for|from|get|got|had|has|have|he|her|hers|him|his|how|however|i|if|in|into|is|it|its|just|least|let|like|likely|may|me|might|most|must|my|neither|no|nor|not|of|off|often|on|only|or|other|our|own|rather|said|say|says|she|should|since|so|some|than|that|the|their|them|then|there|these|they|this|tis|to|too|twas|us|wants|was|we|were|what|when|where|which|while|who|whom|why|will|with|would|yet|you|your)\b/g,""],trimRightWhiteSpace:[/^\s+/,""],trimLeftWhiteSpace:[/\s+$/,""]},clean:function(a){for(var b in this.regexes){var c=this.regexes[b];a=a.replace(c[0],c[1])}return a}}define("utils/sanitizer", function(){});
(function(a){a.bubbleproxy=function(b,c){return a(c||"body").bubbleproxy(b)},a.fn.bubbleproxy=function(b){b=b||{},typeof b=="string"&&(nconfig={},nconfig[arguments[0]]=arguments[1]||{},b=nconfig);var c=this;a.each(b,function(b,d){if(d.listeners){var e=a.map(d.listeners||[],function(b){return b.jquery?b:a(b)}),f=a.map(d.sources||[],function(a){return a.jquery?a.selector:a}),g=d.stopPropagation===undefined?!0:d.stopPropagation;c.bind(b,function(b){if(!!f.length){var c=!1,d=a(b.target);a.each(f,function(){c=!d.is(this);return c});if(!c)return}var h,i,j=Array.prototype.slice.call(arguments,1);a.each(e,function(){i=a.extend(a.Event(b.type),b),h=j.slice(0),h.unshift(i),g&&i.stopPropagation(),this.each(function(){a.event.trigger(i,h,this,!0)})})})}});return this}})(jQuery)define("lib/jquery.bubbleproxy", function(){});
require(
    // required modules
    [
        'define/events',
        'define/categories',
        'define/criteria2',
        'define/search',
        'define/criteriamanager',
        'utils/html5fix',
        'utils/ajaxsetup',
        'utils/extensions',
        'utils/sanitizer',
        'lib/jquery.bubbleproxy'
    ],
    
    function(Events, CategoryCollection, CriterionCollection, search, criteriamanager) {
   
        $(function() {

            var config = {};

            config[Events.ACTIVATE_CATEGORY] = {
                listeners: ['#criteria', '#categories']
            };

            config[Events.ACTIVATE_CRITERION] = {
                listeners: ['#criteria']
            };

            config[Events.SYNC_CATEGORY] = {
                listeners: ['#categories']
            };

            config[Events.ACTIVATE_DESCRIPTION] = {
                listeners: ['#description']
            };

            config[Events.DEACTIVATE_DESCRIPTION] = {
                listeners: ['#description']
            };

            config['ConceptAddedEvent ConceptDeletedEvent'] = {
                listeners: ['#plugin-panel']
            };

            config['UpdateQueryEvent'] = {
                listeners: ['#user-criteria']
            };

            var body = $('body');
            
            body.bubbleproxy(config);

//            var criteriaPanel = $('#user-criteria'),
//                content = $('#content');

            // The view manager needs to know where in the DOM to place certain things

        
            // Create an instance of the conceptManager object. Only do this once.
//            var conceptManager = conceptmanager.manager(pluginPanel, pluginTitle, pluginTabs, pluginDynamicContent,
//                pluginStaticContent);
        
//            var criteriaManager = criteriamanager.Manager(criteriaPanel);
        
//            content.bind('UpdateQueryEvent', function(evt, criteria_constraint) {
//                criteriaPanel.triggerHandler("UpdateQueryEvent", [criteria_constraint]);
//            });
//        
//            content.bind("ConceptAddedEvent ConceptDeletedEvent", function(evt){
//                pluginPanel.trigger(evt);
//            });
        
            // There are currently three ways this event can be triggered.
            // 1) Clicking on concept in the left hand-side menu
            //    a)  Slightly differently, a user can click on a concept in the left
            //        hand panel while that concept is already part of a question in the
            //        right-hand query panel, in which case, the data needs to be retrieved
            //        from the query component. 
            // 2) Clicking on a criteria from the query box on the right-hand side
            // 3) Clicking on a tab where a concept has already been opened while on 
            //    another tab. For example, if you were on Audiology Tab, selected ABR 1000,
            //    and then moved to Imaging, and then clicked back on Audiology.
//            body.bind('ShowConceptEvent activate-criterion', function(evt, id, conditions) {
//                var target = criteria.src.criteria.get()[id];
//                // notify the criteria manager so it can remove highlighted concepts if necessary
////                if (!target.is(".criterion"))
////                {
////                    evt.concept_id = target.attr('data-id');
////                    criteriaPanel.triggerHandler(evt);
////                }else {
////                    // deselect any highlighted criteria in the left hand side
////                    criteria.children(".active").removeClass("active");
////                
////                }
////                if (!existing_ds){
////                    // Criteria manager will have constraints if this is already in the right side
////                    // but they clicked on the concept in the left side
////                    existing_ds = criteriaManager.retrieveCriteriaDS(id);
////                }
////
//                if (conceptManager.isConceptLoaded(id)){
//                    pluginPanel.fadeIn(100);
//                    conceptManager.show({id: id}, conditions);
//                } else {
//                    $.ajax({
//                        url: target.data('uri'),
//                        dataType:'json',
//                        success: function(json) {
//                                pluginPanel.fadeIn(100);
//                                conceptManager.show(json, conditions);
//                        }
//                    });
//                }
//            });
        
        });
    }
);
define("define/main", function(){});
