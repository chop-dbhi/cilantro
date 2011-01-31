define(function(){
    // This is a task management and object proxy library.
    // It is currently being used for two things
    // The metaphor behind the name, a hotel frontdesk, is becoming increasingly strained
    
    // It is currently used in two ways, and they are not mutually exclusive.
    // 1) As a task dependency tracker
    //   1A) 
    //      As a semaphore that executes callbacks once the count reaches a certain number and
    //      once the count reaches 0. It also allows each increment to be named so that a matching
    //      decrement must be called for the count to decrease.
    //          var f = new FrontDesk(4);
    //      You can then set two different kinds of callbacks.
    //          f.onFull(function(){do something ...});
    //          f.onEmpty(function(){do something...});
    //      Then as f.checkIn() is called, if the number of guests ever equals capacity, 
    //      all the onFull callback functions will be executed. 
    //      When f.CheckOut() is called, if the number of guests ever reaches 0, 
    //      all the onEmpty callback functions will be called.
    //      The simplest method here would be to call both checkIn and checkOut with no arguments, in
    //      which case it operates as a simple counter.
    //      If called with an argument, it must be a unique string identifier, called room internally.
    //      In this case, the hotel will not be empty until checkOut has been called with every UID
    //      that checkIn was called with. You cannot check the same guest in while they are already checked in and
    //      you can't check a guest out if he is already checked out. You can mix checking in named and anonymous 
    //      guests.
    //   1B) As a task dependency tracker. If you call the constructor with a list:
    //         var f = new FrontDesk([3, "dfd", "id1"]);
    //       And then set callbacks for onFull, it will execute the onFull handlers when all checkIn has been called with all id's listed
    //       in the list sent to the constructor. All id's must be checked in simultaneously.
    //       
    // 2) As an object proxy. An object can checkin with a unique id. From then on, anyone can call leaveMessage with 
    // that id, and the message will be saved for when that object checksOut. Once an object checksout (using its unique id, and passing in a reference to itself),
    // all saved messages will be delivered, and all future messages will be delivered immediately. In this way, once an object has checked
    // in or out, the library can be used as a proxy for the object.
    // [TODO] add a greeting feature that would allow a list of messages to be delivered everytime an object checks out.
    function FrontDesk(capacity, jq){
        var guests = 0;
        var empty = [];
        var full = [];
        var messages = {};
        var status = {};
        var rooms = {};
        var expecting = null;
        var tracking = isArray(capacity);
        var lobby = [];

        jq = jq || jQuery || $;
        // From JavaScript the Good Parts
        function isArray(val){
            if (val && typeof val === "object" && typeof val.length === "number" && !(val.propertyIsEnumerable('length'))){
                return true;
            }
            return false;
        }
        // This function will issue a get on a URL, but return an object
        // that can be reused immediately. The object will record any
        // functions that are called on it, and when the real object is
        // returned from the server it will replay all actions on the
        // real object.  Once the real object is available, the fake one
        // will just immediately proxy all calls to the real object.
        this.fetch = function(url, constructor) {
        // if constructor is a function, we will create an instance of
        // it and mock it out
        // if constructor is not present
                         
       
        
        
        
        
        
        }

        this.onEmpty = function(cb){
            empty.push(cb);
        };

        this.onFull = function(cb){
            full.push(cb);
        };
        
        // What about if only one argument is passed to checkin and out,
        // making that be in a semaphore type thing.

        this.checkIn = function(room, obj){
            var item;
            var allCheckedIn = false;
            if (room !== undefined){
                // We check this to make sure they haven't checked in twice
                // This covers the situation where they have never checked in
                // or they checked out, and came back in
                
                // If room is not an object, assume it is an identifier
                if (isID(room)){
                      if (status[room] !== "in"){
                          messages[room] = [];
                          status[room] = "in";
                          if (obj !== undefined){
                              var ref = this; 
                              jQuery(obj).once("ready",function(){
                                  ref.checkOut(obj);
                              });
                              rooms[room] = obj;
                          }
                      } 
                } else {
                   // Room is an object
                   var chair = jQuery.inArray(room, lobby);
                   if (!~chair || (chair >=0 && !jQuery.isArray(cubby[chair]))){
                      lobby.push(room);
                      cubby[chair]=[];
                      jQuery(room).once("ready", function(){
                           ref.checkOut(room);
                      });
                   }
                }
                // TODO  might know nothing happened already here
                allCheckedIn = true;
                if (tracking){
                     for (item in capacity){
                         if (status[item] !== "in"){
                             allCheckedIn = false;
                             break;
                         }
                     }
                }
            }else{
                guests++;
            }

            if (numberOfGuests() === capacity || allCheckedIn){
                 $.each(full, function(index, element){
                        element();
                });
            }
            return obj;
        };

        this.checkOut = function(room, forwardAddress){
            if (numberOfGuests()===0){
                // No one can checkout if no one is here.
                return; 
            }

            if (room === undefined){
                guests--;
            }else{
                if (isID(room)){
                     // Can't check out the same guest twice;
                     if (status[room] === "in"){
                         status[room] = "out";
                         if (forwardAddress !== undefined){
                             rooms[room] = forwardAddress;
                         }
                         for (var i = 0, l = messages[room].length; i < l; i++){
                             giveMessage(room,messages[room][i][0], messages[room][i][1]);
                         }
                     }
                }else {
                    var chair = jQuery.inArray(lobby);
                    if (chair >=0 && jQuery.isArray(cubby[chair])){
                        // Can't checkout if your not in
                        for (var i = 0, l = cubby[chair].length; i < l; i++){
                            giveMessage(room, cubby[chair][i][0], cubbby[chair][i][1]);
                        } 
                        cubby[chair]==="IN";
                    }
                }
            }
            
            if (numberOfGuests() === 0){
                $.each(empty, function(index, element){
                    element();
                });
            }
        };

        this.leaveMessage = function(room, message){
            var args = Array.prototype.slice.call(arguments, 2);
            if isID(room){ 
               if (status[room] === "in"){
                   messages[room].push([message, args]);
               }else{
                  giveMessage(room, message, args);
               }
            }else{
                // This is for an object
            }
        };

        // Determine what kind of message has been left and act accordingly
        function giveMessage(room, message, args){
             var guest = isID(room) ? rooms[room]:room;

             // Determine what kind of message has been left
             if (typeof message === "function"){
                 // Assume this a function to be called
                 message.apply(message, args);
             }else if (typeof message === "string" || message instanceof String){
                 // Assume this a function that exists on our guest.
                 // TODO check if guest can recieve this message
                 guest[message].apply(guest, args);
             }
        }

        function isId(obj){
            return (obj === null || typeof obj.valueOf() in {"number":1, "boolean":1,"string":1});
        }

        function numberOfGuests(){
             var num = 0;
             for (var key in status){
                    if (status[key] === "in") num++;
             }
             for (var key in cubby){
                    if (jQuery.isArray(cubby[key])) num++;
             }
             return num+guests;
        }
    }
    return FrontDesk;
});
