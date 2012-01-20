# Reading Streams

The function `fs.createReadStream(filepath)` allows you to open up a readable stream in a very simple manner. All you have to do is pass the path of the file to start streaming in. 

Again, since the response and request objects are streams, we can create an HTTP server that streams the files to the client. Since the code is simple enough, it is pretty easy just to read through it and comment why each line is necessary:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/serving_files/fs.serving.files.3.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>