/**
class readline.interface

The class that represents a readline interface with a stdin and stdout stream.
*/

/**
readline.interface.pause() -> Void

Pauses the `tty`.

**/

/**
readline.interface.close(line) -> Void

Closes the `tty`. Without this call, your program will run indefinitely.

**/
  
/**
readline.interface.prompt() -> Void

Readies the readline for input from the user, putting the current `setPrompt` options on a new line, giving the user a new spot to write.

**/ 


/**
readline.interface.question(query, callback()) -> Void
- query (String): A string to display the user
- callback (Function): The function to execute once the method completes

Prepends the prompt with `query` and invokes `callback` with the user's respons after it has been entered.

#### Example

    readline.interface.question('What is your favorite food?', function(answer) {
      console.log('Oh, so your favorite food is ' + answer);
    });
  

**/ 


/**
readline.interface.resume() -> Void

Resumes `tty`.

**/


/**
readline.interface.setPrompt(prompt, length) -> Void
- prompt (String):  The prompting character; this can also be a phrase
- length (String):  The length before line wrapping

Sets the prompt character. For example, when you run `node` on the command line, you'll see `> `, which is Node's prompt.

**/ 


/**
readline.interface.write() -> Void

Writes to the `tty`.

**/

/**
interface@close()



Emitted whenever the `in` stream receives a `^C` (`SIGINT`) or `^D` (`EOT`). This is a good way to know the user is finished using your program.

#### Example

Example of listening for `close`, and exiting the program afterward:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.close.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>
    
**/ 


/**
interface@line(line)
- line (String): The line that prompted the event


Emitted whenever the `in` stream receives a `\n`, usually received when the user hits Enter, or Return. This is a good hook to listen for user input.

#### Example

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_ref_guide/readline/readline.line.js?linestart=3&lineend=0&showlines=false' defer='defer'></script>
**/