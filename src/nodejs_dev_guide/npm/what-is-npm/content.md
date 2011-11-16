### Understanding the NPM

npm, short for Node Package Manager, is two things: first and foremost, it is an online repository for the publishing of open-source Node.js projects; second, it is a command-line utility for interacting with said repository that aids in package installation, version management, and dependency management.  A plethora of Node.js libraries and applications are published on npm, and many more are added every day. These applications can be searched for on [the npm registry](http://search.npmjs.org). Once you have a package you want to install, it can be installed with a single line command.

Let's say you're hard at work one day, developing the Next Great Application.  You come across a problem, and you decide that it's time to use that cool library you keep hearing about&mdash;it happens to be [async](http://github.com/caolan/async) (as an example). Thankfully, npm is very simple to use: you only have to run `npm install async` on the command line, and the specified module will be installed in the current directory under `./node_modules/`.  Once installed to your `node_modules` folder, you'll be able to use `require()` on them, just as if they were built-ins to Node.js.

There's also the concept of a "global" install. Let's say we want to globall install the [Coffescript Node.js package](https://github.com/jashkenas/coffee-script). The npm command for a global install is simple: `npm install coffee-script -g`. This will install the program and put a symlink to it in `/usr/local/bin/`. You can then run the program from the console just like any other CLI tool.  In this case, running `coffee` will now allow you to use the coffee-script command line interface.

Another important use for npm is dependency management.  When you have a Node.js project with a [package.json](#what-is-the-file-package-json) file, you can run `npm install` from the project root, and npm will install all the dependencies listed in the package.json. This makes installing a Node.js project from a git repo much easier! For example, `vows`, one of Node's testing frameworks, can be installed from git, and its single dependency, `eyes`, can be automatically handled:

    git clone https://github.com/cloudhead/vows.git
    cd vows
    npm install

After running those commands, you will see a `node_modules` folder containing all of the project dependencies specified in the package.json.