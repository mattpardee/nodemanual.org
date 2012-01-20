# Reading POST Data

Reading the data from a POST request (i.e. a form submission) can be a little bit of a pitfall in Node.js, so we're going to go through an example of how to do it properly.  

The first step is to listen for incoming data. The trick is to wait for the data to finish, so that you can process all the form data without losing anything. 

Here is a quick script that shows you how to do exactly that:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/read_post_data/reading.post.data.js?linestart=0&lineend=0&showlines=false' defer='defer'></script>

The variable `postHTML` is a static string containing the HTML for two input boxes and a submit box . This HTML is provided so that you can `POST` example data. This is **not** the right way to serve static HTML; to do that, see [How to Serve Static Files](how-to-serve-static-files.html) for a more proper example.

With the HTML out of the way, we [create a server](HTTP-servers.html) to listen for requests. It is important to note, when listening for POST data, that the `req` object is also an [Event Emitter](what-are-event-emitters.html).  `req`, therefore, will emit a `data` event whenever a chunk of incoming data is received; when there is no more incoming data, the `end` event is emitted. In our case, we listen for `data` events. Once all the data is recieved, we log the data to the console and send the response. 

Something important to note is that the event listeners are being added immediately after the request object is received. If you don't immediately set them, then there is a possibility of missing some of the events. If, for example, an event listener was attached from inside a callback, then the `data` and `end` events might be fired in the meantime with no listeners attached!

You can save this script to `server.js` and run it with `node server.js`. Once you run it you will notice that occassionally you will see lines with no data:  `POSTed: `. This happens because regular `GET` requests go through the same codepath. In a more real-world application, it would be proper practice to check the type of request and handle the different request types differently.