define(['jquery','plugins/typeselect'], function($){
   
    var inputTemplate = '<input id=source type=select autocomplete=false>';
    var targetTemplate = '<div id=target></div>';
    var $arena = $('#arena');

    function select($element, value){
        var e;
        $element.val(value);
        // Tell the input something changed
        e = $.Event('input', { keyCode:65 });
        $element.trigger(e);
        // Down arrow 
        e = $.Event('keydown', { keyCode:40 });
        $element.trigger(e);
        // Enter
        e = $.Event('keydown', { keyCode:13 });
        $element.trigger(e);
    }

    describe('Typeselect typeahead wrapper', function(){

         beforeEach(function(){
             $arena.append($(inputTemplate));
         });

         afterEach(function(){
             $arena.empty();
         });

         it('attaches to text inputs', function(){
             $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana']
             });
             expect($('#source')).toHaveClass('tt-query');
         });
    });

    describe('Typeselect', function(){
         beforeEach(function(){
             $arena.append($(inputTemplate));
             $arena.append($(targetTemplate));
         });

         afterEach(function(){
             $arena.empty();
         });

         it('adds selections to the target', function(){
             var t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana'],
                 target: '#target'
             });

             select($('#source'), 'apple');

             expect($('#target li')).toExist();
         });

         it('Adds preselected choices to the target', function(){
             var t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana'],
                 target: '#target',
                 selected: {value: 'orange'}
             });
             expect($('#target li')).toExist();
             // Last char is X we insert, so remove it before comparison
             expect($('#target li').text().replace(/\W/g, '')).toEqual('orange');
         });
    });
}); 
