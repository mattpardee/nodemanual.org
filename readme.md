# Introduction

This is the build system for the [Node Manual](http://www.nodemanual.org) documentation, which consists of:

* Source files for the Node.js Reference Guide, Node.js tutorials, and Node.js Javascript Reference Guide
* A build system to generate this content
* Resources such as CSS, Javascript, and images, for the final output

The build system relies on two repos as submodules:

* The [doc-build](https://github.com/c9/doc-build) system converts Markdown to HTML, and is used for the Node Manual documentation
* C9's fork of [ndoc](https://github.com/c9/ndoc), which takes Javascript source files and generates HTML documentation from the comments

Remember! After you clone this repo, call 

<pre>
git submodule init
git submodule update
</pre>

# Running a Build

To run the build, open your command prompt and type:

    node build.js
    
This first launches doc-build, which reads _src/nodejs\_dev\_guide/toc.json_ and begins to assemble the subdirectory markdown files. These markdown files are modified, and placed into a `tmp` directory. From there, they are converted into HTML files, and placed into _out_.

After that, ndoc runs across the Javascript files in _src/js\_doc_ and _src/nodejs\_ref\_guide_ and proceeds to convert them into HTML files placed into the _out_ directory. By default, this build system builds every version of documentation listed under _src/nodejs_ref_guide_. You could also pass in one more argument for an `[optional_nodejs_version]`. This can be one of the following values:

* The word "latest," which automatically builds the latest version.
* A string like `x.y.z`, where x, y, and z are all numerals, to build a specific version. For example, to build the 0.6.3 branch, type:

<pre>node build.js 0.6.3</pre>

# Copyright

Content providers include:

* [Cloud9 IDE](http://www.c9.io)
* [Joyent](http://www.joyent.com/) (Node.js Reference)
* [Nodejitsu](http://nodejitsu.com/) (Node.js Articles)
* [Mozilla Foundation](http://www.mozilla.org/) (Javascript Reference)
