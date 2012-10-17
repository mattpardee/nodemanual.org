## readline

> Stability: 2 - Unstable
    
Readline allows you to read of a stream (such as STDIN) on a line-by-line basis.
To use this module, add `require('readline')` to your code.

Note that once you've invoked this module, your Node.js program won't terminate 
until you've closed the interface, and the STDIN stream. Here's how to allow 
your program to gracefully terminate:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.escaping.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

#### Example: Crafting a tiny command line interface:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

For more real-life use cases, take a look at this slightly more complicated
[example](https://gist.github.com/901104), as well as the
[http-console](https://github.com/cloudhead/http-console) module.


### readline.createInterface(options, completer()), readline.interface
- options {Object} Options to construct the interface
- completer {Function}   A function to use for autocompletion

Creates a [[readline.interface `Interface`]]. 

`options` takes the following properties:

 - `input`: The readable stream to listen to (Required).

 - `output`: The writable stream to write readline data to (Required).

 - `completer`: An optional function that is used for tab autocompletion. See
   below for an example of using this.

 - `terminal`: Pass `true` if the `input` and `output` streams should be
   treated like a TTY, and have ANSI/VT100 escape codes written to it.
   Defaults to checking `isTTY` on the `output` stream upon instantiation.

The `completer` function is given the current line entered by the user, and
should return an Array with two entries:

 1. An Array with matching entries for the completion.

 2. The substring that was used for the matching.

This ends up looking something like:
`[[substr1, substr2, ...], originalsubstring]`.

#### Example

    function completer(line) {
      var completions = '.help .error .exit .quit .q'.split(' ')
      var hits = completions.filter(function(c) { return c.indexOf(line) == 0 })
      // show all completions if none found
      return [hits.length ? hits : completions, line]
    }

Also, `completer` can be run in an asynchronous mode if it accepts two 
arguments:

    function completer(linePartial, callback) {
      callback(null, [['123'], linePartial]);
    }

`createInterface` is commonly used with `process.stdin` and
`process.stdout` in order to accept user input:

    var readline = require('readline');
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

Once you have a readline instance, you most commonly listen for the
`"line"` event.

If `terminal` is `true` for this instance, then the `output` stream will get
the best compatibility if it defines an `output.columns` property, and fires
a `"resize"` event on the `output` if/when the columns ever change
(`process.stdout` does this automatically when it is a TTY).
 
## readline.interface

The class that represents a readline interface, with input and output streams.


### readline.interface.pause()

Pauses the readline `input` stream, allowing it to be resumed later if needed.



### readline.interface.close()

Closes the `Interface` instance, relinquishing control on the `input` and
`output` streams. The [[readline.interface@close `'close'`]] event is also 
emitted.


  
### readline.interface.prompt([preserveCursor])
- preserveCursor {Boolean} Set to `true` to prevent the cursor placement being 
reset to `0`

Readies the readline for input from the user, putting the current `setPrompt`
options on a new line, giving the user a new spot to write.

This also resumes the `input` stream used with `createInterface` if it has
been paused.


### readline.interface.question(query, callback())
- query {String}  A string to display the user
- callback {Function}  The function to execute once the method completes

Prepends the prompt with `query` and invokes `callback` with the user's respons
after it has been entered.

This also resumes the `input` stream used with `createInterface` if
it has been paused.

#### Example

    readline.interface.question('What is your favorite food?', function(answer)
    {
      console.log('Oh, so your favorite food is ' + answer);
    });
  

### readline.interface.resume()

Resumes the readline `input` stream.


### readline.interface.setPrompt(prompt, length)
- prompt {String}   The prompting character; this can also be a phrase
- length {String}   The length before line wrapping

Sets the prompt character. For example, when you run `node` on the command line,
you'll see `> `, which is Node's prompt.

 

### readline.interface.write(data, [key])
- data {String} Data to write
- key {Object} Represents the key sequence; only available if the terminal 
is a TTY.

Writes `data` to `output` stream. 

This also resumes the `input` stream if it has been paused.

#### Example

    rl.write('Delete me!');
    // Simulate ctrl+u to delete the line written previously
    rl.write(null, {ctrl: true, name: 'u'});


### readline.interface@close()

Emitted when [[readline.interface.close `close()`]] is called.

Also emitted when the `input` stream receives its "end" event. The `Interface`
instance should be considered "finished" once this is emitted. For example, when
the `input` stream receives `^D`, respectively known as `EOT`.

This event is also called if there is no `SIGINT` event listener present when
the `input` stream receives a `^C`, respectively known as `SIGINT`.

#### Example

Example of listening for `close`, and exiting the program afterward:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.close.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>    
 

### readline.interface@line(line)
- line {String}  The line that prompted the event


Emitted whenever the `input` stream receives a `\n`, usually received when the user
hits Enter, or Return. This is a good hook to listen for user input.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.line.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>

### readline.interface@pause

Emitted whenever the `input` stream is paused.

Also emitted whenever the `input` stream is not paused and receives the
`SIGCONT` event.

For more information see [[readline.interface@SIGTSTP `SIGTSTP`]]
and readline.interface@SIGCONT `SIGCONT`]].

#### Example: Listening for `pause`

    rl.on('pause', function() {
      console.log('Readline paused.');
    });

### readline.interface@resume

Emitted whenever the `input` stream is resumed.

#### Example: Listening for `resume`

    rl.on('resume', function() {
      console.log('Readline resumed.');
    });


### readline.interface@SIGINT

Emitted whenever the `input` stream receives a `^C`, respectively known as
`SIGINT`. If there is no `SIGINT` event listener present when the `input`
stream receives a `SIGINT`, `pause` will be triggered.

#### Example of Listening for `SIGINT`

    rl.on('SIGINT', function() {
      rl.question('Are you sure you want to exit?', function(answer) {
        if (answer.match(/^y(es)?$/i)) rl.pause();
      });
    });

### readline.interface@SIGTSTP

Emitted whenever the `input` stream receives a `^Z`, respectively known as
`SIGTSTP`. If there is no `SIGTSTP` event listener present when the `input`
stream receives a `SIGTSTP`, the program will be sent to the background.

When the program is resumed with `fg`, the `pause` and `SIGCONT` events will be
emitted. You can use either to resume the stream.

The `pause` and `SIGCONT` events are not triggered if the stream was paused
before the program was sent to the background.

Warning: **This does not work on Windows.**

#### Example of Listening for `SIGTSTP`:

    rl.on('SIGTSTP', function() {
      // This will override SIGTSTP and prevent the program from going to the
      // background.
      console.log('Caught SIGTSTP.');
    });

### readline.interface@SIGCONT

Emitted whenever the `input` stream is sent to the background with `^Z`,
respectively known as `SIGTSTP`, and then continued with `fg(1)`. This event
only emits if the stream was not paused before sending the program to the
background.

Warning: **This does not work on Windows.**

#### Example of Listening for `SIGCONT`:

    rl.on('SIGCONT', function() {
      // `prompt` will automatically resume the stream
      rl.prompt();
    });