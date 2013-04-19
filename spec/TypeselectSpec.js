define(['jquery','plugins/typeselect'], function($){
   
    var inputTemplate = '<input id=target type=select autocomplete=false>';
    var $arena = $('#arena');

    describe('Typeselect', function(){
         
         beforeEach(function(){
              $arena.append($(inputTemplate));
         });

         afterEach(function(){
             //$arena.empty();
         });

         it('attaches to text inputs', function(){
             $('#target').typeselect({
                 name: 'test',
                 local: ['apple', 'orange', 'banana']
             });

         });
    });
}); 
