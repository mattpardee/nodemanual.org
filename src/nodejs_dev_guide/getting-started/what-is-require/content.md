### Defining require()

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