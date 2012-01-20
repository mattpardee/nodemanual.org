# Parsing Command Line Arguments

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

There you have i&mdash;an array containing any arguments you passed in.  Notice the first two elements: `node`, and the path to your script.  These will always be present; even if your program takes no arguments of its own, your script's interpreter and path are still considered arguments to the shell you're using.  

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
     
Once you have it, give it a try&mdash;it can really be a life-saver:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/command_line_parsing/optimist.example.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>
     
The last line was included to let you see how Optimist handles your arguments.  Here's a quick reference:

- `argv.$0` contains the first two elements of `process.argv` joined together - "node ./myapp.js"
- `argv._` is an array containing each element not attached to a flag
- Individual flags become properties of `argv`, such as with `myArgs.h` and `myArgs.help`.  Note that non-single-letter flags must be passed in as `--flag`

For more information on Optimist and the many, many other things it can do for your command-line arguments, please visit [its GitHub page](https://github.com/substack/node-optimist).