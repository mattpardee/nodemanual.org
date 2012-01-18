### Handling Multi-Part Form Data

Handling form data and file uploads properly is an important and complex problem in HTTP servers.  Doing it by hand would involve parsing streaming binary data, writing it to the file system, parsing out additional form data, and several other complex concerns. Luckily, only a very few people will need to worry about it on that deep level. 

Felix Geisendorfer, one of the Node.js core committers, wrote a library called [`node-formidable`](https://github.com/felixge/node-formidable) that handles all the hard parts for you. With its friendly API, you can be parsing forms and receiving file uploads in no time.

This example is taken directly from the `node-formidable` GitHub page, with some additional explanation added.

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=formidable.example.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script>

Using `node-formidable` is definitely the simplest solution, and it is a battle-hardened, production-ready library. Let userland solve problems like this for you, so that you can get back to writing the rest of your code!