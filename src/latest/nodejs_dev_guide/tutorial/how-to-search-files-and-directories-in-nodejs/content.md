# Searching for Files

Suppose you want to list all the files in the current directory.  One approach is to use the builtin `fs.readdir()` [method](how-to-read-files-in-nodejs.html). This will get you an array of all the files and directories on the specified path:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/fs/fs.file.search.1.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

Unfortunately, if you want to do a recursive list of files, then things get much more complicated very quickly. To avoid all of this scary complexity, a Node.js userland library can save the day. [Node-findit](https://github.com/substack/node-findit), by James Halliday (aka SubStack), is a helper module to make searching for files easier.  It has interfaces to let you work with callbacks, events, or just plain old synchronously (which is not a good idea most of the time).

To install `node-findit`, simply use npm:

    npm install findit

In the same folder, create a file called `example.js`, and then add this code.  Run it with `node example.js`. This example uses the `node-findit` event-based interface.

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/fs/fs.findit.1.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>