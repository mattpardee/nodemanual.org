# Introduction

This is the source documentation for [Node Manual](http://www.nodemanual.org). It consists of:

* Source files for the Node.js Reference Guide, Node.js tutorials, and Node.js Javascript Reference Guide (located in _src/_)
* Resources such as CSS, Javascript, and images, for the final output (located at _resources/_)
* Templates for the design (also located at _resources/_)

For API documentation, we use [Panino](https://github.com/gjtorikian/panino-docs); for the reference material, we use [Panda-Docs](https://github.com/gjtorikian/panda-docs).

It's worth noting that there is a [git commit hook](http://book.git-scm.com/5_git_hooks.html) running on the NodeManual server. Any pushes or merges into the master branch of this repo automatically rebuilds all versions of the documentation on the website.

# Running a Build

To run the build, open your command prompt and type:

    node build.js [optional_version_number]

This launches a build of the latest documentation set, which is determined by whatever the last folder in _src/_ is. These converted HTML files are placed into _out/_. Also, a symlink called _latest/_ is created, that points to the latest output files. If you pass in `optional_version_number`, then _only_ that doc set is built, and no symlink is created.

# Contributing

We'll very gladly take any pull requests for new documentation! This source material is intended to be open and sharable to all.

# Copyright

Major content providers include:

* [Cloud9 IDE](http://www.c9.io)
* [Joyent](http://www.joyent.com/) (Node.js Reference)
* [Mozilla Foundation](http://www.mozilla.org/) (Javascript Reference)
* [Debuggable](http://www.debuggable.com/) (Various reference materials)


# License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/Text" property="dct:title" rel="dct:type">Node Manual</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.
