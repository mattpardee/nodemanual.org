## Understanding Callbacks

In a synchronous program, you could write a function that looks like this:

    function processData() {
      var data = getData();
      data += 1;
      return data;
    }


This works just fine and is typical in other development environments. However, if `getData()` takes a long time to fetch the data (if, for example, it's streaming something from the Internet), then the entire program is blocked until the data is loaded. Node.js, being an asynchronous platform, doesn't wait around for things like file I/O to finish: Node.js uses callbacks.

A callback is a function called at the completion of a given task. This system prevents any blocking, and allows other code to be run in the meantime.

The Node.js way to deal with the above would look a bit more like this:

    function processData (callback) {
      fetchData(function (err, data) {
        if (err) {
          console.log("An error has occured. Abort everything!");
          callback(err);
        }
        data += 1;
        callback(data);
      });
    }

At first glance, it may look unnecessarily complicated, but callbacks are the foundation of Node.js. 

Callbacks give you an interface with which to say, "and when you're done doing that, do all this." This allows you to have as many I/O operations as your OS can handle happening at the same time. For example, in a web server with hundreds or thousands of pending requests with multiple blocking queries, performing the blocking queries asynchronously gives you the ability to be able to continue working and not just sit still and wait until the blocking operations come back. This is a major improvement.

The typical convention with asynchronous functions (which almost all of your functions should be) looks like this:

    function asyncOperation ( a, b, c, callback ) {
      // ... lots of hard work ...
      if ( /* an error occurs */ ) {
        return callback(new Error("An error has occured"));
      }
      // ... more work ...
      callback(null, d, e, f);
    }

    asyncOperation ( params.., function ( err, returnValues.. ) {
       //This code gets run after the async operation gets run
    });

You will almost always want to follow the [error callback convention](what-are-the-error-conventions.html), since most Node.js users will expect your project to follow them. The general idea is that the callback is the last parameter. The callback gets called after the function is done with all of its operations. Traditionally, the first parameter of the callback is the `error` value. If the function hits an error, then it typically calls the callback with the first parameter being an `Error` object. If the function cleanly exits, then it calls the callback with the first parameter being `null` and the rest being the return value(s).