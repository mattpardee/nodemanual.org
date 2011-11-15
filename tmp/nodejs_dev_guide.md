

<a id="getting-started"></a>

## Introduction



Node.js is a server-side Javascript environment. It's event-driven, asynchronous, and allows you to write a web server in a relatively quick amount of time.

The purpose of this document is to provide a resource for developers of all levels&mdash;beginning, intermediate, and advanced&mdash;with a consolidated set of Node.js tutorials and best practices. The origin of this document comes from [Nodejitsu](http://docs.nodejitsu.com/), the [Node.js Wiki](https://github.com/joyent/node/wiki), and various other Node.js communities.

In order to get Node.js, you can either download [the latest stable release](http://nodejs.org/#download), or clone the version submitted into the GitHub repo. Keep in mind that stable releases are even-numbered (0.2, 0.4, 0.6), while unstable releases are odd (0.3, 0.5).

<a id="how-to-write-asynchronous-code"></a>

### Writing Asynchronous Code
<span class="cite">By Nico Reed (Aug 26 2011)</span>


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

An event emitter is typically used when you know tht there will be multiple parts to an asynchronous response. Since you typically want a callback function called once, you use an event emitter to control the number of times it's referenced. For more details, see [the article on event emitters](api.html#what-are-event-emitters).

#### Caveats in Asynchronous Code

A common mistake in asynchronous code with Javascript is to write code with a loop that does something like this:

     for (var i = 0; i < 5; i++) {
       setTimeout(function () {
         console.log(i);
       }, i);
     }

Here, we're trying to print to The undesired (and unexpected) output is:

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
    4

<a id="what-are-callbacks"></a>

### Understanding Callbacks
<span class="cite">By Nico Reed (Aug 26 2011)</span>


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

You will almost always want to follow the [error callback convention](api.html#what-are-the-error-conventions), since most Node.js users will expect your project to follow them. The general idea is that the callback is the last parameter. The callback gets called after the function is done with all of its operations. Traditionally, the first parameter of the callback is the `error` value. If the function hits an error, then it typically calls the callback with the first parameter being an `Error` object. If the function cleanly exits, then it calls the callback with the first parameter being `null` and the rest being the return value(s).

<a id="what-are-event-emitters"></a>

### Understanding Event Emitters
<span class="cite">By Nico Reed (Aug 26 2011)</span>


In Node.js, an event can be described simply as a string with a corresponding callback. An event can be "emitted" (or in other words, have the corresponding callback be called) multiple times; or, you can choose to only listen for the first time it is emitted. 

Here's a very simple example:

    var http = require('http');
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Check the console for your results!\n');
      
        var emitter = new (require('events').EventEmitter);

        // establish two events, one for "test" and one for "print"
        emitter.addListener("test", function () { console.log("test"); });
        emitter.on("print", function (message) { console.log(message); });

        var someString = "variable";

        // try to launch the events
        emitter.emit("test");
        emitter.emit("print", "Here's a message, with " + someString);
        emitter.emit("unhandled");
    }).listen("1337", "127.0.0.1");

This demonstates all the basic functionality of an event emitter. The `on()` or `addListener()` method (they're synonymous) allows you to choose the event to watch for and the callback to be called. The `emit()` method lets you to "emit" an event, which causes all callbacks registered to the event to be called.

In the example, we first subscribe to both the `test` and `print` events. Then, we emit the `test`, `print`, and `unhandled` events. Since `unhandled` has no callback, it just returns `false`; the other two run all the attached callbacks and return `true`.

In the `print` event, note that we pass an extra parameter. Any additional parameters passed to `emit()` get passed to the callback function as arguments.

If you use the method `once()` instead of `on()`, after the callback is fired, it is removed from the list of callbacks. This is convinient if you want to detect only the first time an event has been emitted.

If you want to remove a specific callback, you can use `removeListener()`. If you want to remove all callbacks to a specific event, you can use `removeAllListeners()`. For example:

    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Check the console for your results!\n');

        var EventEmitter = require('events').EventEmitter;
        var ee = new EventEmitter();

        var callback_once = function() {
          console.log("Callback has been called!");
        }

        var callback_many = function() {
          console.log("Let's keep calling me!");
        }
        
        ee.once("event", callback_once);
        ee.emit("event");
        ee.emit("event");

        console.log ("Moving on...");
        
        ee.on("event", callback_many);
        ee.emit("event");
        ee.emit("event");
        
        console.log("Let's remove the multiple calls.");
        
        ee.removeListener("event", callback_many);
        ee.emit("event");
        
        // In theory, callback_once should still emit--but since
        // we defined it as emitting once(), we get nothing here

    }).listen("1337", "127.0.0.1");

**Note**: if you want create more than 10 listeners on a single event, you will have to make a call to `setMaxListeners(n)`, where `n` is the max numbers of listeners (passing 0 allows for an unlimited number of listeners). The maximum limit is used to make sure you aren't accidently leaking event listeners.

For more information, you can refer to [the official Node.js reference page on the `EventEmitter` object](http://nodejs.org/docs/latest/api/events.html).

<a id="what-is-require"></a>

### Defining require()
<span class="cite">By Nico Reed (Aug 26 2011)</span>


 Node.js follows the [CommonJS module system](http://wiki.commonjs.org/wiki/Modules/1.1), and the built-in `require()` function is the easiest way to include modules that exist in separate files. The basic functionality of `require()` is that it reads a Javascript file, executes the file, and then proceeds to return the `exports` object. 

 Here's an example module snippet defined in a file called `example.js`:

    console.log("evaluating example.js");

    var invisible = function () {
      console.log("invisible");
    }

    exports.message = "hi";

    exports.say = function () {
      console.log(message);
    }

If you run `var example = require('./example.js')`, `example.js` is evaluated. The `example` variable becomes an object equal to:

    {
      message: "hi",
      say: [Function]
    }

If you want to set the `exports` object to a function or a new object, you have to use the `module.exports` object. For example, if you define the following code in a file called `example2.js`:

    module.exports = function () {
      console.log("hello world")
    }

Then calling it with `require()` will actually run the `exports` object:

    require('./example2.js')()
    
It is worth noting that each time you subsequently `require()` a previously required file, the `exports` object is cached and reused. To illustrate this point: 

    node> require('./example.js')
    evaluating example.js
    { message: 'hi', say: [Function] }
    node> require('./example.js')
    { message: 'hi', say: [Function] }
    node> require('./example.js').message = "hey" // Set the message to "hey"
    'hey'
    // You might think this "reloads" the file...
    node> require('./example.js') 
    { message: 'hey', say: [Function] }
    // ...but the message is still "hey" because of the module cache


As you can see from the above, `example.js` is evaluated the first time, but all subsequent calls to `require()` only invoke the module cache, rather than reading the file again.  As seen above, this can occasionally produce side effects.

The rules of where `require()` finds the files can be a little complex, but a simple rule of thumb is that if the file doesn't start with "./" or "/", then it is either considered a core module (and the local Node.js path is checked), or a dependency in your directory's `node_modules` folder. If the file starts with "./" it is considered a relative file to the file that called `require()`. If the file starts with "/", it is considered an absolute path. **Note**: you can omit ".js" and `require()` will automatically append it if needed. For more detailed information, see [the official docs](http://nodejs.org/docs/latest/api/modules.html) for more information.

If the filename passed to `require()` is actually a directory, it will first look for `package.json` in the directory and load the file referenced in the `main` property. Otherwise, it will look for an `index.js` file.

<a id="npm"></a>

## NPM




<a id="what-is-npm"></a>

### Understanding the NPM
<span class="cite">By Nico Reed (Aug 26 2011)</span>


npm, short for Node Package Manager, is two things: first and foremost, it is an online repository for the publishing of open-source Node.js projects; second, it is a command-line utility for interacting with said repository that aids in package installation, version management, and dependency management.  A plethora of Node.js libraries and applications are published on npm, and many more are added every day. These applications can be searched for on [the npm registry](http://search.npmjs.org). Once you have a package you want to install, it can be installed with a single line command.

Let's say you're hard at work one day, developing the Next Great Application.  You come across a problem, and you decide that it's time to use that cool library you keep hearing about--it happens to be [async](http://github.com/caolan/async) (as an example). Thankfully, npm is very simple to use: you only have to run `npm install async` on the command line, and the specified module will be installed in the current directory under `./node_modules/`.  Once installed to your `node_modules` folder, you'll be able to use `require()` on them, just as if they were built-ins to Node.js.

There's also the concept of a "global" install. Let's say we want to globall install the [Coffescript Node.js package](https://github.com/jashkenas/coffee-script). The npm command for a global install is simple: `npm install coffee-script -g`. This will install the program and put a symlink to it in `/usr/local/bin/`. You can then run the program from the console just like any other CLI tool.  In this case, running `coffee` will now allow you to use the coffee-script command line interface.

Another important use for npm is dependency management.  When you have a node project with a [package.json](api.html#what-is-the-file-package-json) file, you can run `npm install` from the project root, and npm will install all the dependencies listed in the package.json. This makes installing a Node.js project from a git repo much easier! For example, `vows`, one of Node's testing frameworks, can be installed from git, and its single dependency, `eyes`, can be automatically handled:

    git clone https://github.com/cloudhead/vows.git
    cd vows
    npm install

After running those commands, you will see a `node_modules` folder containing all of the project dependencies specified in the package.json.

<a id="how-to-access-module-package-info"></a>

### Accessing Module Package Info
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


There are many situations in the world of software development where using the wrong version of a dependency or submodule can cause all sorts of pain and anguish. Node.js has a module available called `pkginfo` that can help keep these sorts of troubles at bay.

Let's take a look at pkginfo. First, install it via npm:

     npm install pkginfo

Now all we need to do is require it, and then invoke it:

     var pkginfo = require('pkginfo')(module);

     console.dir(module.exports);

This shows us the entire contents of the package.json, neatly displayed to the console.  If we only wanted certain pieces of information, we can just specify them like so:

     var pkginfo = require('pkginfo')(module, 'version', 'author');

     console.dir(module.exports);

And only the fields we specify will be shown to us.

For more information, see [the GitHub repo for pkginfo](https://github.com/indexzero/node-pkginfo).

<a id="what-is-node-core-verus-userland"></a>

### Explaining "Node Core" versus "Userland"
<span class="cite">By Isaac Z. Schlueter (Aug 26 2011)</span>


Occasionally, in the discussions in the Node.js mailing lists and IRC channels, you may hear things referred to as "node core" and "userland".

Of course, traditionally, "userland" or "userspace" refer to everything outside the operating system kernel. In that sense, Node.js itself is a "userland" program.

However, in the context of Node.js, "core" refers to the modules and bindings that are compiled into Node.js.  In general, they provide a hook into very well-understood low-level functionality which almost all networking programs require: TCP, HTTP, DNS, the file system, child processes, and a few other things. If something is fancy enough to argue about, there's a good chance it won't be part of node-core. HTTP is about as big as it gets, and if it wasn't so popular, it'd certainly not be a part of Node.js.

There are also some things in node core that are simply too painful to do within a JavaScript environment, or which have been created to implement some browser object model (BOM) constructs which are not part of the Javascript language, but may as well be (e.g., `setTimeout()`, `setInterval()`, and `console`).

Everything else is "userland".  This includes: npm, express, request, coffee-script, mysql clients, redis clients, and so on.  You can often install these programs using [npm](http://npmjs.org/).

The question of what is properly "node-core" and what belongs in "userland" is a constant battleground.  In general, node is based on the philosophy that it should **not** come with "batteries included."  It is easier to move things out of node-core than it is to move them in, which means that core modules must continually "pay rent" in terms of providing necessary functionality that nearly everyone finds valuable.

#### This is a Good Thing.

One goal of Node's minimal core library is to encourage people to implement things in creative ways, without forcing their ideas onto everyone. With a tiny core and a vibrant user space, we can all flourish and experiment without the onerous burden of having to always agree all the time.

#### Userland Isn't Less

If anything, it's more. Building functionality in userland rather than in the node core means:

* You have a lot more freedom to iterate on the idea.
* Everyone who wants your module can install it easily enough (if you publish it with npm).
* You have freedom to break node conventions if that makes sense for your use case.

If you believe that something **really** just *needs* to be part of node's core library set, you should *still* build it as a module!  It's much more likely to be pulled into node-core if people have a chance to see your great ideas in action, and if its core principles are iterated and polished and tested with real-world use.

Changing functionality that is included in node core is very costly.  We do it sometimes, but it's not easy, and carries a high risk of regressions.  Better to experiment outside, and then pull it into node core once it's stable.  Once it's usable as a userland package, you may even find that it's less essential to node core than you first thought.

<a id="what-is-the-file-package-json"></a>

### Understanding the File Package JSON?
<span class="cite">By Nico Reed (Aug 26 2011)</span>


All NPM packages contain a file, usually in the project root, called `package.json`. This file holds various metadata relevant to the project.  It's used to give information to `npm` that allows it to identify the project, as well as handle the project's dependencies. It can also contain other metadata such as a project description, the version of the project in a particular distribution, license information, even configuration data--all of which can be vital to both `npm` and to the end users of the package. The `package.json` file is normally located at the root directory of a Node.js project.

Node.js itself is only aware of two fields in the `package.json`:

    {
      "name" : "barebones",
      "version" : "0.0.0",
    }

The `name` field should explain itself: this is the name of your project. The `version` field is used by NPM to make sure the right version of the package is being installed. Generally, it takes the form of `major.minor.patch` where `major`, `minor`, and `patch` are integers which increase after each new release. 

For a more complete package.json, we can study the `underscore` module:

    {
      "name" : "underscore",
      "description" : "JavaScript's functional programming helper library.",
      "homepage" : "http://documentcloud.github.com/underscore/",
      "keywords" : ["util", "functional", "server", "client", "browser"],
      "author" : "Jeremy Ashkenas <jeremy@documentcloud.org>",
      "contributors" : [],
      "dependencies" : [],
      "repository" : {"type": "git", "url": "git://github.com/documentcloud/underscore.git"},
      "main" : "underscore.js",
      "version" : "1.1.6"
    }

As you can see, there are fields for the `description` and `keywords` of your projects. This helps people who find your project understand what it is in just a few words. The `author`, `contributors`, `homepage` and `repository` fields can all be used to credit the people who contributed to the project, show how to contact the author/maintainer, and give links for additional references. 

The file listed in the `main` field is the main entry point for the libary; when someone runs `require(<library name>)`, `require()` resolves this call to `require(<package.json:main>)`. 

The `dependencies` field is used to list all the dependencies of your project that are available on `npm`. When someone installs your project through `npm`, all the dependencies listed will be installed as well.  Additionally, if someone runs `npm install` in the root directory of your project, it will install all the dependencies to `./node_modules`.

It is also possible to add a `devDependencies` field to your `package.json`. These are dependencies not required for normal operation, but required or recommended if you want to patch or modify the project.  If you built your unit tests using a testing framework, for example, it would be appropriate to put the testing framework you used in your `devDependencies` field.  To install a project's `devDependencies`, simply pass the `--dev` option when you use `npm install`.

For even more options, you can look through the [online docs](https://github.com/isaacs/npm/blob/master/doc/json.md), or run `npm help json`.

<a id="javascript-conventions"></a>

## Javascript Conventions




<a id="how-to-create-default-parameters-for-functions"></a>


<span class="cite">By Nico Reed (Aug 26 2011)</span>

### Creating Default Parameters for Funtions

As you know, functions can take a set number of parameters, and require that all of them be present before it can be executed successfully. However, you might sometimes run into situations where you want to provide a default value for a parameter or take a variable number of parameters. Unfortunately, Javascript does not have a built-in way to do that. However, people have developed idioms to compensate.

The first idiom is giving a default value for the last parameter. This is done by checking if the last parameter is `undefined` and setting it to a default value if it is. Sometimes people use the idiom: `optionalParameter = optionalParameter || defaultValue`. This can have some undesirable behavior when they pass values that are equal to false such as `false`, `0`, and `""`. A better way to do this is by explicitly checking that the optional parameter is `undefined`. 

Save the following code in a test file, and notice the differing behavior:

    example = function (optionalArg) {
      optionalArg = optionalArg || "The default is: no parameter was passed";
      console.log(optionalArg);
    }

    betterExample = function (optionalArg) {
    if (typeof optionalArg === 'undefined') {
      optionalArg = "The default is: truly, no parameter was passed";
    }
    console.log(optionalArg);
	}

	console.log("Without parameters:");
	example();
	betterExample();

	console.log("\nWith paramater:");
	example("A parameter was passed!");
	betterExample("A parameter was passed!");

	console.log("\nEmpty String:");
	example("");
	betterExample("");

See the difference? 

If the optional value is in the middle of the argument list, it can cause some undesired effects, since all the parameters are shifted over. The optional parameter is not the `undefined` value in this case--the last parameter is the `undefined` one. You have to check if the last parameter is `undefined` and then manually fix all the other parameters before continuing in the code. This example shows you how to do that:

	example = function (param1, optParam, callback) {
    if (typeof callback === 'undefined') {
      // only two paramaters were passed, so the callback is actually in `optParam`
      callback = optParam;
      //give `optParam` a default value
      optParam = "and a default parameter";
    }
    callback(param1, optParam);
	}

	example("This is a necessary parameter", console.log);
	example("This is a necessary parameter", "and an optional parameter", console.log);

More complicated cases require more code and can obscure the meaning of what you are trying to do. It then becomes a good idea to use helper functions. For example, suppose we wanted to take a variable amount of parameters and pass them all to the callback. You could try to accomplish this by manipulating the `arguments` variable. However, it is just easier to use the [vargs](https://github.com/cloudhead/vargs) module. As you can see by this code, it makes the whole process a little simpler:

	var Args = require("vargs").Constructor;

	example = function () {
    var args = new Args(arguments);
    args.callback.apply({},args.all);
	}

	example("The first parameter", console.log);
	example("The first parameter", "and second parameter", console.log);
	example("The first parameter", "and second parameter", "and third parameter", console.log);
	example("The first parameter", "and second parameter", "and third parameter", "etc", console.log);

<a id="what-are-the-built-in-timer-functions"></a>

### Using Timer Functions Correctly
<span class="cite">By Nico Reed (Aug 26 2011)</span>


There are two built-in timer functions: `setTimeout()` and `setInterval()`. They can be used to call a function at a later time. For example:

    setTimeout(function() { console.log("setTimeout: It's been one second!"); }, 1000);
    setInterval(function() { console.log("setInterval: It's been another second!"); }, 1000);

The output of this code is:

    setTimeout: It's been one second!
    setInterval: It's been another second!
    setInterval: It's been another second!
    setInterval: It's been another second!

As you can see, the parameters for both are the same. The second parameter indicates how long to wait (in milliseconds) before calling the function passed into the first parameter. The difference between the two functions is that `setTimeout()` calls the callback only once while, `setInterval()` calls it over and over again.

Obviously, you want to be careful with `setInterval()`, since it can cause some undesirable effects.  If, for example, you want to make sure your server was up by pinging it every second, you might think to try something like this:

    setInterval(ping, 1000);

This can cause problems, however, if your server is slow and it takes, say, three seconds to respond to the first request. In the time it takes to get back the response, you would have sent off three more requests--not exactly desirable!  This isn't a problem when serving small static files, but if you're doing an expensive operation, like a database query or a complicated computation, this can have some undiserable results. 

A more common solution looks like this:

    var recursive = function () {
        console.log("It has been one second!");
        setTimeout(recursive,1000);
    }
    recursive();

This code makes a call to the `recursive()` function which, as it completes, makes a call to `setTimeout(recursive, 1000)` which makes it call `recursive()` again after one second. This has nearly the same effect as `setInterval()`, while being resilient to the unintended errors that can pile up.

You can clear the timers you set using `clearTimeout()` and `clearInterval()`. Their usages are very simple:

    function never_call() {
        console.log("You should never call this function");
    }

    var id1 = setTimeout(never_call,1000);
    var id2 = setInterval(never_call,1000);

    clearTimeout(id1);
    clearInterval(id2);

If you keep track of the return values of the timers, you can easily unhook the timers. 

The final trick for the timer objects is passing parameters to the callback. This is done by passing more parameters to `setTimeout()` and `setInterval()`, like this:

    setTimeout(console.log, 1000, "This", "has", 4, "parameters");
    setInterval(console.log, 1000, "This only has one");


The output then becomes:

    This has 4 parameters
    This only has one
    This only has one
    This only has one
    This only has one
    This only has one
    ...

<a id="what-is-the-arguments-object"></a>

### The Arguments Object
<span class="cite">By Marco Rogers (Aug 26 2011)</span>


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

<a id="what-is-json"></a>

### About JSON
<span class="cite">By Marco Rogers (Aug 26 2011)</span>


Javascript Object Notation, or JSON, is a lightweight data format that
has become the de-facto standard for the web, toppling the long and unweildy curse of XML. JSON can be represented
as either a list of values, like an Array, or as a hash of properties and
values, like an Object:

    // a JSON array
    ["one", "two", "three"]

    // a JSON object
    { "one": 1, "two": 2, "three": 3 }

You can view the full specifications of JSON on [the official website](http://www.json.org/).

#### Encoding and Decoding JSON

Javascript provides two methods for encoding data structures to JSON and
encoding JSON back to javascript objects and arrays. They are both
available on the `JSON` object that is available in the global scope.

`JSON.stringify()` takes a Javascript object or array and returns a
serialized string in the JSON format. For example:

    var data = {
      name: "John Doe"
      , age: 32
      , title: "VP of JavaScript"
    }

    var jsonStr = JSON.stringify(data);

    console.log(jsonStr);
    // prints '{"name":"John Doe", "age":32, "title":"VP of JavaScript"}'

The full method declaration of `JSON.stringify()` is actually `JSON.stringify(obj [, replacer [, space]])`. You can pass in an optional function to replace elements in the JSON object, or define how much whitespace to present before an element. For example:

    onsole.log(JSON.stringify([1, 2, 3])); // returns [1, 2, 3]

    console.log(JSON.stringify([1, 2, 3], function replacer(key, value) {
      if (!Array.isArray(value)) {
        return value;
      }
      var len = value.length;
      var result = { length: len };
      
      for (var i = 0; i < len; ++i) {
        result[i] = value[i];
      }
      return result;
    }));

    // inserts two spaces
    console.log(JSON.stringify({ a: 1, b: 2}, null, 2));
    // insertes four spaces
    console.log(JSON.stringify({ a: 1, b: 2}, null, 4));
    //inserts a tab character
    console.log(JSON.stringify({ a: 1, b: 2}, null, '\t'));

`JSON.parse()` does the reverse, taking a JSON string and decoding it to a Javascript data
structure:

    var jsonStr = '{"name":"John Doe","age":32,"title":"VP of JavaScript"}';

    var data = JSON.parse(jsonStr);

    console.log(data.title);
    // prints 'VP of JavaScript'

#### Defining Valid JSON

There are a few rules to remember when dealing with data in the JSON
format:

* Empty objects and arrays are okay
* Strings can contain any unicode character, this includes object properties
* `null` is a valid JSON value on its own
* All object properties should always be double quoted
* Object property values must be one of the following: `String`, `Number`, `Boolean`, `Object`, `Array`, `null`
* Number values must be in decimal format, no octal or hex representations
* Trailing commas on arrays are not allowed

These are all examples of valid JSON.

    {"name":"John Doe","age":32,"title":"Vice President of JavaScript"}

    ["one", "two", "three"]

    // nesting valid values is okay
    {"names": ["John Doe", "Jane Doe"] }
     
    [ { "name": "John Doe"}, {"name": "Jane Doe"} ]

    {} // empty hash

    [] // empty list

    null

    { "key": "\uFDD0" } // unicode escape codes

These are all examples of bad JSON formatting.

    // name and age should be in double quotes
    { name: "John Doe", 'age': 32 } 

    // hex numbers are not allowed
    [32, 64, 128, 0xFFF] 

    // undefined is an invalid value
    { "name": "John Doe", age: undefined } 

    // functions and dates are not allowed
    { "name": "John Doe"
      , "birthday": new Date('Fri, 26 Aug 2011 07:13:10 GMT')
      , "getName": function() {
          return this.name;
      }
    }

Calling `JSON.parse` with an invalid JSON string will result in a
`SyntaxError` being thrown. If you are not sure of the validity of your
JSON data, you can anticipate errors by wrapping the call in a
try/catch block.

Notice that the only complex values allowed in JSON are objects and
arrays. Functions, dates and other types are excluded. This may not
seem to make sense at first. But remember that JSON is a data format,
not a format for transfering complex javascript objects along with
their functionality.

#### JSON in other languages

Although JSON was inspired by the simplicity of Javascript data
structures, it's use is not limited to the Javascript language. Many
other languages have methods of transfering native hashes and lists
into stringified JSON objects. Here's a quick example in Ruby:

    require 'json'

    data = { :one => 1 }
    puts data.to_json

    # prints "{ \"one\": 1 }"

<a id="what-are-truthy-and-falsy-values"></a>

### Defining "Truthy" and "Falsy" values
<span class="cite">By Marco Rogers (Aug 26 2011)</span>


Javascript is weakly typed language. That means different types can be
used in operations and the language will try to convert the types
until the operation makes sense. For example, look at the following code:

    console.log("1" > 0); // true, "1" converted to number
    console.log(1 + "1"); // 11, 1 converted to string

In the first example, the `>` operator expected two binary values, so Javascript converts the string numeral `"1"` into a `Number`. Similarly, in the second example, the numeral 1 is converted into a string, so that the concatenation with the `+` operator makes sense.

Type conversion also applys when values are used in unary boolean
operations, most notably `if` statements. If a value converts to the
boolean `true`, then it is said to be "truthy." If it converts to `false`,
it is "falsy." For example:

    var myval = "value";
    if(myval) 
    {
        console.log("This value is truthy");
    }
    
    myval = 0;
    if(!myval) 
    {
        console.log("This value is falsy");
    }

Since most values in Javascript are truthy, like objects, arrays, most
numbers and strings, it's easier to just list all of the falsy
values. These are:

    false // obviously
    0     // The only falsy number
    ""    // the empty string
    null
    undefined
    NaN
    
Note that all objects and arrays are truthy, even empty ones.

Truthiness and falsiness also come into play with logical
operators. When using the logical AND/OR operators, the values are converted
based on truthiness or falsiness, and normal short circuit rules applu. The logical expression resolves to the last truthy value in the sequence. Here's an extended example demonstrating this:

    var first = "truthy"
      , second = "also truthy";

    var myvalue = first && second;
    console.log(myvalue); // "also truthy"

    first = null;
    second = "truthy";

    myvalue = first || second;
    console.log(myvalue); // "truthy"

    myvalue2 = second || first;
    console.log(myvalue2); // "truthy"

    var truthy = "truthy"
      , falsy = 0;

    myvalue = truthy ? true : false;
    myvalue = falsy ? true : false;

<a id="using-ECMA5-in-nodejs"></a>

### Using ECMA5 in Node.js
<span class="cite">By Community (Aug 26 2011)</span>


When developing for a browser, there are many built-in Javascript functions that we can't use because certain browsers don't implement them.  As a result, most developers never use them.  In Node.js, however, we can assume that everyone has the same Javascript implementation (since it's always running on [the V8 engine](http://code.google.com/p/v8/)). As such, we can use these wonderful functions and not implement them over and over in our own libraries.

The following is a list of some interesting API functions that aren't considered safe to use in a web setting, but are built into Node's V8 engine. Note that V8 implements all of the ECMA 3rd Edition, and some parts of the new [ECMA 5th Edition](http://www.ecma-international.org/publications/standards/Ecma-262.htm). You can see a list of all the supported features from [this gist](https://github.com/joyent/node/wiki/ECMA-5-Mozilla-Features-Implemented-in-V8).

#### Syntax Extensions

 *  You can use a new getter and setter syntax, similar to many other languages.

Here's an example:

    var speak = {
    _name: 'Stranger',
        get name() { // getter
            return this._name + '!';
        },
        set name(n) { // setter
            this._name = n.trim();
        }
    };

    console.log("Hello, " + speak.name);
    speak.name = ' John ';
    console.log("Hello, " + speak.name);

#### Array

 * `Array.isArray(array)`: Returns `true` if the passed argument is an array.

#### Array.prototype

 * `indexOf(value)`: Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
 * `lastIndexOf(value)`: Returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found.
 - `filter(callback)`: Creates a new array with all of the elements of this array for which the provided filtering function returns `true`.

 For example:

    var myArray = ([1, 2, 3, 4]).filter(function(x) {
                        return x > 2;
                    });
    // myArray is now [3, 4]

 * `forEach(callback)`: Calls a function for each element in the array.
 * `every(callback)`: Returns `true` if every element in this array satisfies the provided testing function.

 For example:

    ([-1, 0, 1, 2, 3]).every(function(x) {
      return x > 0;
    });
    // false, since -1 and 0 are not greater than 0.

 * `some(callback)`: Returns `true` if at least one element in this array satisfies the provided testing function.

 * `map(callback)`: Creates a new array with the results of calling a provided function on every element in this array.

 For example:

    var myArray = ([1, 2, 3]).map(function(x) {
        return x * 2;
    });
    // myArray is now [2, 4, 6]

 * `reduce(callback[, initialValue])`: Apply a function simultaneously against two values of the array (from left-to-right), reducing it to a single value.

 For example:

    var myString = (['a', 'b', 'c', 'd']).reduce(function(x, y) {
      return x + y;
    });
    // myString is now 'abcd'

If the `initialValue` parameter is provided, it is the very first parameter called by the function. For example:

    var myString = (['a', 'b', 'c', 'd']).reduce(function(x, y) {
      return x + y;
    }, '*');
    // myString is now '*abcd'

 * `reduceRight(callback[, initialValue])`: Apply a function simultaneously against two values of the array (from right-to-left), reducing it to a single value.

#### Date

 * `Date.now()`: Returns the numeric value corresponding to the current date. For example: `1320952608012`.

#### Date.prototype

 * `Date.toISOString()`: Returns the value of the current date in the [ISO standard](http://en.wikipedia.org/wiki/ISO_8601#Times). For example: `2011-11-10T19:16:48.011Z`.

#### Object

 * `Object.create(proto, props)`: Creates a new object whose prototype is the passed in parent object and whose properties are those specified by `props`.

 For example:
    var obj = Object.create(x: 10, y: 20);
    // obj.x = 10; obj.y = 20

 * `Object.keys(obj)`: Returns a list of the ownProperties of an object that are enumerable.

 For example: 

     function o() {
      this.a = 1;
    }
    console.log(Object.keys(new o())); // [ 'a' ]
    function p() {
      this.b = 2;
    }

    var obj = Object.create({a: 10, b: 20}, {
      x: {
        value: 30,
        enumerable: true
      },
      y: {
        value: 40,
        enumerable: false
      }
    });
    console.log(Object.keys(obj)); // [ 'x' ]

 * `Object.getOwnPropertyNames(obj)`: Returns a list of the ownProperties of an object including ones that are not enumerable.

 * `Object.getPrototypeOf(obj)`: Returns the prototype of an object.

 For example: 

     var obj = Object.create({a: 10, b: 20}, {
      x: {
        value: 30,
        enumerable: true
      },
      y: {
        value: 40,
        enumerable: false
      }
    });
    console.log(Object.getPrototypeOf(obj)); // { a: 10, b: 20 }

* `Object.getOwnPropertyDescriptor(obj, property)`: Returns an object with keys describing the description of a property (value, writable, enumerable, configurable).

For example:

    var obj = Object.create({a: 10, b: 20}, {
      x: {
        value: 30,
        enumerable: true
      },
      y: {
        value: 40,
        enumerable: false
      }
    });
    console.log(Object.getOwnPropertyDescriptor(obj, 'x'));
    // { value: 30,
    //   writable: false,
    //   enumerable: true,
    //   configurable: false }

 * `Object.defineProperty(obj, prop, desc)`: Defines a property on an object with the given descriptor.

 For example:

    var obj = {};
    Object.defineProperty(obj, 'num', {
      value: 10,
      writable: false,
      enumerable: false,
      configurable: false
    });
    log(obj.num); // 10
    for (var i in obj) {
      log(i); // not display
    }
    obj.num = 20;
    log(obj.num); // still 10

 * `Object.defineProperties(obj, props)`: Adds own properties, and/or updates the attributes of existing own properties of an object.

 For example:
 
    var obj = {};
    Object.defineProperties(obj, {
      num: {
        value: 4,
        writable: false,
        enumerable: false,
        configurable: false
      },
      root: {
        get: function() {
          return Math.pow(this.num, 0.5);
        }
      }
    });
    log(obj.num); // 4
    log(obj.root); // 2
 
 
 * `Object.preventExtensions(obj)`: Prevents any new properties from being added to the given `obj` object.
 * `Object.isExtensible(obj)`: Returns `true` if properties can still be added, `false` otherwise (in other words, `false` if Object.preventExtensions() was called).
 * `Object.seal(obj)`: Prevents code from adding or deleting properties, or changing the descriptors of any property on an object. However, property values can still change.
 * `Object.isSealed(obj)`: Returns `true` if `Object.seal` was called on this object.
 * `Object.freeze(obj)`: This is the same as `Object.seal()`, except property values can't be changed.
 * `Object.isFrozen(obj)`: Returns `true` if `Object.freeze()` was called on this object.

#### Object.prototype

 * `__defineGetter__(name, callback)`: Associates a function with a property that, when accessed, executes that function and returns its return value. This functions is a Mozilla extension and is not in ECMAScript 5.
 * `__lookupGetter__(name)`: Returns the function associated with the specified property by the __defineGetter__ method. This functions is a Mozilla extension and is not in ECMAScript 5.
 * `__defineSetter__(name, callback)`: Associates a function with a property that, when set, executes that function which modifies the property. This functions is a Mozilla extension and is not in ECMAScript 5.
 * `__lookupSetter__(name)`: Returns the function associated with the specified property by the __defineSetter__ method. This functions is a Mozilla extension and is not in ECMAScript 5.
 * `isPrototypeOf(obj)` - (Available in ECMAScript 3 and 5) Returns true if `this` is a prototype of the passed in object. For example:

    var proto = {a: 10, b: 20};
    var obj = Object.create(proto);
    console.log(proto.isPrototypeOf(obj)); // true

#### Function.prototype

 * `bind(thisArg[, arg1[, arg2, arg3...]])` - Sets the value of `this` inside the function to always be the value of `thisArg` when the function is called. Optionally, function arguments can also be specified (arg1, arg2, e.t.c.) that will automatically be prepended to the argument list whenever this function is called. For example:

    var f = function() {return this.a + this.b };
    console.log(f()); // NaN
    var g = f.bind({ a: 10, b: 20 });
    console.log(g()); // 30

    var f = function(c) {
        return this.a + this.b + c;
    };
    log(f()); // NaN
    var g = f.bind({ a: 10, b: 20 }, 30);
    console.log(g()); // 60

    var f = function(c, d) {
        return this.a + this.b + c + d;
    };
    log(f()); // NaN
    var g = f.bind({ a: 10, b: 20 }, 30);
    console.log(g(40)); // 100

#### String.prototype

 * `trim()`: Trims all whitespace from both ends of the string
 * `trimRight()`: Trims all whitespace from the right side of the string
 * `trimLeft()`: Trims all whitespace from the left side of the string

#### Default Property Descriptors

 * `value`: undefined
 * `get`: undefined
 * `set`: undefined
 * `writable`: `false`
 * `enumerable`: `false`
 * `configurable`: `false`

#### Features Not Implemented

 * `Object.__noSuchMethod__`: (This is a Mozilla extension, not ECMAScript 5)
 * `"use strict";`:  This syntax extension is a [v8 issue](http://code.google.com/p/v8/issues/detail?id=919)

<a id="security"></a>

## Security



Sometimes, you might want to let users read or write files on your server. For example, maybe you want to write a forum software without using an actual database. The problem is that you do not want your users to be able to modify or to read arbitrary files on your server, and there are sometimes ways to get around restrictions that should prevent it. Read on to see how you can secure your code against evil attackers trying to mess with your files.

<a id="introduction"></a>

### A Brief Primer
<span class="cite">By Jann Horn (Sept 10 2011)</span>


#### Poison Null Bytes

Poison null bytes are a way to trick your code into seeing another filename than the one that will actually be opened. In many cases, this can be used to circumvent directory traversal protections, to trick servers into delivering files with wrong file types and to circumvent restrictions on the file names that may be used. A more detailed description of this attack [can be found on the Node.js mailing list](http://groups.google.com/group/nodejs/browse_thread/thread/51f66075e249d767/85f647474b564fde).

Always use code like this when accessing files with user-supplied names:

    if (filename.indexOf('\0') !== -1) {
      return respond('That was evil!');
    }

#### Whitelisting

You won't always be able to use whitelisting, but if you are, do it--it's very easy to implement and hard to get wrong. For example, if you know that all filenames are lowercase alphanumeric strings, you can use this regular expression to block anything else:

    if (!/^[a-z0-9]+$/.test(filename)) {
      return respond('illegal character');
    }

However, note that whitelisting alone isn't sufficient anymore as soon as you allow dots and slashes. People can still enter filepaths like `../../etc/passwd` in order to get files from outside the allowed folder.

#### Preventing Directory Traversal

Directory traversal means that an attacker is trying to access files outside of the folder you want to allow him to access. You can prevent this by using Node's built-in `path` module. **Do not reimplement the methods in the `path` module yourself**. For example, when someone runs your code on a Windows server, not handling backslashes like slashes will allow attackers to do travese directories.

This example assumes that you already checked the `userSuppliedFilename` variable as described in the "Poison Null Bytes" section above.

    var rootDirectory = '/var/www/';

(Make sure that you have a slash at the end of the allowed folders name--you don't want people to be able to access `/var/www-secret/`, do you?)

    var path = require('path');
    var filename = path.join(rootDirectory, userSuppliedFilename);

Now `filename` contains an absolute path and doesn't contain `..` sequences anymore--`path.join` takes care of that. However, it might be something like `/etc/passwd` now, so you have to check whether it starts with the `rootDirectory`:

    if (filename.indexOf(rootDirectory) !== 0) {
      return respond('trying to sneak out of the web root?');
    }

Now the `filename` variable should contain the name of a file or directory that's inside the allowed directory (unless it doesn't exist).

<a id="errors"></a>

## Handling Errors




<a id="what-is-the-error-object"></a>

### The Error Object
<span class="cite">By Nico Reed (Aug 26 2011)</span>


The error object is a built-in object that provides a standard set of useful information when an error occurs, such as a stack trace and the error message. For example:

Code:

     var error = new Error("The error message");
     console.log(error);
     console.log(error.stack);

Result:

     { stack: [Getter/Setter],
       arguments: undefined,
       type: undefined,
       message: 'The error message' }
     Error: The error message
         at Object.<anonymous> (/home/nico/example.js:1:75)
         at Module._compile (module.js:407:26)
         at Object..js (module.js:413:10)
         at Module.load (module.js:339:31)
         at Function._load (module.js:298:12)
         at Array.0 (module.js:426:10)
         at EventEmitter._tickCallback (node.js:126:26)

`error.stack` shows you where an error came from, as well as a list of the function calls that preceded it. For your convenience, `error.stack` always prints `error.message` as the first line of its output, making `error.stack` a convenient single property to log during debugging.

If you want to add more information to the Error object, you can always add properities, just as with any other Javascript object: 

    var error = new Error("The error message");
    error.http_code = 404;
    console.log(error);

For more details how to use the Error object, check out the [article on error conventions](api.html#what-are-the-error-conventions).

<a id="what-is-try-catch"></a>

### Understanding try/catch()
<span class="cite">By Nico Reed (Aug 26 2011)</span>


Javascript's `try-catch-finally` statement works very similarly to the `try-catch-finally` encountered in C++ and Java.  It's best to describe this concept with an example:
Example:

    console.log("entering try-catch statement");

    try {
      console.log("entering try block");
      throw "thrown message";
      console.log("this message is never seen");
    }
    catch (e) {
      console.log("entering catch block");
      console.log(e);
      console.log("leaving catch block");
    }
    finally {
      console.log("entering and leaving the finally block");
    }

    console.log("leaving try-catch statement");

Results:

    entering try-catch statement
    entering try block
    entering catch block
    thrown message
    leaving catch block
    entering and leaving the finally block
    leaving try-catch statement

First, the `try` block is executed. If an error is encountered, it immediately goes to the `catch` block, where the error is hangled.

If the code doesn't throw an exception, then the whole `try` block completes its execution. executed. After it's done, the `finally` block is executed. It's always executed, with or without an exception occuring.

Note that you must always have at least one `catch` or `finally` block, both both aren't required. In other words, these are legitimate:

    try {
        
    } catch (e)
    {
        
    }


    try {
        
    } finally {
        
    }

#### Is it Node.js convention to not use try-catch?

In the core Node.js libraries, the only place that one really **needs** to use a try-catch is around `JSON.parse()`. All of the other methods use either the standard `Error` object through the first parameter of the callback or emit an `error` event. Because of this, it is generally considered [standard convention](api.html#what-are-the-error-conventions) to return errors through the callback rather than to use the `throw` statement. 

<a id="what-are-the-error-conventions"></a>

### Understanding the Error Conventions
<span class="cite">By Nico Reed (Aug 26 2011)</span>


In Node.js, it is considered standard practice to handle errors in asynchronous functions by returning them as the first argument to the current function's callback.  If there is an error, the first parameter is passed an `Error` object with all the details. Otherwise, the first parameter is `null`. 

It's simpler than it sounds; here's a demonstration.

    var isTrue = function(value, callback) {
      if (value === true) {
        callback(null, "Value was true.");
      }
      else {
        callback(new Error("Value is not true!"));
      }
    }

    var callback = function (error, retval) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(retval);
    }

    // Note: when calling the same asynchronous function twice like this, 
    // you are in a race condition. You have no way of knowing for certain 
    // which callback will be called first when calling the functions in this manner.

    isTrue(false, callback); // outputs 'Value is not true!'
    isTrue(true,  callback); // output 'Value was true'

As you can see from the example, the callback is called with `null` as its first argument if there is no error. However, if there is an error, you create an `Error` object, which then becomes the callback's only parameter. 

The `callback` function shows the reason for this: it allows a user to easily know whether or not an error occurred.  If `null` was not the first argument passed on success, the user would need to check the object being returned and determine themselves whether or not the object constituted an error--a much more complex and less user-friendly approach.

To wrap it all up: when using callbacks, if an error comes up, then pass it as the first argument.  Otherwise, pass `null` first, and then your return arguments.  On the receiving end, inside the callback function, check if the first parameter is non-null;  if it is, handle it as an error.

<a id="child-processes"></a>

## Child Processes




<a id="how-to-spawn-a-child-process"></a>

### Spawning Child Processes
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


If you find yourself wishing you could have your Node.js process start another program for you, then look no further than the `child_process` module.

The simplest way is the "fire, forget, and buffer" method using `child_process.exec()`.  It runs your process, buffers its output (up to a default maximum of 200kb), and lets you access it from a callback when it is finished. Let's take a look at an example:

     var childProcess = require('child_process'),
         ls;

     ls = childProcess.exec('ls -l', function (error, stdout, stderr) {
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
     });

     ls.on('exit', function (code) {
       console.log('Child process exited with exit code '+code);
     });

(`error.stack` is a stack trace to the point that the [Error object](api.html#what-is-the-error-object) was created.)

It should be noted that the `stderr` of a given process is not exclusively reserved for error messages. Many programs use it as a channel for secondary data instead.  As such, when trying to work with a program that you have not previously spawned as a child process, it can be helpful to start out dumping both `stdout` and `stderr`, as shown above, to avoid any surprises.

While `child_process.exec` buffers the output of the child process for you, it also returns a `ChildProcess` object, Node's way of wrapping a still-running process.  In the example above, since we are using `ls`, a program that will exit immediately regardless, the only part of the `ChildProcess` object worth worrying about is the `on exit` handler.  It is not necessary here--the process will still exit and the error code will still be shown on errors.

<a id="command-line"></a>

## Parsing Command Line Input




<a id="how-to-parse-command-line-arguments"></a>

### Parsing Command Line Arguments
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


Passing in arguments via the command line is an extremely basic programming task, and a necessity for anyone trying to write a simple Command-Line Interface (CLI).  In Node.js, as in C and many related environments, all command-line arguments received by the shell are given to the process in an array called `argv` (short for argument values).  

Node.js exposes this array for every running process in the form of `process.argv`. Let's take a look at an example. Create a file called `argv.js` and add this line:

     console.log(process.argv);

Now save it, and type the following in your shell:

     $ node argv.js one two three four five
     [ 'node',
       '/home/avian/argvdemo/argv.js',
       'one',
       'two',
       'three',
       'four',
       'five' ]

There you have it--an array containing any arguments you passed in.  Notice the first two elements: `node`, and the path to your script.  These will always be present; even if your program takes no arguments of its own, your script's interpreter and path are still considered arguments to the shell you're using.  

Where everyday CLI arguments are concerned, you'll want to skip the first two.  Now, try typing this in `argv.js`:

     var myArgs = process.argv.slice(2);
     console.log('myArgs: ', myArgs);

This yields:

     $ node argv.js one two three four
     myArgs:  [ 'one', 'two', 'three', 'four' ]

Obviously, `slice()` eliminates the first two elements in the array. Now, let's actually do something with the args:

     var myArgs = process.argv.slice(2);
     console.log('myArgs: ', myArgs);

     switch (myArgs[0]) {
       case 'insult':
         console.log(myArgs[1], 'smells quite badly.');
         break;
       case 'compliment':
         console.log(myArgs[1], 'is really cool.');
         break;
       default:
         console.log('Sorry, that is not something I know how to do.');
         break;
     }

Referring to your command-line arguments by array index isn't very clean, and can quickly turn into a nightmare when you start working with flags and the like. Imagine you made a server, and it needed to deal with a lot of arguments, like `myapp -h host -p port -r -v -b --quiet -x -o outfile`. Some flags need to know about what comes next, some don't, and most CLIs let users specify arguments in any order they want. Does that sound like a fun string to parse?

Fortunately, there's a third party module that makes all of this trivial. It's called [Optimist](https://github.com/substack/node-optimist), written by James Halliday (aka SubStack). It's available via `npm`.  To install the module, use this command from your app's base path:

     npm install optimist
     
Once you have it, give it a try--it can really be a life-saver.:

     var myArgs = require('optimist').argv,
         help = 'Ceci n\'est pas une mandoc';
     
     if ((myArgs.h)||(myArgs.help)) {
       console.log(help);
       process.exit(0);
     }
     
     switch (myArgs._[0]) {
       case 'insult':
         console.log(myArgs.n || myArgs.name, 'smells quite badly.');
         break;
       case 'compliment':
         console.log(myArgs.n || myArgs.name, 'is really cool.');
         break;
       default:
         console.log(help);
         break;
     }
     
     console.log('myArgs: ', myArgs);
     
The last line was included to let you see how Optimist handles your arguments.  Here's a quick reference:

- `argv.$0` contains the first two elements of `process.argv` joined together - "node ./myapp.js"
- `argv._` is an array containing each element not attached to a flag
- Individual flags become properties of `argv`, such as with `myArgs.h` and `myArgs.help`.  Note that non-single-letter flags must be passed in as `--flag`

For more information on Optimist and the many, many other things it can do for your command-line arguments, please visit [its GitHub page](https://github.com/substack/node-optimist).

<a id="how-to-get-colors-on-the-command-line"></a>

### Colors on the Command Line
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


When working on the command line, it can be both fun and extremely useful to colorize one's output. To colorize console output, you need to use ANSI escape codes. The `colors` module, available on `npm`, provides an extremely easy to use wrapper that makes adding colors a breeze.

First, install it:

     npm install colors

Now open up a little test script for yourself, and try something like this:

     var colors = require('colors'),
         stringOne = 'This is a plain string.',
         stringTwo = 'This string is red.'.red,
         stringThree = 'This string is blue.'.blue;
     
     console.log(stringOne.green);
     console.log(stringOne.yellow);

     console.log(stringTwo);
     console.log(stringThree);

     console.log(stringTwo.magenta);
     console.log(stringThree.grey.bold);

There are several things to take note of here . First, the string object has been prototyped, so any color may be added simply by adding the property to the string!  It works both on string literals and on variables, as shown at the top of the example above.

Notice, also, from the second pair of `console.log` statements, that, once set, a color value persists as part of the string.  This is because under the hood, the proper ANSI color tags have been prepended and appended as necessary; anywhere the string gets passed where ANSI color codes are also supported, the color will remain.

The last pair of `console.log` statements are probably the most important.  Because of the way `colors.js` and ANSI color codes work, if more than one color property is set on a string, only the first color property to be set on the string takes effect. This is because the colors function as "state shifts"'" rather than as tags.

Let's look at a more explicit example.  If you set the following properties with `colors.js`:

     myString.red.blue.green

You can think of your terminal saying to itself, "Make this green. No, make this blue.  No, make this red.  No more color codes now?  Red it is, then."  This can be extremely useful if you're using a library that sets its own default colors that you don't like; if you set a color code yourself on the string you pass in to the library, it will supersede the other author's color code(s).

Regarding the final line of the example script:  while a color code was set previously, a 'bold' code was not, so the example was made bold, but not given a different color.

Keep in mind that the colors can look quite different in different terminals. Sometimes, `bold` is bold, sometimes it's just a different color. Try it out and see for yourself!

For reference, here's the full list of available `colors.js` properties.

- bold
- italic
- underline
- inverse
- yellow
- cyan
- white
- magenta
- green
- red
- grey
- blue
- rainbow

<a id="how-to-prompt-for-command-line-input"></a>

### Prompting for Command Line Input
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


Say you've got a little CLI tool, but you want to be able to prompt a user for additional data after the script has started, rather than passing it in as a command line argument or putting it in a file.  To do this, you'll need to listen to STDIN ("standard input"), which Node.js exposes for you as `process.stdin`, a readable stream.

Streams are Node's way of dealing with evented I/O. They're a big topic, and you can read more about them [here](what-are-streams).  For now, we're only going to deal with the stream methods relevant to working with `process.stdin`, to keep the examples easy.

The first two Readable Stream methods you'll need to know about here are `pause()` and `resume()`.  Not every program needs to care whether or not you're pressing keys at a given moment, so `process.stdin` is paused by default. 

Here's a simple example.  Try to run the following in a new file:

      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('data', function (text) {
        console.log(text);
        if (text === 'quit') {
          done();
        }
      });
      
      function done() {
        console.log('Now that process.stdin is paused, there is nothing more to do.');
        process.exit();
      }
      
If all of this sounds complicated, or if you want a higher-level interface to this sort of thing, don't worry--as usual, the Node.js community has come to the rescue.  One particularly friendly module to use for this is Prompt, maintained by Nodejitsu.  It's available on `npm`:

     npm install prompt

Prompt is built to be easy. If your eyes started to glaze over as soon as you saw `Readable Stream`, then this is the section for you.  Compare the following to the example above:

      var prompt = require('prompt');
      
      prompt.start();
      
      prompt.get(['username', 'email'], function (err, result) {
        if (err) { return onErr(err); }
        console.log('Command-line input received:');
        console.log('  Username: ' + result.username);
        console.log('  Email: ' + result.email);
      });
      
      function onErr(err) {
        console.log(err);
        return 1;
      }

This short script also demonstrates proper error handling in Node.js. Errors are a callback's first argument, and `return` is used with the error handler so that the rest of the function doesn't execute when errors happen.

Prompt also makes it trivial to handle a certain set of recurring properties that one might want to attach:

      var prompt = require('prompt');

      var properties = [
        {
          name: 'username', 
          validator: /^[a-zA-Z\s\-]+$/,
          warning: 'Username must be only letters, spaces, or dashes'
        },
        {
          name: 'password',
          hidden: true
        }
      ];

      prompt.start();

      prompt.get(properties, function (err, result) {
        if (err) { return onErr(err); }
        console.log('Command-line input received:');
        console.log('  Username: ' + result.username);
        console.log('  Password: ' + result.password);
      });

      function onErr(err) {
        console.log(err);
        return 1;
      }
      
For more information on Prompt, please see [the project's GitHub page](http://github.com/nodejitsu/node-prompt).

<a id="intermediate"></a>

## Intermediate Topics




<a id="how-to-log"></a>

### Logging
<span class="cite">By Joshua Holbrook (Aug 26 2011)</span>


Many processes, including most servers, write logs in one form or another. Some reasons for logging include debugging, keeping track of users and resource usage, and reporting application state.

#### Simple Logging

The simplest form of logging just involves using `console.log` or one of the other standard output methods. In this approach, any information is printed to `stdout` where it can either be read by the developer as it occurs, or, for example, redirected to a log file: 

    console.log('Web Server started, waiting for connections...');

Because it's so simple, `console.log()` is by far the most common way of logging data in Node.js.

#### Custom Logging

Logging only with functions such as `console.log()` is not ideal for every use case, however.  Many applications have some sort of debugging mode, for example, that shows the user much more output than normal execution.  To do something like this, a better idea is to write your own simple logger, and use it instead of `console.log()`. 

Here is an example of a basic custom logging module with configurable debugging levels:

      var logger = exports;

      logger.log = function(level, message) {
        var levels = ['info', 'warn', 'error'];
        if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
          if (typeof message !== 'string') {
            message = level + ": " + JSON.stringify(message);
          };

          console.log(message);
        }
      }

Save this code in a file called `logger.js`. You can then import this module, and use it like this:

      var logger = require('./logger');
      logger.debugLevel = 'warn';
      logger.log('info', 'Everything started properly.');
      logger.log('warn', 'Running out of memory...');
      logger.log('error', { error: 'flagrant'});
    
Because `logger.debugLevel` was set to `warn`, the warning message and the error would both be displayed, but the `info` message would not be.

The advantage here is that the behavior of our logging mechanisms can now be modified and controlled from a central part of our code. In this case, logging levels were added, and messages are converted to JSON if they aren't already in string form. There is a lot more that could be done here - saving logs to a file, pushing them to a database, setting custom colors and formatting the output--but by the time you want that much functionality from your custom logging function, it might be time to use an already-existing library.

#### Extended Logging Functionality

[Winston](https://github.com/indexzero/winston) is a multi-transport and asynchronous logging library for Node.js.  It is conceptually similar to our custom logger, but comes with a wide variety of useful features and functionality baked in. In addition, `winston` is battle-hardened by internal use at [Nodejitsu](http://nodejitsu.com/).

Here's an example of setting up a `winston` logger.  This example includes most of the transports one could ever possibly want--most use cases will only warrant a few of these:

      var winston = require('winston');

      require('winston-riak').Riak;
      require('winston-mongo').Mongo;
      var logger = new (winston.Logger)({
        transports: [
          new winston.transports.Console()
          new winston.transports.File({ filename: 'path/to/all-logs.log' })
          new winston.transports.Couchdb({ 'host': 'localhost', 'db': 'logs' })
          new winston.transports.Riak({ bucket: 'logs' })
          new winston.transports.MongoDB({ db: 'db', level: 'info'})
        ]
        exceptionHandlers: [
          new winston.transports.File({ filename: 'path/to/exceptions.log' })
        ]
      });

Here, we have instantiated a new `winston` logger, and provided a number of logging transports.  Winston has built-in support for configurable logging levels, and provides alias methods for each configured logging level.  For example, `winston.warn(x)` is an alias for `winston.log('warn', x)`.  Thus, the following:

      logger.warn('Hull Breach Detected on Deck 7!'); 

Would output to the screen:

      warn: Hull Breach Detected on Deck 7!

Because of the file transport we set up, winston also logged the warning to 'somefile.log'.  After the `logger.warn` call we just used, the log file, `somefile.log`, would contain the following output:

      $ cat somefile.log 
      {'level':'warn','message':'Hull Breach Detected on Deck 7!'}

Note that winston's file logger formats the logs differently for file logging (JSON in this case) than it does for the console transport.

Winston also supports logging to Riak, CouchDB, MongoDB and even [Loggly](http://loggly.com).  The `logger.warn()` call we used before also put the same message into each database, according to the options we gave to each transport.

For further information, please see the [thorough documentation for Winston.](https://github.com/indexzero/winston).


<a id="advanced"></a>

## Advanced Topics




<a id="how-to-use-buffers"></a>

### Understanding Buffers
<span class="cite">By Joshua Holbrook (Aug 26 2011)</span>


Pure Javascript, while great with unicode-encoded strings, does not handle straight binary data very well. This is fine on the browser, where most data is in the form of strings. However, Node.js servers have to also deal with TCP streams and reading and writing to the filesystem, both of which make it necessary to deal with purely binary streams of data.

One way to handle this problem is to just use strings _anyway_, which is exactly what Node.js did at first. However, this approach is extremely problematic to work with: it's slow, makes you work with an API designed for strings and not binary data, and has a tendency to break in strange and mysterious ways.

Don't use binary strings; use buffers instead!

#### Using Buffers

Buffers are instances of the `Buffer` class in Node.js, which is designed to handle raw binary data. Each buffer corresponds to some raw memory allocated outside the V8 engine. Buffers act somewhat like arrays of integers, but aren't resizable and have a whole bunch of methods specifically for binary data. In addition, the "integers" in a buffer each represent a byte, and so are limited to values from 0 to 255 (2^8 - 1), inclusive.

Buffers are usually seen in the context of binary data coming from streams, such as `fs.createReadStream()`.

#### Creating Buffers:

There are a few ways to create new buffers. For example, this buffer is uninitialized and contains 8 bytes:

    var buffer = new Buffer(8);

This next example is a also an 8-bute bugger, loaded with some content:

    var buffer = new Buffer([ 8, 6, 7, 5, 3, 0, 9]);

Keep in mind that the contents of the array are integers representing bytes.

To encode a buffer string, you can pass an encoding value as an optional second parameter (in this case, UTF-8):

    var buffer = new Buffer("I'm a string!", "utf-8")

UTF-8 is by far the most common encoding used with Node.js, but `Buffer` also supports:

* `ascii`: This encoding is very fast, but is limited to the ASCII character set. Moreover, it will convert `null` characters into spaces, unlike the UTF-8 encoding.
* `ucs2`: A two-byte, little-endian encoding. This can encode a subset of unicode.
* `base64`: This is for Base64 string encoding.
* `binary`: This is the "binary string" format mentioned earlier, and is in the process of being deprecated. Avoid its use.

#### Writing to Buffers

After you create a buffer, you can begin writing strings to it: 

    var buffer = new Buffer(16);
    buffer.write("Hello", "utf-8")

In this case, `buffer.write()` returns 5. This means that we wrote to five bytes of the buffer. The fact that the string "Hello" is also five characters long is coincidental, since each character _just happened_ to be 8 bits each. This is useful if you want to add to the buffer later on:

    > buffer.write(" world!", 5, "utf-8") // returns 7

When `buffer.write` has three arguments, the second argument indicates an offset, or the index of the buffer to start writing at. Thus, the buffer now contains the phrase "Hello world!".

#### Reading from Buffers

The most common way to read buffers is to use the `toString()` method, since many buffers contain text:

    > buffer.toString('utf-8')
    'Hello world!\u0000�k\t'

The first argument indicates the encoding. In this case, due to the garbage characters are the end, it can be seen that not the entire buffer was used. Since we know how many bytes we've written to the buffer, we can simply add more arguments to retrieve the slice that's actually interesting:

    > buffer.toString("utf-8", 0, 12) // 5 + 7 = 12
    'Hello world!'

#### Setting Individual Octets

You can also set individual bits by using an array-like syntax:

    > buffer[12] = buffer[11];
    33
    > buffer[13] = "1".charCodeAt();
    49
    > buffer[14] = buffer[13];
    49
    > buffer[15] = 33
    33
    > buffer.toString("utf-8")
    'Hello world!!11!'

In this example, the remaining bytes are set manually, such that they represent UTF-8 encoded "!" (33) and "1" (49) characters.

#### Additional Buffer Methods

* `Buffer.isBuffer(object)`: This method checks to see if `object` is a buffer, similar to `Array.isArray()`.

* `Buffer.byteLength(string, encoding)`: With this function, you can check the number of bytes required to encode a string with a given encoding (which defaults to UTF-8). This length is not the same as string length, since many characters require more bytes to encode. For example:

    > var snowman = "☃";
    > snowman.length
    1
    > Buffer.byteLength(snowman)
    3

The unicode snowman is only one character, but takes 3 entire bytes to encode!

* `Buffer.length()`: This is the length of your buffer, and represents how much memory is allocated. It is not the same as the size of the buffer's contents, since a buffer may be half-filled. For example:

    > var buffer = new Buffer(16)
    > buffer.write(snowman)
    3
    > buffer.length
    16

In this example, the contents written to the buffer only consist of three groups (since they represent the single-character snowman), but the buffer's length is still 16, as it was initialized.

* `Buffer.copy(target, targetStart=0, sourceStart=0, sourceEnd=buffer.length): This function allows one to copy the contents of one buffer into another. The first argument is the target buffer on which to copy the contents of `buffer`, and the rest of the arguments allow for copying only a subsection of the source buffer to somewhere in the middle of the target buffer. For example:

    > var frosty = new Buffer(24)
    > var snowman = new Buffer("☃", "utf-8")
    > frosty.write("Happy birthday! ", "utf-8")
    16
    > snowman.copy(frosty, 16)
    3
    > frosty.toString("utf-8", 0, 19)
    'Happy birthday! ☃'

In this example, the `snowman` buffer, which contains a 3 byte long character, is copied to to the `frosty` buffer, which has the first 16 bytes written to it. Because the snowman character is 3 bytes long, the result takes up 19 bytes of the buffer.

* `Buffer.slice(start, end=buffer.length)`: This function is generally the same as that of `Array.prototype.slice()`, but with one very import difference: the slice is **not** a new buffer and merely references a subset of the memory space. In other words: **modifying the slice will also modify the original buffer**! For example:

    > var puddle = frosty.slice(16, 19)
    > puddle.toString()
    '☃'
    > puddle.write("___")
    3
    > frosty.toString("utf-8", 0, 19)
    'Happy birthday! ___'

Now Frosty has melted into a puddle of underscores. Bummer.

<a id="what-are-streams"></a>

### Understanding Streams
<span class="cite">By Nico Reed (Aug 26 2011)</span>


Streams are another basic construct in Node.js that encourages asynchronous coding. A 'stream' is Node's I/O abstraction. Streams allow you to process the data as it is generated or retrieved. Streams can be readable, writeable, or both.

Basically, treams use events to deal with data as it happens, rather than only with a callback at the end.  Readable streams emit the event `data` for each chunk of data that comes in, and an `end` event, which is emitted when there is no more data. Writeable streams can be written to with the `write()` function, and closed with the `end()` function.  All types of streams emit `error` events when errors arise.

As a quick example, we can write a simple version of `cp` (the Unix utility that copies files). We could do this by reading the whole file with standard filesystem calls and then writing it out to a file. Unfortunately, that requires that the whole file be read in before it can be written. In the case of a one or two gigabyte file, you could run into out of memory operations failry quickly. 

The biggest advantage that streams give you over their non-stream versions is that you can start to process the data before you have all the information. Writing out the file doesn't speed up, but if we were streaming over the internet or doing CPU processing on it then there could be measurable performance improvements.

Create a new file called `cp.js`, and copy-paste the following code:

    var fs = require('fs');
    console.log(process.argv[2], '->', process.argv[3]);

    var readStream = fs.createReadStream(process.argv[2]);
    var writeStream = fs.createWriteStream(process.argv[3]);

    readStream.on('data', function (chunk) {
      writeStream.write(chunk);
    });

    readStream.on('end', function () {
      writeStream.end();
    });

    //Some basic error handling
    readStream.on('error', function (err) {
      console.log("ERROR", err);
    });

    writeStream.on('error', function (err) {
      console.log("ERROR", err);
    });

Run this script with arguments like `node cp.js src.txt dest.txt`. This would mean, in the code above, that `process.argv[2]` is `src.txt` and `process.argv[3]` is `desc.txt`. Obviously, you'll need some dummy text files before you can run the script.

The code sets up a readable stream from the source file and a writable stream to the destination file. Whenever the readable stream gets data, it is written to the writeable stream. After it's done, it closes the writable stream when the readable stream is finished. **Note**: it would have been better to use [pipe](api.html#how-to-use-stream-pipe) like `readStream.pipe(writeStream);`. However, to show how streams work, we have done things the long way.

<a id="how-to-use-fs-create-read-stream"></a>

### Using fs.createReadStream()
<span class="cite">By Nico Reed (Aug 26 2011)</span>


The function `fs.createReadStream(filepath)` allows you to open up a readable stream in a very simple manner. All you have to do is pass the path of the file to start streaming in. 

Again, since the response and request objects are streams, we can create an HTTP server that streams the files to the client. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary.

    var http = require('http');
    var fs = require('fs');

    http.createServer(function(req, res) {
      // The filename is simple the local directory and tacks on the requested url
      var filename = __dirname+req.url;

      // This line opens the file as a readable stream
      var readStream = fs.createReadStream(filename);

      // This will wait until we know the readable stream is actually valid before piping
      readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res);
      });

      // This catches any errors that happen while creating the readable stream (usually invalid names)
      readStream.on('error', function(err) {
        res.end(err);
      });
    }).listen(8080);

<a id="how-to-use-fs-create-write-stream"></a>

### Using fs.createWriteStream()
<span class="cite">By Nico Reed (Aug 26 2011)</span>


The function `fs.createWriteStream()` creates a writable stream in a very simple manner. After a call to `fs.createWriteStream(filepath)`, you have a writeable stream to work with directly to your `filepath`. 

When you [create an HTTP server](api.html#how-to-create-a-http-server), the response and request objects are streams. We can stream the POST data to a file called `output`. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary.

    var http = require('http');
    var fs = require('fs');

    http.createServer(function(req, res) {
      // This opens up the writeable stream to `output`
      var writeStream = fs.createWriteStream('./output');

      // This pipes the POST data to the file
      req.pipe(writeStream);

      // After all the data is saved, respond with a simple html form so they can post more data
      req.on('end', function () {
        res.writeHead(200, {"content-type":"text/html"});
        res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
      });

      // This is here incase any errors occur
      writeStream.on('error', function (err) {
        console.log(err);
      });
    }).listen(8080);

<a id="how-to-use-stream-pipe"></a>

### Using the Stream Pipe
<span class="cite">By Charlie McConnell (Aug 26 2011)</span>


If you've been using Node.js for a while, you've definitely run into streams. HTTP connections are streams,  open files are streams;  `stdin`, `stdout`, and `stderr` are all streams as well.  If you feel like you still need to understand them better, you can read more about them [here](http://nodejs.org/docs/latest/api/streams.html).

Streams make for quite a handy abstraction, and there's a lot you can do with them. As an example, let's take a look at `pipe()`, the method used to take a readable stream and connect it to a writeable steam.  Suppose we wanted to spawn a child process and pipe our "parent" `stdout` and `stdin` to the corresponding `stdout` and `stdin`. We might do something like this:

     #!/usr/bin/env node

     var child = require('child_process');

     // spawn the node REPL as a child process
     var myREPL = child.spawn('node');

     // pipe our stdin and stdout into the child stdin/stdout
     myREPL.stdout.pipe(process.stdout, { end: false });
     process.stdin.resume();
     process.stdin.pipe(myREPL.stdin, { end: false });

     myREPL.stdin.on('end', function() {
       process.stdout.write('REPL stream ended.');
     });

     myREPL.on('exit', function (code) {
       process.exit(code);
     });

There it is. Make sure to listen for the child's `exit` event, or else your program will just hang there when the REPL exits.

Another use for `pipe()` is for file streams.  In Node.js, `fs.createReadStream()` and `fs.createWriteStream()` are used to create a stream to an open file descriptor.  Let's look at how one might use `pipe()` to write to a file.  You'll probably recognize most of the code:

     #!/usr/bin/env node

     var child = require('child_process'),
         fs = require('fs');

     var myREPL = child.spawn('node'),
         myFile = fs.createWriteStream('myOutput.txt');

     myREPL.stdout.pipe(process.stdout, { end: false });
     myREPL.stdout.pipe(myFile);

     process.stdin.resume();

     process.stdin.pipe(myREPL.stdin, { end: false });
     process.stdin.pipe(myFile);

     myREPL.stdin.on("end", function() {
       process.stdout.write("REPL stream ended.");
     });

     myREPL.on('exit', function (code) {
       process.exit(code);
     });

With those small additions, your `stdin` and the `stdout` from your REPL will both be piped to the writeable file stream you opened to `myOutput.txt`.  It's that simple; you can pipe streams to as many places as you want.

One very important use case for `pipe()` is with HTTP request and response objects.  Here we have the very simplest kind of proxy:

     #!/usr/bin/env node

     var http = require('http');

     http.createServer(function(request, response) {
       var proxy = http.createClient(9000, 'localhost')
       var proxyRequest = proxy.request(request.method, request.url, request.headers);
       proxyRequest.on('response', function (proxyResponse) {
         proxyResponse.pipe(response);
       });
       request.pipe(proxyRequest);
     }).listen(8080);

     http.createServer(function (req, res) {
       res.writeHead(200, { 'Content-Type': 'text/plain' });
       res.write('request successfully proxied to port 9000!' + '\n' + JSON.stringify(req.headers, true, 2));
       res.end();
     }).listen(9000);

You could also use `pipe()` to send incoming requests to a file for logging, or to a child process, or any one of a number of other things.

<a id="cryptography"></a>

## Cryptography



The [crypto](http://nodejs.org/docs/latest/api/crypto.html) module is a wrapper for [OpenSSL](http://en.wikipedia.org/wiki/Openssl) cryptographic functions. It supports calculating hashes, authenticating with HMAC, ciphers, and more!

The crypto module is mostly useful as a tool for implementing [cryptographic protocols](http://en.wikipedia.org/wiki/Cryptographic_protocol), such as [TLS](http://en.wikipedia.org/wiki/Transport_Layer_Security) and [https](http://en.wikipedia.org/wiki/Https). For most users, Node's built-in [tls module](http://nodejs.org/docs/latest/api/tls.html) and [https module](http://nodejs.org/docs/latest/api/https.html) should more than suffice. However, for the user that only wants to use small parts of what's needed for full-scale cryptography or is crazy/desperate enough to implement a protocol using OpenSSL and Node.s, this section's for you!

<a id="how-to-use-crypto-module"></a>

### Hashes
<span class="cite">By Joshua Holbrook (Aug 26 2011)</span>


#### Understanding a Hash

A hash is a fixed-length string of bits that is procedurally and deterministially generated from some arbitrary block of source data. Some important properties of these hashes (the type useful for cryptography) include:

* A fixed length: This means that, no matter what the input, the length of the hash is the same. For example, md5 hashes are always 128 bits long whether the input data is a few bits or a few gigabytes.

* Deterministic: For the same input, you should expect to be able to calculate exactly the same hash. This makes hashes useful for checksums.

* Collision-Resistant: A collision is when the same hash is generated for two different input blocks of data. Hash algorithms are designed to be extremely unlikely to have collisions--exactly how unlikely is a property of the hash algorithm. The importance of this property depends on the use case.

* Unidirectional: A good hash algorithm is easy to apply, but hard to undo. This means that, given a hash, there isn't any reasonable way to find out what the original piece of data was.

#### Hash Algorithms That Work With Crypto

The hashes that work with crypto are dependent on what your version of OpenSSL supports. If you have a new enough version of OpenSSL, you can get a list of hash types your OpenSSL supports by typing `openssl list-message-digest-algorithms` into the command line. For older versions, type `openssl list-message-digest-commands` instead. Some of the most common hash types are [sha1](http://en.wikipedia.org/wiki/Sha1) and [md5](http://en.wikipedia.org/wiki/Md5).

#### How To Calculate Hashes with Crypto

The `Crypto` module has a method called `createHash` which allows you to calculate a hash. Its only argument is a string representing the hash.

This example finds the md5 hash for the string, "Man oh man do I love node!":

    require("crypto")
      .createHash("md5")
      .update("Man oh man do I love node!")
      .digest("hex");

The `update()` method is used to push data to later be turned into a hash with the `digest()` method. `update()` can be invoked multiple times to ingest streaming data, such as buffers from a file read stream. The argument for `digest` represents the output format, and may either be "binary", "hex", or "base64". It defaults to binary.

#### HMAC

HMAC stands for Hash-based Message Authentication Code, and is a process for applying a hash algorithm to both data and a secret key that results in a single final hash. Its use is similar to that of a vanilla hash, but also allows to check the _authenticity_ of data as well as the integrity of data (as you can using md5 checksums).

The API for hmacs is very similar to that of `createHash()`, except that the method is called `createHmac()` and it takes a key as a second argument:

    require("crypto").createHmac("md5", "password")
      .update("If you love node so much why don't you marry it?")
      .digest("hex");

The resulting md5 hash is unique to both the input data and the key.

#### Ciphers

Ciphers allow you to encode and decode messages given a password.

Like crypto's hash algorithms, the cyphers that work with `Crypto` are dependent on what your version of OpenSSL supports. You can get a list of hash types your OpenSSL supports by typing `openssl list-cipher-commands` into the command line for older versions, or `openssl list-cipher-algorithms` for newer versions of OpenSSL. OpenSSL supports many ciphers. A good and popular one is [AES192](http://en.wikipedia.org/wiki/Aes192).

#### How To Use Cipher Algorithms with Crypto:

`Crypto` comes with two methods for ciphering and deciphering:

* `crypto.createCypher(algorithm, key)`
* `crypto.createDecipher(algorithm, key)`

Both of these methods take arguments similarly to `createHmac`. They also both have analogous `update()` functions. However, each use of `update()` returns a chunk of the encoded/decoded data instead of requiring one to call `digest()` to get the result. Moreover, after encoding (or decoding) your data, you will likely have to call the `final()` method to get the last chunk of encoded information.

Here's an example, slightly less trivial than previous examples, that uses crypto and [optimist](https://github.com/substack/node-optimist) to encode and decode messages from the command line:

    #!/usr/bin/env node

    var crypto = require("crypto"),
        argv = require("optimist").argv;

    if (argv.e && argv.password) {
        var cipher = crypto.createCipher("aes192", argv.password),
            msg = [];

        argv._.forEach( function (phrase) {
            msg.push(cipher.update(phrase, "binary", "hex"));
        });

        msg.push(cipher.final("hex"));
        console.log(msg.join(""));

    } else if (argv.d && argv.password) {
        var decipher = crypto.createDecipher("aes192", argv.password),
            msg = [];

        argv._.forEach( function (phrase) {
            msg.push(decipher.update(phrase, "hex", "binary"));
        });

        msg.push(decipher.final("binary"));
        console.log(msg.join(""));   
    }

Using this script to encode a message looks like this:

    $ ./secretmsg.js -e --password="popcorn" "My treasure is buried behind Carl's Jr. on Telegraph."
    6df66752b24f0886f8a6c55e56977788c2090bb657ff3bd645097f8abe11099963fb3bd9627986c60fa7e5120d8fead928cff620b37e3e79be8de519f490527a

Now, if I gave somebody the same script, my encoded message and the password, they can decode the message and find out where I buried my treasure:

    $ ./secretmsg.js -d --password="popcorn" 6df66752b24f0886f8a6c55e56977788c2090bb657ff3bd645097f8abe11099963fb3bd9627986c60fa7e5120d8fead928cff620b37e3e79be8de519f490527a
    My treasure is buried behind Carl's Jr. on Telegraph.

You should know that what I buried behind Carl's Jr was just a cigarette butt, and that this script is obviously not for serious use.

#### Signing and Verification

`Crypto` has other methods used for dealing with certificates and credentials, as used for TLS:

* `Crypto.createCredentials`
* `Crypto.createSign`
* `Crypto.createVerify`

These methods supply the last building blocks for a complete cryptographic protocol, and require an advanced knowledge of real-world cryptographic protocols to be useful. Again, it is recommended that developers use either the [tls](http://nodejs.org/docs/latest/api/tls.html) module or the [https](http://nodejs.org/docs/latest/api/https.html) module if applicable.

<a id="how-to-use-the-tls-module"></a>

### Using TLS
<span class="cite">By Joshua Holbrook (Aug 26 2011)</span>


[Transport Layer Security](http://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) is the successor to Secure Sockets Layer (SSL). It, along with SSL, are the de-facto standard cryptographic protocols for secure communications over the web. TSL encrypts communications on top of a network transport layer (typically TCP), and uses public-key cryptography to encrypt messages.

#### Public-Key Cryptography

In public-key cryptography, each peer has two keys: a public key, and a private key. The public key is shared with everyone, and the private key is kept secret. In order to encrypt a message, a computer requires its private key and the recipient's public key. Then, in order to decrypt the message, the recipient requires its _own_ private key and the _sender_'s public key.

In TLS connections, the public key is called a _[certificate](http://en.wikipedia.org/wiki/Digital_certificate)_. This is because it's "[signed](http://en.wikipedia.org/wiki/Digital_signature)" to prove that the public key belongs to its owner. TLS certificates may either be signed by a third-party certificate authority (CA), or they may be [self-signed](http://en.wikipedia.org/wiki/Self-signed_certificate). In the case of Certificate Authorities, Mozilla keeps [a list of trusted root CAs](http://mxr.mozilla.org/mozilla/source/security/nss/lib/ckfw/builtins/certdata.txt) that are generally agreed upon by most web browsers. These root CAs may then issue certificates to other signing authorities, which in turn sign certificates for the general public.

TLS support in node is relatively new. The first stable version of Node.js to support TSL and HTTPS was the v0.4 branch, which was released in early 2011. As such, the TSL APIs in Node.js are still a little rough around the edges.

#### Creating a TLS Server

In most ways, the TLS module's server API is similar to that of the net module. Besides the fact that it's for encrypted connections, the major difference is that the options object passed to `tls.connect()` or `tls.createServer()` needs to include information on both the private key and the certificate, in [pem format](http://en.wikipedia.org/wiki/X.509#Certificate_filename_extensions). Here's an example of a TLS server:

    var tls = require('tls'),
        fs = require('fs'),
        colors = require('colors'),
        msg = [
                ".-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.",
                ": :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :",
                ":    :: :  : :: :: :: :: ::   .': :   : :: :: :",
                ": :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;",
                ":_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;" 
              ].join("\n").cyan;

    var options = {
      key: fs.readFileSync('private-key.pem'),
      cert: fs.readFileSync('public-cert.pem')
    };

    tls.createServer(options, function (s) {
      s.write(msg+"\n");
      s.pipe(s);
    }).listen(8000);


In this example, a "hello world" TLS server is created, listening on port 8000. The options object includes two properties: `key` and `cert`. The contents of these properties come directly from the private key and public certificate stored on the filesystem. In this case they are binary buffers, but the TLS module can also accept unicode strings.

#### Generating Your Private Key And Certificate With OpenSSL:

In order for this example server to work, of course, you will need a private key and a certificate. You can generate both of these with OpenSSL.

First, generate a private key:

    $ openssl genrsa -out private-key.pem 1024
    Generating RSA private key, 1024 bit long modulus
    ......................................++++++
    ........++++++
    e is 65537 (0x10001)

This creates a suitable private key and writes it to `./private-key.pem`.

Next, create a Certificate Signing Request file using your private key:

    $ openssl req -new -key private-key.pem -out csr.pem
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:California
    Locality Name (eg, city) []:Oakland
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:Panco, Inc.
    Organizational Unit Name (eg, section) []:
    Common Name (eg, YOUR name) []:Joshua Holbrook
    Email Address []:josh.holbrook@gmail.com

    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:dangerface
    An optional company name []:

The purpose of this CSR is to "request" a certificate. That is, if you wanted a CA to sign your certificate, you could give this file to them to process and they would give you back a certificate.

Alternately, however, you may self-sign your certificate, again using your private key:

    $ openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem
    Signature ok
    subject=/C=US/ST=California/L=Oakland/O=Panco, Inc./CN=Joshua Holbrook/emailAddress=josh.holbrook@gmail.com
    Getting Private key

This generates your certificate. Now you're cooking!

One way to test out your new "hello world" server is to again use OpenSSL:

    $ openssl s_client -connect 127.0.0.1:8000

You should see a bunch of output regarding the handshaking process, and then at the very end you should see a big, cyan figlet banner saying, "Hi world!"

#### Connecting to a TLS Server

The `tls` module also supplies tools for connecting to such a server:

    var tls = require('tls'),
        fs = require('fs');

    var options = {
      key: fs.readFileSync('private-key.pem'),
      cert: fs.readFileSync('public-cert.pem')
    };

    var conn = tls.connect(8000, options, function() {
      if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
      } else {
        console.log("Connection not authorized: " + conn.authorizationError)
      }
        console.log();
    });

    conn.on("data", function (data) {
      console.log(data.toString());
      conn.end();
    });

The idea is similar, except instead of creating a server, this script connects to one instead. `tls.connect()` also takes an `options` object, and then returns a stream.

`tls.connect()` also fires a callback when the connection is made, which allows for checking to see if the connection is authorized---that is, if all the certificates are in order. `conn.authorized` is a boolean, and `conn.authorizationError` is a string containing the reason that the connection is unauthorized.

This is what happens when the client is run (with the server running):

    $ node client.js
    Connection not authorized: DEPTH_ZERO_SELF_SIGNED_CERT

    .-..-..-.  .-.   .-. .--. .---. .-.   .---. .-.
    : :; :: :  : :.-.: :: ,. :: .; :: :   : .  :: :
    :    :: :  : :: :: :: :: ::   .': :   : :: :: :
    : :: :: :  : `' `' ;: :; :: :.`.: :__ : :; ::_;
    :_;:_;:_;   `.,`.,' `.__.':_;:_;:___.':___.':_;

Note that self-signing the server certificate results in a non-authorized status because you're not listed as a trusted certificate authority.

It's entirely possible to "upgrade" an existing tcp connection into a TLS-encrypted one with Node.js. However, Node.js does not have a special functions for doing so as of the v0.6 branch. Therefore, it needs to be done "by-hand", using the crypto module and some undocumented `tls` module functionality. Node's documentation points to [https://gist.github.com/848444](https://gist.github.com/848444), which aims to abstract the process.

## Node.js API Reference 

Here's a link to the latest Node.js API Reference: [http://nodejs.org/docs/latest/api/](http://nodejs.org/docs/latest/api/).