# Accessing Module Package Info

There are many situations in the world of software development where using the wrong version of a dependency or submodule can cause all sorts of pain and anguish. Node.js has a module available called `pkginfo` that can help keep these sorts of troubles at bay.

Let's take a look at pkginfo. First, install it via npm:

     npm install pkginfo

Now all we need to do is require it, and then invoke it:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/package_info/pkginfo.1.js?linestart=3&lineend=0&showlines=false' defer='defer'></script> 

This shows us the entire contents of the package.json, neatly displayed to the console.  If we only wanted certain pieces of information, we can just specify them like so:

<script src='http://snippets.c9.io/github.com/c9/nodemanual.org-examples/nodejs_dev_guide/package_info/pkginfo.2.js?linestart=3&lineend=0&showlines=false' defer='defer'></script> 

And only the fields we specify will be shown to us.

For more information, see [the GitHub repo for pkginfo](https://github.com/indexzero/node-pkginfo).