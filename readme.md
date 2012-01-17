# Introduction

This is the build system for the Node Manual documentation, include Node.js and Javascript Reference Guides. It relies on two repos as submodules:

* The [doc-build](https://github.com/c9/doc-build) system converts Markdown to HTML, and is used for the Node Manual documentation
* C9's fork of [ndoc](https://github.com/c9/ndoc), which takes Javascript source files and generates HTML documentation from the comments

# Running a Build

To run the build, open your command prompt and type:

    node build.js
    
This first launches doc-build, which reads _src/nodejs_dev_guide/toc.json_ and begins to assemble the subdirectory markdown files. These markdown files are modified, and placed into a `tmp` directory. From there, they are converted into HTML files, and placed into _out_.

After that, ndoc runs across the Javascript files in _src/js_doc and _src/nodejs_ref_guide_ and proceeds to convert them into HTML files placed into the _out_ directory. By default, this build system builds every version of documentation listed under _src/nodejs_ref_guide_. You could also pass in one of two values for an `[optional_nodejs_version]`:

* The word "latest," which automatically builds the latest version.

* A string like `x.y.z`, where x, y, and z are all numerals. For example:

    node build.js 0.6.3

This builds only the 0.6.3 directory. 