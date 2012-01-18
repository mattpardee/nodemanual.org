// Example

var myfunc = function(one) 
{
   if (arguments[0] === one)
       console.log("First argument is 1");   
   if (arguments[1] === 2)
       console.log("Second argument is 2");   
   if (arguments.length === 3)
       console.log("Third argument is 3");
    }

myfunc(1, 2, 3);