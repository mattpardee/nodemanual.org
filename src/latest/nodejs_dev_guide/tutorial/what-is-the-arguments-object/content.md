### The Arguments Object

The `arguments` object is a special construct available inside all function calls. It represents the list of arguments that were passed in when invoking the function. Since Javascript allows functions to be called with any number of arguments, we need a way to dynamically discover and access them.

The `arguments` object is an array-like object. It has a `length` property that corresponds to the number of arguments passed into the function. You can access these values by indexing into the array, _i.e._ `arguments[0]` is the first argument. Here's an example that illustrates the properties of `arguments`:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=arguments.example.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

This construct is very useful and gives Javascript functions a lot of flexibility. But there's an important caveat: although the `arguments` object behaves like an array, but it is _not_ an actual array. It doesn't have the `Array` object in its prototype chain, and it doesn't respond to any other array methods, such as `arguments.sort()`. This raises a `TypeError`. Instead, you need to copy the values into a true array before performin such operations. This is pretty easy to do with a `for` loop:

    var args = [];
    for(var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

In certain cases you can still treat `arguments` as an array. You can use `arguments` in dynamic function invocations using apply. And most native Array methods will also accept `arguments` when dynamically invoked using call or apply. 

This technique also suggests another way to convert `arguments` into a true array using the `Array.slice()` method:

    // concat arguments onto the list
    Array.prototype.concat.apply([1,2,3], arguments).

    // turn arguments into a true array
    var args = Array.prototype.slice.call(arguments);

    // cut out first argument
    args = Array.prototype.slice.call(arguments, 1);

The only other standard property of `arguments` is the `callee` property. This always refers to the function currently being executed. However, it's use is not recommended, as it has been deprecated. For a good explanation as to why this happened, see [this post on StackOverflow](http://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript).