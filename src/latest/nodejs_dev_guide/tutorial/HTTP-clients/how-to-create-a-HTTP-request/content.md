### Creating HTTP GET and POST Requests

Another extremely common programming task is making an HTTP request to a web server.  Node.js provides an extremely simple API for this functionality in the form of `http.request`.

As an example, we are going to preform a GET request to [www.random.org](www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new) (which returns a random integer between 1 and 10) and print the result to the console:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=make.get.request.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

Making a POST request is just as easy. Let's make a POST request to `www.nodejitsu.com:1337`, which is running a server that will echo back what we send. The code for making a POST request is almost identical to making a GET request, with just a few simple modifications:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=make.post.request.1.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

Adding custom headers requires a few more steps. `www.nodejitsu.com:1338` is running a server that prints out the `custom` header. We'll just make a quick request to it:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=make.post.request.2.js&linestart=0&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>