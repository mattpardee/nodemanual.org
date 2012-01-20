# Writing to Streams   

The function `fs.createWriteStream()` creates a writable stream in a very simple manner. After a call to `fs.createWriteStream(filepath)`, you have a writeable stream to work with directly to your `filepath`. 

When you [create an HTTP server](HTTP-servers.html), the response and request objects are streams. We can stream the POST data to a file called `output`. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary.

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/writing_to_streams/writing.streams.1.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>