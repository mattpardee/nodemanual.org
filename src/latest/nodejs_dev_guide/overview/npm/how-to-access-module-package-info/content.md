## Accessing Module Package Info

There are many situations in the world of software development where using the wrong version of a dependency or submodule can cause all sorts of pain and anguish. Node.js has a module available called `pkginfo` that can help keep these sorts of troubles at bay.

Let's take a look at pkginfo. First, install it via npm:

     npm install pkginfo

Now all we need to do is require it, and then invoke it:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.pkginfo.1.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script> 

This shows us the entire contents of the package.json, neatly displayed to the console.  If we only wanted certain pieces of information, we can just specify them like so:

<script src='http://64.30.143.68/serve?repo=git%3A%2F%2Fgithub.com%2Fc9%2Fnodedocs-examples.git&file=buffer.pkginfo.2.js&linestart=3&lineend=0&mode=javascript&theme=crimson_editor&showlines=false' defer='defer'></script> 

And only the fields we specify will be shown to us.

For more information, see [the GitHub repo for pkginfo](https://github.com/indexzero/node-pkginfo).