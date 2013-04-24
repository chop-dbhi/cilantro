define(['jquery','plugins/typeselect'], function($){
   
    var inputTemplate = '<input id=source type=select autocomplete=false>';
    var targetTemplate = '<div id=target></div>';
    var $arena = $('#arena');

    function select($element, value){
        typeIn($element, value);
        downAndEnter($element);
    }

    function typeIn($element, value){
        var e;
        $element.val(value);
        // Tell the input something changed
        e = $.Event('input', { keyCode:65 });
        $element.trigger(e);
    }

    function downAndEnter($element){
        var e;
        // Down arrow 
        e = $.Event('keydown', { keyCode:40 });
        $element.trigger(e);
        // Enter
        e = $.Event('keydown', { keyCode:13 });
        $element.trigger(e);
    }

    describe('Typeselect typeahead wrapper', function(){
         var t;
         beforeEach(function(){
             $arena.append($(inputTemplate));
         });

         afterEach(function(){
             t.typeselect('destroy');
             $arena.empty();
         });

         it('attaches to text inputs', function(){
             t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana']
             });
             expect($('#source')).toHaveClass('tt-query');
         });
    });

    describe('Typeselect local source', function(){
         var t;
         beforeEach(function(){
             $arena.append($(inputTemplate));
             $arena.append($(targetTemplate));
         });

         afterEach(function(){
             t.typeselect('destroy');
             $arena.empty();
         });

         it('adds selections to the target', function(){
             t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana'],
                 target: '#target'
             });

             select($('#source'), 'apple');

             expect($('#target li')).toExist();
         });

         it('Adds preselected choices to the target', function(){
            t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana'],
                 target: '#target',
                 selected: {value: 'orange'}
             });
             expect($('#target li')).toExist();
             // Last char is X we insert, so remove it before comparison
             expect($('#target li').text().replace(/\W/g, '')).toEqual('orange');
         });

         it('Removes selected items when close is clicked', function(){
             t = $('#source').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana'],
                 target: '#target',
                 selected: {value: 'orange'}
             });

             expect($('#target li')).toExist();
             $('#target li span.close').click();
             expect($('#target li').length).toEqual(0);

         });

    });

    describe('Type select remote source', function(){
         var async = new AsyncSpec(this);
         var t;

         async.beforeEach(function(done){
             $arena.append($(inputTemplate));
             $arena.append($(targetTemplate));
             done();
         });

         async.afterEach(function(done){
             t.typeselect('destroy');
             $arena.empty();
             done();
         });

         async.it("Retrieves remove datasets", function(done){
             t = $('#source').typeselect({
                 name: 'test',
                 remote: '/mock/search.json',
                 target: '#target',
                 valueKey: 'label'
             });

             typeIn(t, 'Hem');
             setTimeout(function(){
                 downAndEnter(t);
                 expect($('#target li').text().replace(/\W/g, '')).toEqual('HemoglobinHGBs');
                 done();
             }, 1500);
         });
         // test removal of selected items
        
    });
}); 
