# Introduction

This is build system for the Cloud 9 IDE Node.js docs. It relies on the [doc-build]() as a submodule.

# Running a Build

To run the build, open your command prompt and type:

    node build.js b [nodejs_version]
    
This opens up _src/nodejs_dev_guide/toc.json_, and begins to assemble the subdirectory markdown files. These markdown files are "glued" together into the `tmp` directory. From there, they are converted into a single HTML file, and placed into `out`.

After that, a forked version of [ndoc]() runs across the Javascript files in _src/nodejs_ref_guide_. In order to accomplish this, you'll need to pass in a `[nodejs_version]` argument. This takes one of two forms:

* A string like x.y.z, where x, y, and z are all numerals. For example:

    node build/build.js b nodejs_ref_guide 0.6.3

* The word "latest" to automatically build the latest version.

Build dependencies&mdash;such as Javascript and CSS files&mdash;are located in the `build/resources` folder.

# Serving the Files

To serve the files, type:

    node build/build.js s

Note that the port is set to the Cloud 9 IDE standard of `process.env.PORT`.