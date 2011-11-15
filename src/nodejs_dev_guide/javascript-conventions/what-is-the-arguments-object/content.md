### The Arguments Object

The `arguments` object is a special construct available inside all
function calls. It represents the list of arguments that were passed
in when invoking the function. Since Javascript allows functions to be
called with any number of arguments, we need a way to dynamically discover and
access them.

The `arguments` object is an array-like object. It has a `length`
property that corresponds to the number of arguments passed into the
function. You can access these values by indexing into the array,
i.e. `arguments[0]` is the first argument. Here's an example that illustrates the
properties of `arguments`.

    var myfunc = function(one) 
    {
    if (arguments[0] === one)
    {
      console.log("First argument is 1");   
    }
    if (arguments[1] === 2)
    {
      console.log("Second argument is 2");   
    }
    if (arguments.length === 3)
    {
      console.log("Third argument is 3");
    }
    }

    myfunc(1, 2, 3);

This construct is very useful and gives Javascript functions a lot of
flexibility. But there is an important caveat. The `arguments` object
behaves like an array, but it is _not_ an actual array. It doesn't have the
`Array` object in its prototype chain, and it doesn't respond to any other array
methods, such as `arguments.sort()`. This raises a `TypeError`. Instead, you need to
copy the values into a true array before performin such operations. This is pretty easy to do with a `for` loop:

    var args = [];
    for(var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
    }

In certain cases you can still treat `arguments` as an array. You can
use `arguments` in dynamic function invocations using apply. And most
native Array methods will also accept `arguments` when dynamically
invoked using call or apply. 

This technique also suggests another way
to convert `arguments` into a true array using the `Array.slice()` method:

    // concat arguments onto the list
    Array.prototype.concat.apply([1,2,3], arguments).

    // turn arguments into a true array
    var args = Array.prototype.slice.call(arguments);

    // cut out first argument
    args = Array.prototype.slice.call(arguments, 1);

The only other standard property of `arguments` is the `callee` property. This always refers to the function currently being executed. However, it's use is not recommended, as it has been deprecated. For a good explanation as to why this happened, see [this post on StackOverflow](http://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript).