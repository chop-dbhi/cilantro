define(['jquery', "cilantro/define/viewelement", 'order!vendor/jquery.jqote2'], function($, ViewElement) {
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
                                                      } else if ($associated_inputs && $associated_inputs.prop("type") in {"text":1, "textarea":1}){
                                                          // The operator has associated inputs, and they are of type text or textarea:
                                                          // This section takes care of modifying textinputs when the user changes the operator
                                                          // to be an IN operator.
                                                          // One of the convenience things we allows is the pasting of newline sepearate text so that
                                                          // for example, someone can paste in an excel column of patient aliases.
                                                          // If the user selects an IN operator, we switch the text input -> textarea and vice versa
                                                          if (opt.value.search(/exact/) >= 0 && $associated_inputs.prop("type") === "textarea"){
                                                              // The operator is of type exact, but the associated input is a text area, switch to text input
                                                              $associated_inputs.data("switch").data("switch", $associated_inputs);
                                                              $associated_inputs.before($associated_inputs.data("switch")).detach();
                                                              $associated_inputs.data("switch").keyup();
                                                              // Swap out textarea with text
                                                          } else if (opt.value.search(/^-?in$/)>=0 && $associated_inputs.prop("type") === "text"){
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
            var type = $element.prop("type");
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
