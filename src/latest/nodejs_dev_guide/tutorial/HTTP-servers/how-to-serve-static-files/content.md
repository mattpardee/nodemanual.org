# Serving Static Files

A basic necessity for most [HTTP servers](how-to-create-a-HTTPS-server.html) is tbeing able to serve static files. This is not that hard to do in Node.js. First you read the file, and then you serve the file.  Here is an example of a script that will serve the files in the current directory:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/serving_files/fs.serving.files.1.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

This example takes the path requested and it serves that path, relative to the local directory. This works fine as a quick solution; however, there are a few problems with this approach. First, this code does not correctly handle MIME types. Additionally, a proper static file server should really be taking advantage of client side caching, and should send a "Not Modified" response if nothing has changed.  Furthermore, there are security bugs that can enable a malicious user to break out of the current directory, (for example, by issuing `GET /../../../`). 

Each of these can be addressed invidually without much difficulty. You can send the proper MIME type header. You can figure how to utilize the client caches. You can take advantage of `path.normalize` to make sure that requests don't break out of the current directory. But why write all that code when you can just use someone else's library? 

There is a good static file server called [node-static](https://github.com/cloudhead/node-static) written by Alexis Sellier which you can leverage. Here is a script which functions similarly to the previous one:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/serving_files/fs.serving.files.2.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

This is a fully functional file server that doesn't have any of the bugs previously mentioned. This is just the most basic set up. There are more things you can do if you investigate [the API](https://github.com/cloudhead/node-static). Since it's an open source project, you can always modify it to your needs (and contribute back to the project).