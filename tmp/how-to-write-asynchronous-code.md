

&ltdiv class="hero-unit">

<a class="hiddenLink" id="writing-asynchronous-code"></a>

## Writing Asynchronous Code
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


At its core, Node.js promotes an asynchronous coding style, which is in contrast to many other web frameworks. There are a number of important things to be aware of when learning to write asynchronous code&mdash;otherwise, you will often find your code executing in extremely unexpected ways.

Take this rule to heart: **use the asynchronous functions, avoid the synchronous ones!**

Many of the functions in Node.js have both asynchronous and synchronous versions. Under most circumstances, it will be far better (and more efficient) for you to use the asynchronous functions.

Here's a quick example comparing the two styles using `fs.readFile()`:

    fs = require('fs'); // Import the 'fs' module

    // Asynchronous version
    fs.readFile('example.file', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
    });

    //====================

    // Synchronous version
    var data = fs.readFileSync('example.file','utf8');
    console.log(data);

Just by looking at these two blocks of code, the synchronous version appears to be more concise. However, the asynchronous version is more complicated for a very good reason. In the synchronous version, the server is paused until the file is finished reading; your process will just sit there, waiting for the OS (which handles all file system tasks) to complete the task.

The asynchronous version, on the other hand, does not stop time. Instead, the callback function gets called when the file is finished reading. This leaves your process free to execute other code in the meantime.

When only reading a file or two, or saving something quickly, the difference between synchronous and asynchronous file I/O can be quite small. However, when you have multiple requests coming in per second that require file or database access, trying to do that I/O synchronously would be quite disastrous for performance.

#### Callbacks

Callbacks are essential in Javascript, and are a basic idiom in Node.js for asynchronous operations. Essentially, callbacks refer to functions that are passed as the final paramter to an asynchronous function. After the asynchronous funciton executes, the callback function is called with any return value or error message the asynchronous function produces. For more information, see [the section on callbacks](#what-are-callbacks).

#### Event Emitters

Event emitters are another basic concept in Node.js. A constructor for the object is provided in Node.js core: `require('events').EventEmitter`. 

An event emitter is typically used when you know that there will be multiple parts to an asynchronous response. Since you typically want a callback function called once, you use an event emitter to control the number of times it's referenced. For more details, see [the article on event emitters](#what-are-event-emitters).

#### Caveats in Asynchronous Code

A common mistake in asynchronous code with Javascript is to write code with a loop that does something like this:

     for (var i = 0; i < 5; i++) {
       setTimeout(function () {
         console.log(i);
       }, i);
     }

Here, we're trying to print sequentially the numbers one through five. The undesired (and unexpected) output is:

    5
    5
    5
    5
    5

This occurs because every time `i` is incremented, a new timeout is created. When the callback is called at the end of the loop, it receives for the value of `i`, which is 5. The solution is to create a [closure](http://stackoverflow.com/questions/1801957/what-exactly-does-closure-refer-to-in-javascript) so that the current value of `i` is stored. For example:

     for (var i = 0; i < 5; i++) {
       (
           function(i) {
               setTimeout(function () {
                   console.log(i);
                }, i);
            }
        )(i)};

This gives the proper output:

    0
    1
    2
    3
    4&lt/div>
