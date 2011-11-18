define(['jquery', "cilantro/vendor/base"], function($){
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
});