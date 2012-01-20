# Accessing Query String Parameters

In Node.js, functionality to aid in the accessing of URL query string parameters is built into the standard library. The `url.parse()` method takes care of most of the heavy lifting.  Here is an example script using this handy function and an explanation on how it works:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/query_string_params/querystring.ex.js?linestart=3&lineend=0&showlines=false' defer='defer'></script> 

The key part of this whole script is this line:

	var queryObject = url.parse(req.url,true).query;`

Let's take a look at things from the inside-out.  First off, `req.url` looks something like `/app.js?foo=bad&baz=foo`. This is the part that is in the URL bar of the browser. Next, it gets passed to `url.parse()` which parses out the various elements of the URL. The second parameter of the function is a boolean stating whether the method should parse the query string, so we set it to `true`. Finally, we access the `.query` property, which returns us a nice, friendly JSON with our query string data. 