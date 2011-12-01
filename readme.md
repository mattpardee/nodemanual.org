# Introduction

A demonstration build system for the Cloud 9 IDE Node.js docs.

# Running a Build

To run the build, open a console and type:

    node build/build.js b [build_type]
    
This opens up src/[build_type]/toc.json, and begins to assemble the subdirectory markdown files. These markdown files are "glued" together into the `tmp` directory. From there, they are converted into a single HTML file, and placed into `out`.

There's a special case for  the _nodejs_ref_guide_; you'll have to pass in a third parameter to indicate the version you want to build. This takes the form of x.y.z, where x, y, and z are all numerals. For example:

    node build/build.js b nodejs_ref_guide 0.6.3
    
You can also pass the word "latest" to automatically build the latest version.

Build dependencies&mdash;such as Javascript and CSS files&mdash;are located in the `build/resources` folder.

# Serving the Files

To serve the files, type:

    node build/build.js s

Note that the port is set to the Cloud 9 IDE standard of `process.env.PORT`.

# Dependencies

This build system depends on the following modules:

* colors
* optimist
* wrench
* github-flavored-markdown
* http-server
* findit

You can install them through npm. Personally, I always just install them globally, _e.g._:

    sudo npm optimist -g