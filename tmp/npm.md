

&ltdiv class="hero-unit">

<a class="hiddenLink" id="node-package-manager"></a>

## Node Package Manager



The npm, short for Node Package Manager, is two things: first and foremost, it is an online repository for the publishing of open-source Node.js modules; second, it is a command-line utility for interacting with the online repository that aids in package installation, version control, and dependency management.  Most Node.js libraries and applications are published on npm, and there's already a plethora of third-party developed libraries to help your Node.js workflow move more easily. You can be search for these applications on [the npm registry](http://search.npmjs.org). 

Before working with the npm, you'll need to install the command line tool. You can follow the instructions on [the official npm website](http://npmjs.org/) for more information. 

#### Local Install

Once you have a third-party package you want to install, it can be installed with a single line command. Let's say you're hard at work one day, you come across a problem, and you decide that it's time to use that cool library you keep hearing about. npm is very simple to use: you only have to run `npm install cool_module` on the command line, and the specified module will be installed in the current directory under `./node_modules/`.  Once installed to your `node_modules` folder, you'll be able to [use `require()` on them](#what-is-require), just as if they were built-ins to Node.js.

Local installs allow you to import Node.js modules specific to the project you're working on. If you move to another project, and need the same library, you'll have to call `npm` on the package once more.

#### Global Install

There's also the concept of a "global" install. Let's say we want to globally install the [Coffescript Node.js package](https://github.com/jashkenas/coffee-script). The npm command for a global install is simple: `npm install coffee-script -g`. This will install the program and put a symlink to it into your `/usr/local/bin/` directory (for Unix, anyway). Now, any project you create can depend on the coffee-script module, without the need for multiple local installs.

Some modules also depend on the global install to add a command-line tool. In this case, running `coffee` allows you to use the coffee-script command line interface.

#### Managing Dependencies

Another important use for npm is dependency management.  When you have a Node.js project with a [package.json](#what-is-the-file-package-json) file, you can run `npm install` from the project root; npm then installs all the dependencies listed in the package.json. This makes installing a Node.js project from a git repo much easier! For example, `vows`, one of Node's testing frameworks, can be installed from git, and its single dependency, `eyes`, can be automatically handled:

    git clone https://github.com/cloudhead/vows.git
    cd vows
    npm install

After running those commands, you will see a `node_modules` folder containing all of the project dependencies specified in the package.json.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="accessing-module-package-info"></a>

### Accessing Module Package Info



There are many situations in the world of software development where using the wrong version of a dependency or submodule can cause all sorts of pain and anguish. Node.js has a module available called `pkginfo` that can help keep these sorts of troubles at bay.

Let's take a look at pkginfo. First, install it via npm:

     npm install pkginfo

Now all we need to do is require it, and then invoke it:

     var pkginfo = require('pkginfo')(module);

     console.dir(module.exports);

This shows us the entire contents of the package.json, neatly displayed to the console.  If we only wanted certain pieces of information, we can just specify them like so:

     var pkginfo = require('pkginfo')(module, 'version', 'author');

     console.dir(module.exports);

And only the fields we specify will be shown to us.

For more information, see [the GitHub repo for pkginfo](https://github.com/indexzero/node-pkginfo).&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="the-difference-between-core-libraries-and-usersubmitted-modules"></a>

### The Difference Between Core Libraries and User-Submitted Modules



Occasionally, in the discussions in the Node.js mailing lists and IRC channels, you may hear things referred to as "node-core" and "userland".

Of course, traditionally, "userland" or "userspace" refer to everything outside the operating system kernel. In that sense, Node.js itself is a "userland" program.

However, in the context of Node.js, "core" refers to the modules and bindings that are compiled into Node.js.  In general, they provide a hook into very well-understood low-level functionality which almost all networking programs require: TCP, HTTP, DNS, the file system, child processes, and a few other things. If something is fancy enough to argue about, there's a good chance it won't be part of node-core. HTTP is about as big as it gets, and if it wasn't so popular, it'd certainly not be a part of Node.js.

There are also some things in node-core that are simply too painful to do within a JavaScript environment, or which have been created to implement some browser object model (BOM) constructs which are not part of the Javascript language, but may as well be (e.g., `setTimeout()`, `setInterval()`, and `console`).

Everything else is "userland".  This includes: npm, express, request, coffee-script, mysql clients, redis clients, and so on.  You can often install these programs using [npm](http://npmjs.org/).

The question of what is properly "node-core" and what belongs in "userland" is often debated.  In general, Node.js is based on the philosophy that it should **not** come with "batteries included."  It is easier to move things out of node-core than it is to move them in, which means that core modules must continually "pay rent" in terms of providing necessary functionality that nearly everyone finds valuable.

#### This is a Good Thing.

One goal of Node's minimal core library is to encourage people to implement things in creative ways, without forcing their ideas onto everyone. With a tiny core and a vibrant user space, we can all flourish and experiment without the onerous burden of having to always agree all the time.

#### Userland Isn't Less

If anything, it's more. Building functionality in userland rather than in the node-core means:

* You have a lot more freedom to iterate on the idea.
* Everyone who wants your module can install it easily enough (if you publish it with npm).
* You have freedom to break Node.js conventions if that makes sense for your use case.

If you believe that something **really** just *needs* to be part of node's core library set, you should *still* build it as a module!  It's much more likely to be pulled into node-core if people have a chance to see your great ideas in action, and if its core principles are iterated and polished and tested with real-world use.

Changing functionality that is included in node-core is very costly.  We do it sometimes, but it's not easy, and carries a high risk of regressions.  Better to experiment outside, and then pull it into node-core once it's stable.  Once it's available as a userland package, you may even find that it's less essential to node-core than you first thought.&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="understanding-the-file-package-json"></a>

### Understanding the File Package JSON
<span class="cite">by Nico Reed (Last Updated: Aug 26 2011)</span>


All NPM packages contain a file, usually in the project root, called `package.json`. This file holds various metadata relevant to the project.  It's used to give information to `npm` that allows it to identify the project, as well as handle the project's dependencies. It can also contain other metadata such as a project description, the version of the project in a particular distribution, license information, even configuration data&mdash;all of which can be vital to both `npm` and to the end users of the package. The `package.json` file is normally located at the root directory of a Node.js project.

Node.js itself is only aware of two fields in the `package.json`:

    {
      "name" : "barebones",
      "version" : "0.0.0",
    }

The `name` field should explain itself: this is the name of your project. The `version` field is used by NPM to make sure the right version of the package is being installed. Generally, it takes the form of `major.minor.patch` where `major`, `minor`, and `patch` are integers which increase after each new release. 

For a more complete package.json, we can study the `underscore` module:

    {
      "name" : "underscore",
      "description" : "JavaScript's functional programming helper library.",
      "homepage" : "http://documentcloud.github.com/underscore/",
      "keywords" : ["util", "functional", "server", "client", "browser"],
      "author" : "Jeremy Ashkenas <jeremy@documentcloud.org>",
      "contributors" : [],
      "dependencies" : [],
      "repository" : {"type": "git", "url": "git://github.com/documentcloud/underscore.git"},
      "main" : "underscore.js",
      "version" : "1.1.6"
    }

As you can see, there are fields for the `description` and `keywords` of your projects. This helps people who find your project understand what it is in just a few words. The `author`, `contributors`, `homepage` and `repository` fields can all be used to credit the people who contributed to the project, show how to contact the author/maintainer, and give links for additional references. 

The file listed in the `main` field is the main entry point for the libary; when someone runs `require(<library name>)`, `require()` resolves this call to `require(<package.json:main>)`. 

The `dependencies` field is used to list all the dependencies of your project that are available on `npm`. When someone installs your project through `npm`, all the dependencies listed will be installed as well.  Additionally, if someone runs `npm install` in the root directory of your project, it will install all the dependencies to `./node_modules`.

It is also possible to add a `devDependencies` field to your `package.json`. These are dependencies not required for normal operation, but required or recommended if you want to patch or modify the project.  If you built your unit tests using a testing framework, for example, it would be appropriate to put the testing framework you used in your `devDependencies` field.  To install a project's `devDependencies`, simply pass the `--dev` option when you use `npm install`.

For even more options, you can look through the [online docs](https://github.com/isaacs/npm/blob/master/doc/json.md), or run `npm help json`.&lt/div>
