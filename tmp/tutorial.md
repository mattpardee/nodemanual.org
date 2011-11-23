

&ltdiv class="hero-unit">

<a class="hiddenLink" id="tutorial"></a>

## Tutorial


&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="lesson-1-creating-a-new-account"></a>

### Lesson 1: Creating a New Account



Creating an account for the Cloud 9 IDE can be done in a few simple steps:

1. First, sign up for an account on the Cloud9 homepage, by filling in your desired username and email address and pressing the <strong>Sign me up </strong>button: 

![Sign-up Box](./images/signUp.png)

You will then see a message indicating that we have sent you an email to the address you provided with activation instructions:

![Confirmation E-mail](./images/confirmationEmail.png)

2. Now, check your email. You should receive an email from us with a link to activate the account. Click on that link. You are taken back to Cloud 9 IDE and asked to set a password for your new Cloud 9 account:

![Activate Your Account with a New Password](./images/activateAccount.png)

3. Click on **Activate**

Congratulations! You are now the proud owner of a Cloud9 account. Now, go ahead and [create your first project](#lesson2). Happy coding!&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="lesson-2-creating-a-new-project"></a>

### Lesson 2: Creating a New Project



There are various choices to be made when creating a new project in Cloud 9 IDE. In this article, we'll walk you through the creation of a new project and describe the choices you encounter.

The first step for creating a new project is to click on the "+" next to **My Projects** in the Projects tab:
![New project creation](./images/newProject.png)

At this point, you'll encounter two choices: **Create a new project** and **Clone from URL**. Here's what they mean:

#### Create a New Project
After clicking on **Create a new project**, you are taken to the screen below:
![Options for creating a new project](./images/createNewProjectOptions.png)

Enter a project name. You have three choices for the type of project you wish to create:

* **Git project** allows you to run `git` commands from the console and push your changes to [http://www.github.com](GitHub).
* **Mercurial** allows you to run `hg` commands form the console and push your changes to [https://bitbucket.org/](Bitbucket)
* **FTP** allows you to upload your files directly to an FTP server you have access to.


Make a choice for the type of project and press **Create**. That's it! You can now see your new project in the dashboard:
![New project greeting](./images/createdProject.png)

Now, just click **Start Editing** to get started!

### Clone from URL

The second option for creating a new project is to clone one from url. The url would be, for example, the url of a Github project such as *https://github.com/fjakobs/cloud9-coffeescript-example*

Let's clone this project. When you click on **Clone from URL**, you are taken to this screen:
![Options for cloning a project](./images/cloneProjectOptions.png)

Paste the GitHub URL in the textbox labeled **Source URL**. If you have a premium account, you can choose who has access to your project. For regular users, the new project will be public.

Now, checkout the project. It will be created under **My Projects**. You can now start editing it!

#### Deleting a project

Now that you know how to create a project, you should also learn how to delete one. Look at the far right side of your dashboard:
![Delete project screen](./images/deleteProject.png)

Clicking on the **Delete** button prompts the IDE to ask for confirmation:
![Confirmation of project deletion](./images/deleteConfirmation.png)

This is your last chance to change your mind. Once you have typed **delete** in the textbox and pressed the red button, your project will be gone forever from the Cloud 9 IDE. If you are sure you want to delete your project, go ahead and press the red button. Of course, if your project is hosted elsewhere, like on another git or FTP server, it still exists in those repositories.

&lt/div>


&ltdiv class="hero-unit">

<a class="hiddenLink" id="lesson-3-writing-a-nodejs-hello-world-program"></a>

### Lesson 3: Writing a Node.js Hello World program



In this article, we'll walk you through the creation of a simple Hello World program. If you followed our last two lessons, you already have a Cloud9 IDE account and you know how to create a project. To get started with Lesson 3, you'll need to first create a (GitHub or Mercurial) project. If you need a refresher on how to do this, please refer to [Lesson 2](#lesson2).

#### A Simple Node.js HTTP Server
Once you have created your project, click on the **Start Editing** button to go to the Cloud 9 IDE editor. In the editor, create a new file called `server.js`. Type the following code in the file:

    var http = require('http');
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }).listen(process.env.PORT);
        
What you just wrote is a Node.js HTTP server that returns a simple 'Hello World' page for every request. In short, you are creating an HTTP server with a callback function that is called for each request. In the callback function, you create a response with a status code of 200 (indicating that the request was fulfilled successfully) and the message "Hello World". Finally, you specify which port the server listens to. When Node.js projects run within Cloud 9 IDE, you can retrieve the port information with the `process.env.PORT` variable.

#### Running your program
With Cloud9 IDE, you can run your Node.js applications in a test environment and see the results of your coding. To run your "Hello, World" application, click on the **run** button in the menu bar. In the pop-up window that appears, add a new **run configuration** as shown in the image below:
![A new run configuration pop-up](./images/newRunConfiguration.png)

In this run configuration, called "server," the file that is executed is your "Hello World" application, which you saved in a file called `server.js`. Now, press *Run*. Your application will be deployed to one of our servers, and you will immediately see some output similar to the one below:
![Console run output](./images/RunOutput.png]

To see your application in action, click on the link created for your project. You should see your "Hello World" application open up in a new browser tab:
![Node.js Hello World in the Browser](./images/helloWorld.png).

To stop your application, go back to the editor and click on the **stop** button (next to the **run** button).&lt/div>
