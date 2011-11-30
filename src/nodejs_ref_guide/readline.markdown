## Readline

Readline allows reading of a stream (such as STDIN) on a line-by-line basis. To use this module, add `require('readline')` to your code.

<span class="label success">Note</span> Once you've invoked this module, your Node.js program won't terminate until you've closed the interface, and the STDIN stream. Here's how to allow your program to gracefully terminate:

    var rl = require('readline');

    var i = rl.createInterface(process.stdin, process.stdout, null);
    i.question("What do you think of node.js?", function(answer) {
      // TODO: Log the answer in a database
      console.log("Thank you for your valuable feedback.");

      // These two lines together allow the program to terminate. Without
      // them, it would run forever.
      i.close();
      process.stdin.destroy();
    });

Here's an example of how to use all the methods together to craft a tiny command line interface:

    var readline = require('readline'),
      rl = readline.createInterface(process.stdin, process.stdout),
      prefix = 'OHAI> ';

    rl.on('line', function(line) {
      switch(line.trim()) {
        case 'hello':
          console.log('world!');
          break;
        default:
          console.log('Say what? I might have heard `' + line.trim() + '`');
          break;
      }
      rl.setPrompt(prefix, prefix.length);
      rl.prompt();
    }).on('close', function() {
      console.log('Have a great day!');
      process.exit(0);
    });
    console.log(prefix + 'Good to see you. Try typing stuff.');
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();


Take a look at this slightly more complicated [example](https://gist.github.com/901104), as well as [http-console](https://github.com/cloudhead/http-console) for a real-life use case.

### Events

@event `'close'`
@cb `function ()`: The callback to execute once the event fires

Emitted whenever the `in` stream receives a `^C` (`SIGINT`) or `^D` (`EOT`). This is a good way to know the user is finished using your program.

#### Examples

Example of listening for `close`, and exiting the program afterward:

    rl.on('close', function() {
      console.log('goodbye!');
      process.exit(0);
    });
    
@event `'line'`
@cb `function (line)`: The callback to execute once the event fires, `line`: The line that prompted the event

Emitted whenever the `in` stream receives a `\n`, usually received when the user hits enter, or return. This is a good hook to listen for user input.

#### Example

    rl.on('line', function (cmd) {
      console.log('You just typed: '+cmd);
    });
    
### Methods

@method `rl.close()`

  Closes `tty`.
  
@method `rl.createInterface(input, output, completer())`
@param `input`: The readable stream, `output`: The writeable stream, `completer()`: A function to use for autocompletion

Takes two streams and creates a readline interface. 

When given a substring, `completer()` returns `[[substr1, substr2, ...], originalsubstring]`.

Also, `completer()` can be run in an asynchronous manner if it accepts two arguments:

    function completer(linePartial, callback) {
        callback(null, [['123'], linePartial]);
    }

#### Example

`createInterface()` is commonly used with `process.stdin` and `process.stdout` in order to accept user input:

    var readline = require('readline'), 
        rl = readline.createInterface(process.stdin, process.stdout);

@method `rl.pause()`

  Pauses `tty`.
  
@method `rl.prompt()`

Readies readline for input from the user, putting the current `setPrompt` options on a new line, giving the user a new spot to write.

@method `rl.question(query, callback())`
@param `query`: A string to display the user, `callback()`: The function to execute once the method completes

Prepends the prompt with `query` and invokes `callback` with the user's respons after it has been entered.

#### Example

    interface.question('What is your favorite food?', function(answer) {
      console.log('Oh, so your favorite food is ' + answer);
    });
  
@method `rl.resume()`

Resumes `tty`.

@method `rl.setPrompt(prompt, length)`
@param `prompt`: The prompting character, `length`: The length before line wrapping

Sets the prompt. For example when you run `node` on the command line, you see `> `, which is Node's prompt.

@method `rl.write()`

Writes to `tty`.