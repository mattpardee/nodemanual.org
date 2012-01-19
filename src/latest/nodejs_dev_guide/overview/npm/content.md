# The Node Package Manager

The npm, short for Node Package Manager, is two things: first and foremost, it is an online repository for the publishing of open-source Node.js modules; second, it is a command-line utility for interacting with the online repository that aids in package installation, version control, and dependency management.  Most Node.js libraries and applications are published on npm, and there's already a plethora of third-party developed libraries to help your Node.js workflow move more easily. You can be search for these applications on [the npm registry](http://search.npmjs.org). 

Before working with the npm, you'll need to install the command line tool. You can follow the instructions on [the official npm website](http://npmjs.org/) for more information. 

#### Local Install

Once you have a third-party package you want to install, it can be installed with a single line command. Let's say you're hard at work one day, you come across a problem, and you decide that it's time to use that cool library you keep hearing about. npm is very simple to use: you only have to run `npm install cool_module` on the command line, and the specified module will be installed in the current directory under `./node_modules/`.  Once installed to your `node_modules` folder, you'll be able to [use `require()` on them](what-is-require.html), just as if they were built-ins to Node.js.

Local installs allow you to import Node.js modules specific to the project you're working on. If you move to another project, and need the same library, you'll have to call `npm` on the package once more.

#### Global Install

There's also the concept of a "global" install. Let's say we want to globally install the [Coffescript Node.js package](https://github.com/jashkenas/coffee-script). The npm command for a global install is simple: `npm install coffee-script -g`. This will install the program and put a symlink to it into your `/usr/local/bin/` directory (for Unix, anyway). Now, any project you create can depend on the coffee-script module, without the need for multiple local installs.

Some modules also depend on the global install to add a command-line tool. In this case, running `coffee` allows you to use the coffee-script command line interface.

#### Managing Dependencies

Another important use for npm is dependency management.  When you have a Node.js project with a [package.json](what-is-the-file-package-json.html) file, you can run `npm install` from the project root; npm then installs all the dependencies listed in the package.json. This makes installing a Node.js project from a git repo much easier! For example, `vows`, one of Node's testing frameworks, can be installed from git, and its single dependency, `eyes`, can be automatically handled:

    git clone https://github.com/cloudhead/vows.git
    cd vows
    npm install

After running those commands, you will see a `node_modules` folder containing all of the project dependencies specified in the package.json.